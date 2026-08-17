import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { translateCached } from "./deeplTranslationCache.ts";

function fakeLogger() {
  const warnings: string[] = [];
  return { warn: (msg: string) => warnings.push(msg), warnings };
}

async function withTempCacheDir<T>(fn: (cacheDir: string) => Promise<T>): Promise<T> {
  const cacheDir = await mkdtemp(path.join(tmpdir(), "deepl-cache-test-"));
  try {
    return await fn(cacheDir);
  } finally {
    await rm(cacheDir, { recursive: true, force: true });
  }
}

test("devuelve el texto sin traducir y avisa si no hay DEEPL_API_KEY", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    let fetchCalls = 0;
    const fetchImpl = (async () => {
      fetchCalls += 1;
      throw new Error("no deberia llamarse");
    }) as typeof fetch;

    const result = await translateCached("Hola mundo", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: undefined,
    });

    assert.equal(result, "Hola mundo");
    assert.equal(fetchCalls, 0);
    assert.match(logger.warnings[0] ?? "", /DEEPL_API_KEY/);
  });
});

test("llama a la API de DeepL con el texto, target_lang y auth header correctos", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    let capturedInit: RequestInit | undefined;
    let capturedUrl: string | undefined;

    const fetchImpl = (async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedInit = init;
      return new Response(
        JSON.stringify({ translations: [{ text: "Hello world" }] }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    const result = await translateCached("Hola mundo", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: "fake-key",
    });

    assert.equal(result, "Hello world");
    assert.match(capturedUrl ?? "", /deepl\.com/);

    const headers = capturedInit?.headers as Record<string, string>;
    assert.equal(headers.Authorization, "DeepL-Auth-Key fake-key");

    const body = JSON.parse(capturedInit?.body as string);
    assert.deepEqual(body.text, ["Hola mundo"]);
    assert.equal(body.target_lang, "EN-US");
  });
});

test("cachea la traduccion en disco: la segunda llamada con el mismo texto no vuelve a pegarle a la API", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    let fetchCalls = 0;

    const fetchImpl = (async () => {
      fetchCalls += 1;
      return new Response(
        JSON.stringify({ translations: [{ text: "Hello world" }] }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    const first = await translateCached("Hola mundo", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: "fake-key",
    });
    const second = await translateCached("Hola mundo", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: "fake-key",
    });

    assert.equal(first, "Hello world");
    assert.equal(second, "Hello world");
    assert.equal(fetchCalls, 1);
  });
});

test("degrada con gracia (texto original + warning) si la API de DeepL responde error", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    const fetchImpl = (async () => new Response("boom", { status: 500 })) as typeof fetch;

    const result = await translateCached("Hola mundo", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: "fake-key",
    });

    assert.equal(result, "Hola mundo");
    assert.match(logger.warnings[0] ?? "", /No se pudo traducir/);
  });
});

test("reintenta cuando la API responde 429 y traduce exitosamente en el reintento", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    let fetchCalls = 0;
    const fetchImpl = (async () => {
      fetchCalls += 1;
      if (fetchCalls === 1) return new Response("rate limited", { status: 429 });
      return new Response(
        JSON.stringify({ translations: [{ text: "Hello world" }] }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    const result = await translateCached("Hola mundo", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: "fake-key",
      sleepImpl: async () => {},
    });

    assert.equal(result, "Hello world");
    assert.equal(fetchCalls, 2);
  });
});

test("respeta el header Retry-After (segundos) antes de reintentar tras un 429", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    let fetchCalls = 0;
    const sleepCalls: number[] = [];
    const fetchImpl = (async () => {
      fetchCalls += 1;
      if (fetchCalls === 1) {
        return new Response("rate limited", { status: 429, headers: { "retry-after": "2" } });
      }
      return new Response(
        JSON.stringify({ translations: [{ text: "Hello world" }] }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    await translateCached("Hola mundo", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: "fake-key",
      sleepImpl: async (ms: number) => {
        sleepCalls.push(ms);
      },
    });

    assert.ok(sleepCalls.includes(2000), `esperaba un sleep de 2000ms, vi: ${sleepCalls.join(",")}`);
  });
});

test("agota los reintentos en 429 continuos y degrada con gracia devolviendo el texto original", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    let fetchCalls = 0;
    const fetchImpl = (async () => {
      fetchCalls += 1;
      return new Response("rate limited", { status: 429 });
    }) as typeof fetch;

    const result = await translateCached("Hola mundo", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: "fake-key",
      sleepImpl: async () => {},
      maxRetries: 3,
    });

    assert.equal(result, "Hola mundo");
    assert.equal(fetchCalls, 4);
    assert.match(logger.warnings.at(-1) ?? "", /No se pudo traducir/);
  });
});

test("serializa llamadas concurrentes a la API: nunca hay mas de una en vuelo a la vez", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    let inFlight = 0;
    let maxInFlight = 0;
    const fetchImpl = (async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inFlight -= 1;
      return new Response(
        JSON.stringify({ translations: [{ text: "x" }] }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    await Promise.all([
      translateCached("uno", "EN-US", logger, { cacheDir, fetchImpl, apiKey: "k", sleepImpl: async () => {} }),
      translateCached("dos", "EN-US", logger, { cacheDir, fetchImpl, apiKey: "k", sleepImpl: async () => {} }),
      translateCached("tres", "EN-US", logger, { cacheDir, fetchImpl, apiKey: "k", sleepImpl: async () => {} }),
    ]);

    assert.equal(maxInFlight, 1);
  });
});

test("devuelve el texto vacio tal cual sin llamar a la API", async () => {
  await withTempCacheDir(async (cacheDir) => {
    const logger = fakeLogger();
    let fetchCalls = 0;
    const fetchImpl = (async () => {
      fetchCalls += 1;
      throw new Error("no deberia llamarse");
    }) as typeof fetch;

    const result = await translateCached("   ", "EN-US", logger, {
      cacheDir,
      fetchImpl,
      apiKey: "fake-key",
    });

    assert.equal(result, "   ");
    assert.equal(fetchCalls, 0);
  });
});

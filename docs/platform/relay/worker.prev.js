export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("X-Notion-Signature");

    let parsed = null;
    try {
      parsed = JSON.parse(rawBody);
    } catch (e) {
      parsed = null;
    }

    if (parsed && parsed.verification_token) {
      console.log("Notion webhook verification payload received");
      try {
        await env.RELAY_KV.put("verification_token", parsed.verification_token);
      } catch (e) {
        console.log("KV put failed:", e.message);
      }
      return new Response("OK", { status: 200 });
    }

    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }

    if (!env.NOTION_WEBHOOK_SECRET) {
      console.log("NOTION_WEBHOOK_SECRET not configured yet; rejecting signed event");
      return new Response("Secret not configured yet", { status: 503 });
    }

    const expected = await hmacSha256Hex(env.NOTION_WEBHOOK_SECRET, rawBody);
    if (("sha256=" + expected) !== signature) {
      return new Response("Invalid signature", { status: 401 });
    }

    if (!parsed) {
      return new Response("Bad payload", { status: 400 });
    }

    console.log("Notion event received:", parsed.type);

    const deployResponse = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
    console.log("Deploy hook triggered, status:", deployResponse.status);

    return new Response("OK", { status: 200 });
  },

  // Rebuild diario: mantiene el HTML/SEO servido al dia (la agenda /eventos
  // deja de listar eventos ya sucedidos aunque nadie edite Notion ni haga push).
  async scheduled(event, env, ctx) {
    if (!env.DEPLOY_HOOK_URL) {
      console.log("DEPLOY_HOOK_URL not configured; skipping scheduled rebuild");
      return;
    }
    const r = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
    console.log("Scheduled rebuild triggered (cron " + event.cron + "), status:", r.status);
  },
};

async function hmacSha256Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

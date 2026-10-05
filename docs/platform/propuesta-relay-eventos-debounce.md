# Propuesta: `notion-deploy-relay` con debounce y filtro de propiedades para eventos

Estado: **PROPUESTA, no desplegada.** Código base leído el 2026-10-05 con
`GET /accounts/{id}/workers/scripts/notion-deploy-relay/content/v2`.

## Hallazgos sobre el Worker actual

1. No filtra por fuente ni por tipo de evento: todo POST firmado dispara el Deploy Hook.
2. Por eso la base de eventos YA dispara builds (la suscripción de Notion es por integración). Historial
   de Cloudflare Pages: ráfaga de ~19 deploys `deploy_hook` entre 06:05 y 06:58 UTC del 2026-10-04
   (1 cada ~2 min), coincidente con la reclasificación de taxonomía.
3. Cada edición de `Notas`, `Verificación`, `AI Score`, etc. (SILVIA/Make) reconstruye el sitio sin cambiar nada público.

Conclusión: no hay que "agregar" la base al Worker. Hay que **reducir el ruido** sin perder cambios reales.

## Diseño

- **Filtro por propiedad (solo base de eventos).** Si el evento viene de la base de eventos y es
  `page.properties_updated`, solo es relevante si `data.updated_properties` intersecta la whitelist pública
  (los mismos campos que lee `mapEvent`). `page.created/deleted/undeleted/moved` son relevantes.
  Los eventos de cualquier otra fuente conservan el comportamiento actual (deploy inmediato).
- **Debounce trailing por Cron.** Un evento relevante de eventos NO despliega: marca `events_rebuild_pending`
  en `RELAY_KV`. Un Cron `*/5 * * * *` revisa la marca y, si existe, la borra y dispara el Deploy Hook una sola vez.
  Máximo 12 builds/hora, latencia máxima 5 min, y la última edición de una ráfaga nunca se pierde.
- Un deploy inmediato de otra fuente también limpia la marca (ese build ya incluye los cambios de eventos).
- Los IDs de propiedad de Notion vienen URL-encoded en la API (`%3DQzf`); se comparan decodificados.

### IDs (leídos de la API el 2026-10-05, base `d8a0aaf3-ebb5-4ee0-8add-4b830b8a2350`, data source `7c2e4e81-be2f-428c-ad64-73c05beea6b5`)

| Propiedad | ID decodificado | En whitelist |
|---|---|---|
| Nombre | `title` | sí |
| Fecha del evento | `xY=Z` | sí |
| Ciudad | `aQIg` | sí |
| Modalidad | `` `deh `` | sí |
| Tipo | ``l>\a`` | sí |
| Categorías | `eU[` | sí (alimenta Scope) |
| Conceptos | `=Qzf` | sí |
| Organizador | `dKpJ` | sí |
| Resumen | ``gU^` `` | sí |
| Enlace Oficial | `alLa` | sí |
| Status de Ticket | `l_<R` | sí |
| Publicación | `UVgN` | sí |
| Notas, Verificación, Fuente, Prioridad, AI Score/Evaluación, Fotos, Sede, Última * , fórmulas | — | no |

Si en el futuro `mapEvent` lee otra propiedad, hay que añadir su ID aquí (comentario en el código).

## Diff propuesto (contra el código vivo)

```diff
 export default {
   async fetch(request, env) {
@@
     console.log("Notion event received:", parsed.type);
 
-    const deployResponse = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
-    console.log("Deploy hook triggered, status:", deployResponse.status);
-
-    return new Response("OK", { status: 200 });
+    if (isEventsSource(parsed)) {
+      if (!isRelevantEventsChange(parsed)) {
+        console.log("Events change ignored (no public property touched):", parsed.type);
+        return new Response("OK", { status: 200 });
+      }
+      // Debounce trailing: el Cron de 5 min dispara el build una sola vez.
+      await env.RELAY_KV.put(PENDING_KEY, new Date().toISOString());
+      console.log("Events rebuild marked pending:", parsed.type);
+      return new Response("OK", { status: 200 });
+    }
+
+    const deployResponse = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
+    console.log("Deploy hook triggered, status:", deployResponse.status);
+    // Este build ya incluye cualquier cambio pendiente de eventos.
+    await env.RELAY_KV.delete(PENDING_KEY);
+
+    return new Response("OK", { status: 200 });
   },
 
-  // Rebuild diario: mantiene el HTML/SEO servido al dia (la agenda /eventos
-  // deja de listar eventos ya sucedidos aunque nadie edite Notion ni haga push).
   async scheduled(event, env, ctx) {
     if (!env.DEPLOY_HOOK_URL) {
       console.log("DEPLOY_HOOK_URL not configured; skipping scheduled rebuild");
       return;
     }
+    if (event.cron === FLUSH_CRON) {
+      // Flush del debounce de eventos: solo si hay cambios pendientes.
+      const pending = await env.RELAY_KV.get(PENDING_KEY);
+      if (!pending) return;
+      await env.RELAY_KV.delete(PENDING_KEY);
+      const r = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
+      console.log("Debounced events rebuild triggered, status:", r.status);
+      if (!r.ok) await env.RELAY_KV.put(PENDING_KEY, pending); // reintenta en 5 min
+      return;
+    }
+    // Rebuild diario: mantiene el HTML/SEO servido al dia (la agenda /eventos
+    // deja de listar eventos ya sucedidos aunque nadie edite Notion ni haga push).
     const r = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
     console.log("Scheduled rebuild triggered (cron " + event.cron + "), status:", r.status);
   },
 };
+
+// ...constantes y helpers del bloque siguiente (PENDING_KEY, FLUSH_CRON,
+// isEventsSource, isRelevantEventsChange)...
```

### Bloque a añadir al final del archivo (constantes y helpers)

```js
const PENDING_KEY = "events_rebuild_pending";
const FLUSH_CRON = "*/5 * * * *";

const norm = (id) => String(id || "").replace(/-/g, "").toLowerCase();
const EVENTS_PARENT_IDS = new Set([
  norm("d8a0aaf3-ebb5-4ee0-8add-4b830b8a2350"), // database
  norm("7c2e4e81-be2f-428c-ad64-73c05beea6b5"), // data source
]);

// Propiedades que lee mapEvent (src/services/notionEvents.ts), IDs decodificados.
const EVENTS_PUBLIC_PROPERTY_IDS = new Set([
  "title", "xY=Z", "aQIg", "`deh", "l>\\a", "eU[", "=Qzf",
  "dKpJ", "gU^`", "alLa", "l_<R", "UVgN",
]);
const EVENTS_STRUCTURAL_TYPES = new Set([
  "page.created", "page.deleted", "page.undeleted", "page.moved",
]);

function parentIds(parsed) {
  const p = (parsed && parsed.data && parsed.data.parent) || {};
  return [p.id, p.data_source_id, p.database_id].map(norm).filter(Boolean);
}

function isEventsSource(parsed) {
  return parentIds(parsed).some((id) => EVENTS_PARENT_IDS.has(id));
}

function decodeId(id) {
  try { return decodeURIComponent(id); } catch (e) { return id; }
}

function isRelevantEventsChange(parsed) {
  if (EVENTS_STRUCTURAL_TYPES.has(parsed.type)) return true;
  if (parsed.type !== "page.properties_updated") return false; // content_updated, locked, etc.: el loader no lee el body
  const updated = (parsed.data && parsed.data.updated_properties) || [];
  // Sin lista de propiedades no se puede descartar: se trata como relevante.
  if (updated.length === 0) return true;
  return updated.some((id) => EVENTS_PUBLIC_PROPERTY_IDS.has(decodeId(id)));
}
```

## Despliegue (cuando se apruebe)

1. Subir el script con `keep_bindings: ["secret_text"]` y re-declarar el binding `RELAY_KV` (namespace actual).
2. Re-fijar los schedules con **ambos** crons (el PUT reemplaza todos):
   `PUT /accounts/{id}/workers/scripts/notion-deploy-relay/schedules` con
   `[{"cron":"0 13 * * *"},{"cron":"*/5 * * * *"}]`.
3. Confirmar con `GET .../schedules` y `GET .../content/v2` que quedó lo esperado.

## Pruebas antes de desplegar

- Test local del módulo con `env` simulado (KV en memoria + `fetch` espiado): (a) evento de eventos con `Notas` → no marca
  pendiente; (b) con `Categorías` → marca pendiente y no llama al hook; (c) cron `*/5` con pendiente → 1 llamada y limpia
  la marca; (d) cron `*/5` sin pendiente → 0 llamadas; (e) evento de otra fuente → deploy inmediato; (f) cron diario → deploy.
- Validar contra un payload real: la forma exacta de `data.parent` y `updated_properties` en la versión de API del
  webhook no está verificada aquí (se leyó solo la doc, no hay un payload capturado). Antes de activar, registrar un payload
  real (`console.log(rawBody)` temporal o `wrangler tail`) editando una propiedad de un evento de prueba.

## Riesgos

- Si Notion enviara `parent` con otra forma, `isEventsSource` daría falso y el evento caería al camino inmediato
  (comportamiento actual, no se pierde nada, solo no se reduce el ruido).
- Latencia de hasta 5 min para cambios de eventos (aceptable: el sitio ya depende de un cron diario para vigencia).
- KV es eventualmente consistente: una marca podría leerse con retraso de segundos; el siguiente cron la recoge.

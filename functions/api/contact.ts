import { handleContact, type ContactEnv } from "../_lib/handleContact.ts";

interface PagesContext {
  request: Request;
  env: ContactEnv;
}

// Cloudflare Pages enruta functions/api/contact.ts a /api/contact. Toda la
// logica vive en functions/_lib/handleContact.ts para poder probarla sin Workers.
export const onRequest = (context: PagesContext): Promise<Response> =>
  handleContact(context.request, context.env);

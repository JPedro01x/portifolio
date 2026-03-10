import type { IncomingMessage, ServerResponse } from "http";
import { json, setCookie } from "./_utils.js";

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse) {
  if (req.method !== "POST") {
    json(res, 405, { error: "method_not_allowed" });
    return;
  }

  setCookie(res, `admin_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
  json(res, 200, { ok: true });
}

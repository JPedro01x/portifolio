import type { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";
import { getEnv, json, readJsonBody, setCookie } from "./_utils";

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse) {
  if (req.method !== "POST") {
    json(res, 405, { error: "method_not_allowed" });
    return;
  }

  const body = await readJsonBody(req);
  const username = String(body?.username ?? "");
  const password = String(body?.password ?? "");

  const ADMIN_USERNAME = getEnv("ADMIN_USERNAME");
  const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD");
  const AUTH_SECRET = getEnv("AUTH_SECRET");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    json(res, 401, { error: "invalid_credentials" });
    return;
  }

  const issuedAt = Date.now();
  const payload = `${username}.${issuedAt}`;
  const signature = sign(payload, AUTH_SECRET);
  const token = `${payload}.${signature}`;

  setCookie(
    res,
    `admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60 * 60 * 24 * 7}`
  );

  json(res, 200, { ok: true });
}

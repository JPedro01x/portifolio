import type { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";
import { getEnv, json, parseCookies, readJsonBody } from "./_utils";

const KV_KEY = "portfolio_content_v1";

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function isValidSession(req: IncomingMessage, secret: string) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["admin_session"];
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const username = parts[0];
  const issuedAt = Number(parts[1]);
  const signature = parts[2];
  if (!username || !issuedAt || !signature) return false;

  const maxAgeMs = 1000 * 60 * 60 * 24 * 7;
  if (Date.now() - issuedAt > maxAgeMs) return false;

  const payload = `${username}.${issuedAt}`;
  const expected = sign(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

async function kvGet(url: string, token: string, key: string) {
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`kv_get_failed_${res.status}`);
  }
  const data = await res.json();
  return data?.result ?? null;
}

async function kvSet(url: string, token: string, key: string, value: any) {
  const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Upstash REST aceita o valor como string no body.
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: value,
  });
  if (!res.ok) {
    throw new Error(`kv_set_failed_${res.status}`);
  }
  const data = await res.json();
  return data?.result ?? null;
}

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse) {
  const UPSTASH_REDIS_REST_URL = getEnv("UPSTASH_REDIS_REST_URL");
  const UPSTASH_REDIS_REST_TOKEN = getEnv("UPSTASH_REDIS_REST_TOKEN");

  if (req.method === "GET") {
    try {
      const result = await kvGet(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, KV_KEY);
      if (typeof result === "string") {
        try {
          json(res, 200, { ok: true, data: JSON.parse(result) });
          return;
        } catch {
          json(res, 200, { ok: true, data: result });
          return;
        }
      }
      json(res, 200, { ok: true, data: result });
    } catch (e: any) {
      json(res, 200, { ok: true, data: null });
    }
    return;
  }

  if (req.method === "POST") {
    const AUTH_SECRET = getEnv("AUTH_SECRET");
    if (!isValidSession(req, AUTH_SECRET)) {
      json(res, 401, { error: "unauthorized" });
      return;
    }

    const body = await readJsonBody(req);
    if (!body || typeof body !== "object") {
      json(res, 400, { error: "invalid_body" });
      return;
    }

    try {
      // Salva sempre como JSON string para garantir compatibilidade no KV.
      await kvSet(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, KV_KEY, JSON.stringify(body));
      json(res, 200, { ok: true });
    } catch (e: any) {
      json(res, 500, { error: "save_failed" });
    }
    return;
  }

  json(res, 405, { error: "method_not_allowed" });
}

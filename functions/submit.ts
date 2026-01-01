export interface Env {
  CONTACTS_KV: KVNamespace;
  TURNSTILE_SECRET_KEY: string;
}

type SubmissionType = "newsletter" | "contact";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  try {
    const form = await request.formData();
    const rawType = String(form.get("type") || "newsletter");
    if (rawType !== "newsletter" && rawType !== "contact") {
      return json({ error: "Invalid submission type" }, 400);
    }
    const type = rawType as SubmissionType;
    const email = (form.get("email") || "").toString().trim();
    const name = (form.get("name") || "").toString().trim();
    const message = (form.get("message") || "").toString().trim();
    const source = (form.get("source") || "landing").toString();
    const token = (form.get("cf-turnstile-response") || "").toString();

    if (!token) return json({ error: "Turnstile token missing" }, 400);

    // Verify Turnstile
    const ip = (request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const verifyData = await verifyRes.json<any>();
    if (!verifyData?.success) {
      return json({ error: "Turnstile verification failed" }, 400);
    }

    // Basic rate limiting (1/min by IP hash + type)
    const ipHash = await hash(ip);
    const rlKey = `rate:${type}:${ipHash}`;
    const existing = await env.CONTACTS_KV.get(rlKey);
    if (existing) {
      return json({ error: "Too many requests. Please wait a minute." }, 429);
    }
    await env.CONTACTS_KV.put(rlKey, "1", { expirationTtl: 60 });

    // Validate
    if (type === "newsletter") {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
        return json({ error: "Invalid email" }, 400);
      }
    }
    if (type === "contact") {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
        return json({ error: "Invalid email" }, 400);
      }
      const len = message.trim().length;
      if (len < 10 || len > 2000) {
        return json({ error: "Message must be 10-2000 characters" }, 400);
      }
    }

    // Store in KV
    const key = `sub:${type}:${Date.now()}:${ipHash}`;
    const ua = request.headers.get("user-agent") || "";
    const record = {
      type,
      email: email || undefined,
      name: name || undefined,
      message: message || undefined,
      source,
      ts: Date.now(),
      ipHash,
      ua,
    };
    await env.CONTACTS_KV.put(key, JSON.stringify(record));

    return json({ ok: true }, 200);
  } catch (err) {
    return json({ error: "Server error" }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function hash(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

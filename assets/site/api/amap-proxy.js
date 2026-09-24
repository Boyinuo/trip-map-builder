export default async function handler(req, res) {
  const securityCode = process.env.AMAP_JS_SECURITY_CODE;
  if (!securityCode) {
    res.status(500).json({ error: "AMAP_JS_SECURITY_CODE is not configured" });
    return;
  }

  const rawPath = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : String(req.query.path || "");

  if (!/^v[34]\/[A-Za-z0-9_./-]+$/.test(rawPath)) {
    res.status(400).json({ error: "Unsupported AMap proxy path" });
    return;
  }

  const base = rawPath.startsWith("v4/map/styles")
    ? "https://webapi.amap.com/"
    : "https://restapi.amap.com/";
  const target = new URL(rawPath, base);

  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path") continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) target.searchParams.append(key, String(item));
  }
  target.searchParams.set("jscode", securityCode);

  const method = String(req.method || "GET").toUpperCase();
  if (!new Set(["GET", "POST", "HEAD"]).has(method)) {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const headers = {};
  if (req.headers["content-type"]) headers["content-type"] = req.headers["content-type"];
  const init = { method, headers };
  if (method === "POST") {
    const contentType = String(req.headers["content-type"] || "");
    if (typeof req.body === "string" || Buffer.isBuffer(req.body)) {
      init.body = req.body;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      init.body = new URLSearchParams(req.body || {}).toString();
    } else {
      init.body = JSON.stringify(req.body || {});
    }
  }

  try {
    const upstream = await fetch(target, init);
    const body = await upstream.arrayBuffer();
    res.status(upstream.status);
    res.setHeader("content-type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.send(Buffer.from(body));
  } catch {
    res.status(502).json({ error: "AMap upstream request failed" });
  }
}

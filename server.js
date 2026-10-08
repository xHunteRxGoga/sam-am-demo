const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const port = Number(process.env.PORT) || 5173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type || "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("too-large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function safeFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const file = path.normalize(path.join(root, decoded));
  if (file !== root && !file.startsWith(root + path.sep)) return null;
  return file;
}

const sessions = new Set();

function readAccess() {
  const file = path.join(root, "data", "access.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function last10(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

function bearer(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (req.method === "GET" && url.pathname === "/api/health") {
    send(res, 200, JSON.stringify({ ok: true }));
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/me") {
    send(res, sessions.has(bearer(req)) ? 200 : 401, JSON.stringify({ ok: sessions.has(bearer(req)) }));
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/login") {
    try {
      const payload = JSON.parse(await readBody(req, 100000));
      const access = readAccess();
      const phone = last10(payload.phone);
      const allowed = (access.phones || []).map(last10);
      if (!allowed.includes(phone) || String(payload.password || "") !== String(access.password || "")) {
        send(res, 401, JSON.stringify({ ok: false, error: "Неверный номер или пароль" }));
        return;
      }
      const token = crypto.randomBytes(24).toString("hex");
      sessions.add(token);
      send(res, 200, JSON.stringify({ ok: true, token }));
    } catch (error) {
      send(res, 400, JSON.stringify({ ok: false, error: "Не удалось войти" }));
    }
    return;
  }
  if (req.method === "POST" && (url.pathname === "/api/menu" || url.pathname === "/api/upload")) {
    if (!sessions.has(bearer(req))) {
      send(res, 401, JSON.stringify({ ok: false, error: "Войдите в панель" }));
      return;
    }
    try {
      const payload = JSON.parse(await readBody(req, 12 * 1024 * 1024));
      if (url.pathname === "/api/menu") {
        if (!payload || !Array.isArray(payload.categories)) throw new Error("bad-menu");
        fs.mkdirSync(path.join(root, "data"), { recursive: true });
        fs.writeFileSync(path.join(root, "data", "menu.json"), JSON.stringify(payload, null, 2));
        send(res, 200, JSON.stringify({ ok: true }));
        return;
      }
      const ext = String(payload.ext || "").toLowerCase().replace(/[^a-z]/g, "");
      if (!["jpg", "jpeg", "png", "webp"].includes(ext)) throw new Error("bad-type");
      const id = String(payload.id || "photo").replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "photo";
      const dir = path.join(root, "images", "uploads");
      fs.mkdirSync(dir, { recursive: true });
      const filename = `${id}-${Date.now()}.${ext === "jpeg" ? "jpg" : ext}`;
      fs.writeFileSync(path.join(dir, filename), Buffer.from(payload.data, "base64"));
      send(res, 200, JSON.stringify({ ok: true, url: `images/uploads/${filename}` }));
    } catch (error) {
      send(res, 400, JSON.stringify({ ok: false, error: "Не удалось сохранить" }));
    }
    return;
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, JSON.stringify({ ok: false }));
    return;
  }
  let pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = safeFile(pathname);
  if (!file) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }
  fs.readFile(file, (error, buffer) => {
    if (error) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }
    send(res, 200, buffer, types[path.extname(file).toLowerCase()] || "application/octet-stream");
  });
});

server.listen(port, () => {
  console.log(`САМ·АМ! http://127.0.0.1:${port}`);
});

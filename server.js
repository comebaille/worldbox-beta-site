const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 5173);
const STATE_DIR = path.join(ROOT, ".worldbox-state");
const STATE_FILE = path.join(STATE_DIR, "state.json");
const MAX_STATE_BYTES = 5 * 1024 * 1024;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/state") {
    handleStateApi(req, res);
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res, url.pathname);
    return;
  }

  res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
  res.end("Méthode non autorisée.");
});

server.listen(PORT, () => {
  console.log(`WorldBox Beta local server: http://127.0.0.1:${PORT}/realtime-auction.html`);
});

function handleStateApi(req, res) {
  if (req.method === "GET" || req.method === "HEAD") {
    if (!fs.existsSync(STATE_FILE)) {
      res.writeHead(204);
      res.end();
      return;
    }

    res.writeHead(200, { "content-type": MIME_TYPES[".json"] });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(STATE_FILE).pipe(res);
    return;
  }

  if (req.method === "PUT" || req.method === "POST") {
    readRequestBody(req, MAX_STATE_BYTES, (error, body) => {
      if (error) {
        res.writeHead(error.status || 400, { "content-type": "text/plain; charset=utf-8" });
        res.end(error.message);
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(body || "{}");
      } catch {
        res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
        res.end("JSON invalide.");
        return;
      }

      if (!parsed || typeof parsed !== "object" || !parsed.state || typeof parsed.state !== "object") {
        res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
        res.end("État de simulation manquant.");
        return;
      }

      const savedAt = new Date().toISOString();
      const payload = {
        storageKey: String(parsed.storageKey || ""),
        savedAt,
        state: {
          ...parsed.state,
          savedAt,
        },
      };

      fs.mkdirSync(STATE_DIR, { recursive: true });
      const tempFile = `${STATE_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(payload, null, 2));
      fs.renameSync(tempFile, STATE_FILE);

      res.writeHead(200, { "content-type": MIME_TYPES[".json"] });
      res.end(JSON.stringify({ ok: true, savedAt }));
    });
    return;
  }

  if (req.method === "DELETE") {
    if (fs.existsSync(STATE_FILE)) fs.unlinkSync(STATE_FILE);
    res.writeHead(200, { "content-type": MIME_TYPES[".json"] });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
  res.end("Méthode non autorisée.");
}

function readRequestBody(req, maxBytes, callback) {
  let body = "";
  let received = 0;
  let done = false;

  const finish = (error, value) => {
    if (done) return;
    done = true;
    callback(error, value);
  };

  req.setEncoding("utf8");
  req.on("data", (chunk) => {
    received += Buffer.byteLength(chunk);
    if (received > maxBytes) {
      req.destroy();
      finish({ status: 413, message: "Sauvegarde trop volumineuse." });
      return;
    }
    body += chunk;
  });
  req.on("end", () => finish(null, body));
  req.on("error", () => finish({ status: 400, message: "Lecture de la requête impossible." }));
}

function serveStatic(req, res, pathname) {
  const requestedPath = pathname === "/" ? "/realtime-auction.html" : pathname;
  const decodedPath = decodeURIComponent(requestedPath);
  const filePath = path.normalize(path.join(ROOT, decodedPath));

  if (!filePath.startsWith(ROOT) || path.basename(filePath) === ".env") {
    res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    res.end("Accès refusé.");
    return;
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Fichier introuvable.");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "content-type": MIME_TYPES[ext] || "application/octet-stream" });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}

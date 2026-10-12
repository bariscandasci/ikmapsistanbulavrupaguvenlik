#!/usr/bin/env node
/**
 * Yerel statik sunucu ve İETT vekili.
 *
 * GET /api/iett-schedule?hat=146T
 *   Planlanan sefer: ana durak kalkış saatleri (İETT PlanlananSeferSaati).
 * GET /api/iett-live?hat=146T&durak=
 *   Hat bazlı canlı konum (İETT SeferGerceklesme). Servis hata verirse
 *   uydurma varış dakikası üretilmez.
 * GET /api/live-arrival
 *   Eski Ankara iskelet ucu. İstanbul durak kodu bu uçta yoktur.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const { liveArrival, scheduleFor, liveFor } = require("./iett");

const PORT = Number(process.env.PORT || 8820);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function sendJson(res, status, body) {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": data.length,
  });
  res.end(data);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/live-arrival") {
    sendJson(res, 200, liveArrival(url.searchParams));
    return;
  }
  if (url.pathname === "/api/iett-schedule") {
    scheduleFor(url.searchParams.get("hat") || "").then((body) => sendJson(res, 200, body));
    return;
  }
  if (url.pathname === "/api/iett-live") {
    liveFor(url.searchParams.get("hat") || "", url.searchParams.get("durak") || "").then((body) => sendJson(res, 200, body));
    return;
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  const filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log("İstanbul Avrupa güvenlik iskeleti http://" + HOST + ":" + PORT);
});

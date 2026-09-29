#!/usr/bin/env node
/**
 * Yerel statik sunucu ve canlı sefer vekili.
 *
 * GET /api/live-arrival?hat=&durak=
 * İETT canlı uç bu iskelette bağlı değildir. Geçerli hat/durak için boş tablo
 * döner; routing_engine ve LiveBus sefer aralığı / 2 yedeğine düşer.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 8820);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const HAT_RE = /^[0-9A-Za-z][0-9A-Za-z\-]{0,15}$/;
const DURAK_RE = /^\d{1,8}$/;

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

function liveArrival(query) {
  const hat = query.get("hat") || "";
  const durak = query.get("durak") || "";
  if (!HAT_RE.test(hat) || !DURAK_RE.test(durak)) {
    return { table: [], status: "FALSE", message: "hat veya durak geçersiz" };
  }
  return {
    table: [],
    status: "FALSE",
    message: "İETT canlı sefer bu iskelette bağlı değil",
    hat: hat,
    durak: durak,
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/live-arrival") {
    sendJson(res, 200, liveArrival(url.searchParams));
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

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
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 8820);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const HAT_RE = /^[0-9A-Za-z][0-9A-Za-z\-]{0,15}$/;
const DURAK_RE = /^\d{1,8}$/;
const SCHEDULE_TTL_MS = 10 * 60 * 1000;
const LIVE_TTL_MS = 60 * 1000;
const FAIL_TTL_MS = 90 * 1000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const scheduleCache = new Map();
const liveCache = new Map();

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
    message: "İstanbul sefer saati /api/iett-schedule üzerinden gelir",
    hat: hat,
    durak: durak,
  };
}

function istanbulNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date()).map((part) => [part.type, part.value])
  );
  const dayType = parts.weekday === "Sun" ? "P" : parts.weekday === "Sat" ? "C" : "I";
  const dayLabel = dayType === "P" ? "pazar" : dayType === "C" ? "cumartesi" : "hafta içi";
  return {
    dayType,
    dayLabel,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function xmlResult(xml, tag) {
  const match = String(xml).match(new RegExp(`<(?:[\\w-]+:)?${tag}[^>]*>([\\s\\S]*?)</(?:[\\w-]+:)?${tag}>`, "i"));
  return match ? match[1] : null;
}

function iettSoap(servicePath, method, params) {
  const inner = Object.entries(params)
    .map(([key, value]) => `<${key}>${String(value).replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]))}</${key}>`)
    .join("");
  const body = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><${method} xmlns="http://tempuri.org/">${inner}</${method}></soap:Body></soap:Envelope>`;
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "api.ibb.gov.tr",
      path: servicePath,
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
        SOAPAction: `http://tempuri.org/${method}`,
      },
      timeout: 15000,
    }, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error("İETT HTTP " + res.statusCode));
          return;
        }
        const raw = xmlResult(data, method + "Result");
        if (raw == null) {
          reject(new Error("İETT cevap boş"));
          return;
        }
        try {
          resolve(JSON.parse(raw));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("İETT zaman aşımı")));
    req.write(body);
    req.end();
  });
}

function clockToMinutes(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}

function formatClock(minutes) {
  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
  const minute = String(minutes % 60).padStart(2, "0");
  return hour + ":" + minute;
}

function nextDepartures(rows, now) {
  const byYon = new Map();
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (!row || row.SGUNTIPI !== now.dayType) return;
    const minutes = clockToMinutes(row.DT);
    if (minutes == null || minutes + 1 < now.minutes) return;
    const yon = row.SYON || "";
    if (!byYon.has(yon)) byYon.set(yon, new Set());
    byYon.get(yon).add(minutes);
  });
  return [...byYon.entries()].map(([yon, minutes]) => ({
    yon,
    times: [...minutes].sort((a, b) => a - b).slice(0, 5).map(formatClock),
  })).filter((dir) => dir.times.length);
}

function cached(map, key, ttl, loader) {
  const hit = map.get(key);
  const hitTtl = hit && hit.ttl ? hit.ttl : ttl;
  if (hit && Date.now() - hit.at < hitTtl) return Promise.resolve(hit.body);
  return loader().then((body) => {
    map.set(key, { at: Date.now(), body, ttl });
    return body;
  }).catch((err) => {
    const body = { ok: false, source: "static", message: err.message || "İETT cevap vermedi" };
    map.set(key, { at: Date.now(), body, ttl: FAIL_TTL_MS });
    return body;
  });
}

function scheduleFor(hat) {
  if (!HAT_RE.test(hat)) return Promise.resolve({ ok: false, source: "static", message: "hat geçersiz" });
  const now = istanbulNow();
  const key = hat + "|" + now.dayType;
  return cached(scheduleCache, key, SCHEDULE_TTL_MS, () => (
    iettSoap("/iett/UlasimAnaVeri/PlanlananSeferSaati.asmx", "GetPlanlananSeferSaati_json", { HatKodu: hat })
      .then((rows) => ({ ok: true, rows: Array.isArray(rows) ? rows : [] }))
  )).then((body) => {
    if (!body.ok) return body;
    if (!body.rows.length) {
      return { ok: false, source: "static", message: "Bu hat İETT planında yok", hat };
    }
    return {
      ok: true,
      source: "iett-plan",
      hat,
      hatAdi: body.rows[0].HATADI || hat,
      dayType: now.dayType,
      dayLabel: now.dayLabel,
      directions: nextDepartures(body.rows, now),
    };
  });
}

function liveFor(hat, durak) {
  if (!HAT_RE.test(hat)) return Promise.resolve({ ok: false, source: "static", message: "hat geçersiz" });
  const stop = DURAK_RE.test(durak) ? durak.replace(/^0+/, "") : "";
  return cached(liveCache, hat, LIVE_TTL_MS, () => (
    iettSoap("/iett/FiloDurum/SeferGerceklesme.asmx", "GetHatOtoKonum_json", { HatNo: hat })
      .then((rows) => ({ ok: true, vehicles: Array.isArray(rows) ? rows : [] }))
  )).then((body) => {
    if (!body.ok) return body;
    const vehicles = body.vehicles || [];
    const atStop = stop
      ? vehicles.filter((row) => String(row.yakinDurakKodu || "").replace(/^0+/, "") === stop).length
      : 0;
    return { ok: true, source: "iett-canli", hat, count: vehicles.length, atStop };
  });
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

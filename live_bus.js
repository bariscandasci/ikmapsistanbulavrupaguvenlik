/**
 * Canlı sefer kapısı. Tarayıcı İETT'ye doğrudan gitmez.
 * Aynı kaynaktaki /api/live-arrival isteği iletir.
 *
 * Durak kodu yoksa, servis kapalıysa veya tablo boşsa fırlatmaz:
 * çağıranın verdiği fallbackWaitMin (hat sefer aralığı / 2) ile döner.
 * Bu, routing_engine.withLiveFallback ile aynı sözleşmedir.
 */
(function () {
  var PROXY_PATH = "/api/live-arrival";
  var CACHE_MS = 20000;
  var cache = new Map();
  var inflight = new Map();

  function staticResult(stopId, lineId, hatNo, fallbackWaitMin) {
    var wait = Number(fallbackWaitMin);
    return {
      source: "static",
      estimatedWaitMin: Number.isFinite(wait) && wait >= 0 ? wait : 6,
      stopId: stopId || null,
      lineId: lineId || null,
      hatNo: hatNo || null,
    };
  }

  function liveStopNo(stopId, explicit) {
    if (explicit) return String(explicit);
    var match = String(stopId || "").match(/^iett_(\d+)$/);
    return match ? match[1] : null;
  }

  function liveWaitMin(rows, hat) {
    var best = null;
    (rows || []).forEach(function (row) {
      var codes = [row.hat_no, row.hat_kod].map(function (value) {
        return value == null ? "" : String(value);
      });
      if (codes.indexOf(String(hat)) === -1) return;
      var seconds = Number(row.saniye);
      if (!Number.isFinite(seconds) || seconds >= 999000) return;
      if (/geçti/i.test(String(row.sure || ""))) return;
      if (best == null || seconds < best) best = seconds;
    });
    if (best == null) return null;
    if (best <= 0) return 0;
    return Math.max(1, Math.ceil(best / 60));
  }

  function fetchArrival(hat, durak) {
    var key = hat + "|" + durak;
    var hit = cache.get(key);
    if (hit && Date.now() - hit.at < CACHE_MS) return Promise.resolve(hit.minutes);
    if (inflight.has(key)) return inflight.get(key);
    var url = PROXY_PATH + "?hat=" + encodeURIComponent(hat) + "&durak=" + encodeURIComponent(durak);
    var pending = fetch(url, { headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("live arrival " + res.status);
        return res.json();
      })
      .then(function (body) {
        var minutes = liveWaitMin(body && body.table, hat);
        if (minutes == null) throw new Error("no live trip");
        cache.set(key, { at: Date.now(), minutes: minutes });
        return minutes;
      })
      .finally(function () {
        inflight.delete(key);
      });
    inflight.set(key, pending);
    return pending;
  }

  function getLiveBusArrival(stopId, lineId, options) {
    var opts = options || {};
    var hat = opts.hatNo ? String(opts.hatNo) : null;
    var fallback = staticResult(stopId, lineId, hat, opts.fallbackWaitMin);
    var durak = liveStopNo(stopId, opts.liveStopNo);
    if (!hat || !durak) return Promise.resolve(fallback);
    return fetchArrival(hat, durak)
      .then(function (minutes) {
        return {
          source: "live",
          estimatedWaitMin: minutes,
          stopId: stopId,
          lineId: lineId,
          hatNo: hat,
          stopNo: durak,
        };
      })
      .catch(function () {
        return fallback;
      });
  }

  window.LiveBus = { getLiveBusArrival: getLiveBusArrival };
})();

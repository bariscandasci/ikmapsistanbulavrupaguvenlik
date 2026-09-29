#!/usr/bin/env python3
"""Yerel statik sunucu ve canlı sefer vekili.

GET /api/live-arrival?hat=&durak=
İETT canlı uç bu iskelette bağlı değildir. Geçerli parametrelerde boş tablo
döner; sayfa sefer aralığı / 2 beklemeye kendisi düşer.
"""
import json
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

HAT_RE = re.compile(r"^[0-9A-Za-z][0-9A-Za-z\-]{0,15}$")
DURAK_RE = re.compile(r"^\d{1,8}$")


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/live-arrival":
            return super().do_GET()
        self._live_arrival(parse_qs(parsed.query))

    def _live_arrival(self, query):
        hat = (query.get("hat") or [""])[0]
        durak = (query.get("durak") or [""])[0]
        if not HAT_RE.fullmatch(hat) or not DURAK_RE.fullmatch(durak):
            body = {"table": [], "status": "FALSE", "message": "hat veya durak geçersiz"}
        else:
            body = {
                "table": [],
                "status": "FALSE",
                "message": "İETT canlı sefer bu iskelette bağlı değil",
                "hat": hat,
                "durak": durak,
            }
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8820
    print(f"İstanbul Avrupa güvenlik iskeleti http://{host}:{port}")
    ThreadingHTTPServer((host, port), Handler).serve_forever()

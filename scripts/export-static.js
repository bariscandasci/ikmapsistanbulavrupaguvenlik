const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "public");
const files = [
  "index.html",
  "client.js",
  "data.js",
  "candidates.js",
  "live_bus.js",
  "transit_network.json",
  "transit_network_geometry.json",
  "dolmus_lines.json",
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const name of files) {
  fs.copyFileSync(path.join(root, name), path.join(out, name));
}
fs.cpSync(path.join(root, "assets"), path.join(out, "assets"), { recursive: true });
fs.writeFileSync(path.join(out, "ping.txt"), "ok\n");
console.log("static export", out);

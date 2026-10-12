const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
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

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const name of files) {
  fs.copyFileSync(path.join(root, name), path.join(dist, name));
}
fs.cpSync(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
console.log("static export", dist);

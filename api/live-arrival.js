const { liveArrival } = require("../iett");

function send(res, body) {
  const data = JSON.stringify(body);
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(data);
}

module.exports = (req, res) => {
  const raw = req && req.url ? req.url : "/";
  let params = new URLSearchParams();
  try {
    params = new URL(raw, "http://localhost").searchParams;
  } catch (err) {
    params = new URLSearchParams();
  }
  try {
    send(res, liveArrival(params));
  } catch (err) {
    send(res, { table: [], status: "FALSE", message: err.message || "İETT cevap vermedi" });
  }
};

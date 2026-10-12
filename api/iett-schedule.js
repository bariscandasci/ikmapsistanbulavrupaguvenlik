const { scheduleFor } = require("../iett");

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
  let hat = "";
  try {
    hat = new URL(raw, "http://localhost").searchParams.get("hat") || "";
  } catch (err) {
    hat = "";
  }
  return scheduleFor(hat).then(
    (body) => send(res, body),
    (err) => send(res, { ok: false, source: "static", message: err.message || "İETT cevap vermedi" })
  );
};

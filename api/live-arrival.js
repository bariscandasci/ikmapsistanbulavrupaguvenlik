const { liveArrival } = require("../iett");

module.exports = (req, res) => {
  const url = new URL(req.url, "http://localhost");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json(liveArrival(url.searchParams));
};

const { liveFor } = require("../iett");

module.exports = (req, res) => {
  const url = new URL(req.url, "http://localhost");
  liveFor(url.searchParams.get("hat") || "", url.searchParams.get("durak") || "").then((body) => {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(body);
  });
};

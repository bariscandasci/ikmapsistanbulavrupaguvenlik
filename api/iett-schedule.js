const { scheduleFor } = require("../iett");

module.exports = (req, res) => {
  const url = new URL(req.url, "http://localhost");
  scheduleFor(url.searchParams.get("hat") || "").then((body) => {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(body);
  });
};

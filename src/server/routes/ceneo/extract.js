const extract = require("../../routes/utils/extract");

module.exports = async function(req, res) {
  //TODO
  // sprawdzic parametry czy sa i czy sa ok.
  const phrase = req.body.phrase;
  const pagesToSearch = req.body.pagesToSearch;

  const data = await extract(phrase, pagesToSearch);

  return res.json(data);
};

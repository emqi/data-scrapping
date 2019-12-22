const extract = require("../../routes/utils/extract");
const test = require("../../../tmp/test");

module.exports = async function (req, res) {
    const phrase = req.query.phrase;
    const pagesToSearch = req.query.pagesToSearch;

    if (!(Number.isInteger(pagesToSearch) && pagesToSearch > 0))
        return res.json("wrong pages format");

    const data = await extract(phrase, pagesToSearch);

    return res.json(data);
};

const got = require("got");
const cheerio = require("cheerio");

class Scrapper {
  static async scrap(url) {
    try {
      const html = await got.get(url);
      return cheerio.load(html.body);
    } catch (error) {
      console.log("error", error);
    }
  }
}

module.exports = Scrapper;

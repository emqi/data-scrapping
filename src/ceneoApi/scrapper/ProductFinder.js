const Scrapper = require("./Scrapper.js");

class ProductFinder {
  static async *createIterator(searchPhrase) {
    let currentPage = 0;

    while (true) {
      const $ = await Scrapper.scrap(
        `https://www.ceneo.pl/;szukaj-${encodeURIComponent(
          searchPhrase
        )};0020-30-0-0-${currentPage++}.htm`
      );

      const list = $(
        "div.category-list-body.js_category-list-body.js_search-results .cat-prod-row"
      );

      const productIds = Array.from(list)
        .map(el => parseInt($(el).attr("data-pid")))
        .filter(id => !Number.isNaN(id));

      yield* productIds;

      if ($(".category-list .pagination .page-arrow.arrow-next").length <= 0) {
        return;
      }
    }
  }
}

module.exports = ProductFinder;

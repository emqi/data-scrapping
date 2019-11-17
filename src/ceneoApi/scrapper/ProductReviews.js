const Scrapper = require("./Scrapper.js");
const ProductReview = require("./ProductReview.js");

class ProductReviews {
  static reviewsBaseSelector = ".site-full-width ol.product-reviews li.review-box";

  static parsePage($) {
    const reviews = [];

    try {
      const reviewsCount = $(this.reviewsBaseSelector).length;
      for (let reviewIndex = 0; reviewIndex < reviewsCount; reviewIndex++) {
        const review = ProductReview.parse(reviewIndex, $);
        if (review) {
          reviews.push(review);
        }
      }
    } catch (ex) {}
      
    return reviews;
  }

  static async *createIterator(productId) {
    let currentPage = 1;

    while (true) {
      const $ = await Scrapper.scrap(
        `https://www.ceneo.pl/${productId}/opinie-${currentPage++}`
      );

      yield* this.parsePage($);

      // no more pages
      if (
        $(".page-tab-content.reviews .pagination .page-arrow.arrow-next")
          .length <= 0
      ) {
        break;
      }
    }
  }
}

module.exports = ProductReviews;

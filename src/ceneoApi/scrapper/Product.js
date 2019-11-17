const ProductReviews = require("./ProductReviews.js");

class Product {
  constructor(id, $) {
    this.id = id;
    this.name = this.parseName($);
    this.description = this.parseDescription($);
    this.rating = this.parseRating($);
    this.price = this.parsePrice($);
  }

  reviews() {
    return ProductReviews.createIterator(this.id);
  }

  parseName($) {
    return $(`.product-content .product-name`)
      .text()
      .trim();
  }

  parseDescription($) {
    try {
      const description = $(`.product-content .ProductSublineTags`)
        .text()
        .trim();

      return description || null;
    } catch (ex) {
      return null;
    }
  }

  parseRating($) {
    try {
      const rating = parseFloat(
        $(".product-content .prod-review .product-score")
          .text()
          .trim()
          .replace(",", ".")
      );

      return Number.isNaN(rating) ? null : rating;
    } catch (ex) {
      return null;
    }
  }

  parsePrice($) {
    try {
      const price = parseFloat(
        $(".product-content .product-price .price-format .price")
          .text()
          .trim()
          .replace(",", ".")
      );

      return Number.isNaN(price) ? null : price;
    } catch (ex) {
      return null;
    }
  }

  static parse($) {
    const id = parseInt(
      $('meta[property="product:retailer_item_id"]').attr("content")
    );

    // not a valid product
    if (Number.isNaN(id)) {
      return null;
    }

    return new Product(id, $);
  }
}

module.exports = Product;

const ProductReviews = require("./ProductReviews.js");

class Product {
  constructor(id, $) {
    this.id = id;
    this.name = this.name($);
    this.description = this.description($);
    this.rating = this.rating($);
    this.price = this.price($);
  }

  reviews() {
    return ProductReviews.createIterator(this.id);
  }

  name($) {
    return $(`.product-content .product-name`)
      .text();
  }

  description($) {
    try {
      const description = $(`.product-content .ProductSublineTags`)
        .text();

      return description || null;
    } catch (ex) {
      return null;
    }
  }

  rating($) {
    try {
      const rating = parseFloat(
        $(".product-content .prod-review .product-score")
          .text()
      );

      return Number.isNaN(rating) ? null : rating;
    } catch (ex) {
      return null;
    }
  }

  price($) {
    try {
      const price = parseFloat(
        $(".product-content .product-price .price-format .price")
          .text()
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

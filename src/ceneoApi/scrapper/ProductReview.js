class ProductReview {
  constructor(id, $) {
    this.reviewId = id;
    this.reviewer = this.parseReviewer($);
    this.rating = this.parseRating($);
    this.usefulness = this.parseUsefulness($);
    this.date = this.parseDate($);
    this.reviewedAfter = this.parseReviewedAfter($);
    this.text = this.parseText($);
    this.didUserBuyTheProduct = this.parseDidUserBuyTheProduct($);
  }

  parseReviewer($) {
    let avatarUrl = $.find("header > div.avatar-img").attr("data-bg");

    if (avatarUrl.startsWith("/")) {
      avatarUrl = "https://www.ceneo.pl" + avatarUrl;
    }

    return {
      avatar: avatarUrl,
      username: $.find("header > div.reviewer-cell > div")
        .text()
        .trim()
    };
  }

  parseRating($) {
    try {
      const rating = parseFloat(
        $.find("span.review-score-count")
          .text()
          .replace(",", ".")
          .replace("/5", "")
      );

      return Number.isNaN(rating) ? null : rating;
    } catch (ex) {}
    return null;
  }

  parseUsefulness($) {
    return {
      upvotes: parseInt($.find(`#votes-yes-${this.reviewId}`).text()) || 0,
      downvotes: parseInt($.find(`#votes-no-${this.reviewId}`).text()) || 0
    };
  }

  parseDate($) {
    const times = this.getTimes($);
    return times[0];
  }

  parseReviewedAfter($) {
    const times = this.getTimes($);

    if (times.length < 2) {
      return null;
    }
    return times[1].getTime() - times[0].getTime();
  }

  getTimes($) {
    return Array.from($.find("span.review-time > time"))
      .map(el => new Date(el.attribs["datetime"]))
      .sort((a, b) => a.getTime() - b.getTime());
  }

  parseText($) {
    return $.find("div.content-wide-col > p").text();
  }

  parseDidUserBuyTheProduct($) {
    return $.find("div.review-icons > div.product-review-pz").length > 0;
  }

  static parse(index, $) {
    const li = $(
      `.site-full-width ol.product-reviews li.review-box:nth-child(${index +
        1})`
    );

    const id = parseInt(li.attr("data-entry-id"));
    if (Number.isNaN(id)) {
      return null;
    }

    return new ProductReview(id, li);
  }
}

module.exports = ProductReview;

const CeneoAPI = require("./ceneoApi/CeneoApi");

class ExtractStep {
  api = new CeneoAPI();
  options = {};

  async process(input) {
    const productIds = await this.getProductIds(input);

    const products = [];

    for (let productId of productIds) {
      const ceneoProduct = await this.api.getProductById(productId);

      if (!ceneoProduct) {
        continue;
      }

      if (this.options.onProduct) {
        this.options.onProduct(ceneoProduct);
      }

      let reviews = [];

      for await (const productReview of ceneoProduct.reviews()) {
        reviews.push(productReview);

        if (this.options.onReview) {
          this.options.onReview(productReview, ceneoProduct);
        }
      }

      products.push({ ...ceneoProduct, reviews });
    }

    return products;
  }

  async getProductIds(input) {
    let productIds = [];

    if (typeof input === "string") {
      for await (const item of this.api.findProducts(input)) {
        productIds.push(item.productId);

        //if (this.options.onProductIdDiscovery) {
        //  this.options.onProductIdDiscovery(item.productId);
        //}
      }
    } else {
      productIds.push(...input);
    }

    return productIds;
  }
}

async function etl() {
  extract = new ExtractStep();

  const data = await extract.process("telewizor QLED");
  console.log(data);

  //transform
  //load
}

etl();

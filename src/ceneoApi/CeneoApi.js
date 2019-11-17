const Scrapper = require("./scrapper/Scrapper");
const ProductFinder = require("./scrapper/ProductFinder");
const Product = require("./scrapper/Product");

class CeneoAPI {
  async *findProducts(productName) {
    let index = 0;

    for await (const productId of ProductFinder.createIterator(productName)) {
      yield {
        index: index++,
        productId,
        getProduct: async () => {
          const product = await this.getProductById(productId);

          if (!product) {
            throw new Error(`Couldn't find product wiht id(${productId})!`);
          }

          return product;
        }
      };
    }
  }
  async getProduct() {
    const product = await this.getProductById(productId);

    if (!product) {
      throw new Error(`Couldn't find product wiht id(${productId})!`);
    }

    return product;
  }

  async getProductById(productId) {
    const $ = await Scrapper.scrap(`https://www.ceneo.pl/${productId}`);

    return Product.parse($);
  }
}

module.exports = CeneoAPI;

'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {

  async list() {
    const { ctx } = this;
    const keyword = ctx.query.keyword;
    const products = await this.service.product.findProducts(keyword);

    ctx.body = products;
  }
}

module.exports = ProductController;

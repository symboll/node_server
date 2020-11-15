'use strict';

const { Service } = require('egg');

class ProductService extends Service {

  async findProducts(keyword) {
    const clinet = this.app.mysql;
    const sql = 'select id,name, price, imgurl from product';
    if (!keyword) {
      return await clinet.query(sql);
    }
    return await clinet.query(sql + ' where name like ?', [ `%${keyword}%` ]);
  }
}

module.exports = ProductService;

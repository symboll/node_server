const { Service } = require("egg")

class HomeService extends Service {
  async index () {
    return { ok: 1 }
  }
}

module.exports = HomeService
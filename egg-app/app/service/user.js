const { Service } = require("egg")

class UserService extends Service {
  async index () {
    return this.ctx.model.User.find()
  }
  async detail (id) {
    return this.ctx.model.User.findById(id)
  }
  async create (payLoad) {
    return this.ctx.model.User.create(payLoad)
  }
  async update (id, payLoad) {
    return this.ctx.model.User.findByIdAndUpdate(id, payLoad)
  }
  async remove (id) {
    return this.ctx.model.User.findByIdAndRemove(id)
  }
}

module.exports = UserService
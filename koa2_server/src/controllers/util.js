const authCode = require('../models/authCode')
const roleModel = require('../models/role')
class Auxiliary {
  async getAuthCode (auth) {
    try {
      return await authCode.find(
        { _id: { $in: auth } },
        { _id: 0, updatedAt: 0, createdAt:0 }
      )
    }catch(e) {
      return []
    }
  }

  async getRole (roles) {
    try {
      return await roleModel.find(
        { _id: { $in: roles }}, 
        {_id: 0, auth: 0, level: 0, updatedAt: 0, createdAt:0 })
    }catch(e) {
      return []
    }
  }
}

const aux = new Auxiliary()
module.exports = aux
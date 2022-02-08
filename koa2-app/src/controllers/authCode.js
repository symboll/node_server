const authCodeModel = require('../models/authCode')
const { Success, Exception } = require('../util/res_model')
const aux = require('../server/aux')

class AuthCode {
  async list(ctx) { 
    const { query } = ctx.request
    if(Object.keys(query).length === 0) {
      const res = await aux.generalQuery(authCodeModel, 'authcode')
      ctx.body = new Success({ data: res })
    } else {
      /**
       * 模糊查询
       */
      const res = await aux.conditionalQuery(authCodeModel, query, 'authcode')
      ctx.body = new Success({ data: res })
    }
  }

  async create (ctx) {
    const { code, type } = ctx.request.body
    if(!code || !type) { 
      throw new Exception({ message: 'code or type 必填!' })
    }
    const authcode = await authCodeModel.findOne({ code, type })
    if(authcode) {
      throw new Exception({ message: '权限码已存在!' })
    }

    await aux.create(authCodeModel, { code, type })
    ctx.body = new Success({})
    ctx.status = 201
  }

  async update(ctx) {
    const id = ctx.params.id
    const { body } = ctx.request
    if(Object.keys(body) === 0) {
      throw new Exception({ message: '缺失更新参数!' })
    } 

    await aux.update(authCodeModel, id, body)
    ctx.body = new Success({})
  }

  async remove(ctx) {
    const id = ctx.params.id
    await aux.remove(authCodeModel, id)
    ctx.body = new Success({})
  }

}

module.exports = AuthCode
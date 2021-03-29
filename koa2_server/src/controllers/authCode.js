const authCodeModel = require('../models/authCode')
const ResModel = require('../util/res_model')

class AuthCode {
  async list(ctx) { 
    const { query } = ctx.request
    let res = {} 
    if(Object.keys(query).length === 0) {
      res.count = 0
      res.count = await authCodeModel.countDocuments()
      if(res.count) {
        res.authcode = await authCodeModel.find()
      }
      ctx.body = new ResModel({ data: res })
    } else {
      res.authcode = []
      const result = await authCodeModel.findOne(query)
      res.authcode.push(result)
      ctx.body = new ResModel({ data: res })
    }
  }

  async create (ctx) {
    const { code, type } = ctx.request.body
    if(!code || !type) { ctx.throw(400, 'code or type 必填!') }
    const authcode = await authCodeModel.findOne({ code, type })
    if(authcode) {ctx.throw(400, '权限码已存在!')}
    try {
      await authCodeModel.create({ code, type })
      ctx.body = new ResModel({})
    }catch (e) {
      ctx.throw(400, '创建失败!'+ e)
    }
  }

  async update(ctx) {
    const id = ctx.params.id
    const { body } = ctx.request

    const authCode = await authCodeModel.findById(id)
    if(Object.keys(body) === 0) ctx.throw(400, '缺失更新参数!')

    const updateCode = Object.assign(authCode, body)
    const { code, type } = updateCode
    try {
      await authCodeModel.findByIdAndUpdate(id, { code, type })
      ctx.body = new ResModel({})
    }catch (e) {
      ctx.throw(400, '更新失败!'+ e)
    }
  }

  async remove(ctx) {
    const id = ctx.params.id
    try {
      await authCodeModel.findByIdAndRemove(id)
      ctx.body = new ResModel({})
    }catch (e) {
      ctx.throw(400, '删除失败!' + e)
    }
  }

}

module.exports = AuthCode
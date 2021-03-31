const authCodeModel = require('../models/authCode')
const { Success, Exception } = require('../util/res_model')

class AuthCode {
  async list(ctx) { 
    const { query } = ctx.request
    let res = {} 
    if(Object.keys(query).length === 0) {
      res.count = 0
      res.count = await authCodeModel.countDocuments()
      if(res.count) {
        res.authcode = await authCodeModel.find()
          .limit(100)
          .sort({ createdAt: 'desc' })
      }
      ctx.body = new Success({ data: res })
    } else {
      /**
       * 模糊查询
       */
      const and = []
      const q = Object.keys(query)
      for(let k of q) {
        and.push({ [k] : new RegExp(query[k]) })
      }
      const result = await authCodeModel.find({
        $and: and
      }).sort({ createdAt: 'desc' })
      res.authcode = result
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
    try {
      await authCodeModel.create({ code, type })
      ctx.body = new Success({})
      ctx.status = 201
    }catch (e) {
      throw new Exception({ message: '创建失败!'+ e })
    }
  }

  async update(ctx) {
    const id = ctx.params.id
    const { body } = ctx.request

    const authCode = await authCodeModel.findById(id)
    if(Object.keys(body) === 0) {
      throw new Exception({ message: '缺失更新参数!' })
    } 

    const { code, type } = Object.assign(authCode, body)
    try {
      await authCodeModel.findByIdAndUpdate(id, { code, type })
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '更新失败!'+ e })
    }
  }

  async remove(ctx) {
    const id = ctx.params.id
    try {
      await authCodeModel.findByIdAndRemove(id)
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '删除失败!'+ e })
    }
  }

}

module.exports = AuthCode
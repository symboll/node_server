const authCodeModel = require('../models/authCode')
const { Success, Exception } = require('../util/res_model')

class AuthCode {
  async list(ctx) { 
    const { query } = ctx.request
    let res = { total: 0 } 
    try {
      if(Object.keys(query).length === 0) {
        res.total = await authCodeModel.countDocuments()
        if(res.total) {
          res.authcode = await authCodeModel.find()
            // .limit(10)
            .sort({ createdAt: 'desc' })
        }
        ctx.body = new Success({ data: res })
      } else {
        /**
         * 模糊查询
         * 存在 pageSize 或 pageNo 就认为是 分页查询
         */
        const and = []
        const { pageSize=10, pageNo=1, ...p } = query
        const q = Object.keys(p)
        for(let k of q) {
          if(k === '_id'){
            and.push({ [k]: query[k] })
          }else {
            and.push({ [k]: new RegExp(query[k]) })
          }
        }
        const fuzzy = {}
        if(and.length) fuzzy['$and'] = and
        res.total = await authCodeModel.countDocuments(fuzzy)
        if(res.total) {
          const result = await authCodeModel.find(fuzzy)
            .skip((pageNo - 1) * (parseInt(pageSize)|| 10))
            .limit(parseInt(pageSize)|| 10)
            .sort({ createdAt: 'desc' })
          res.authcode = result
        }
        ctx.body = new Success({ data: res })
      }
    }catch(e) {
      throw new Exception({ message: '查询失败!'+ e.reason ? e.reason: e.message })
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
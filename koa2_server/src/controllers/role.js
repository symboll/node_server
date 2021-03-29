const roleModel = require('../models/role')
const ResModel = require('../util/res_model')

class Role {

  async list(ctx) { 
    const { query } = ctx.request
    let res = {} 
    if(Object.keys(query).length === 0) {
      res.count = 0
      res.count = await roleModel.countDocuments()
      if(res.count) {
        res.roles = await roleModel.find()
      }
      ctx.body = new ResModel({ data: res })
    } else {
      res.roles = []
      const result = await roleModel.findOne(query)
      res.roles.push(result)
      ctx.body = new ResModel({ data: res })
    }
  }

  async create (ctx) {
    const { name, auth } = ctx.request.body
    if(!name || !auth) { ctx.throw(400, 'name or auth 必填!') }
    const role = await roleModel.findOne({name})
    if(role) {ctx.throw(400, '角色已存在!')}
    try {
      await roleModel.create({ name, auth })
      ctx.body = new ResModel({})
    }catch (e) {
      ctx.throw(400, '创建失败!'+ e)
    }
  }

  async update(ctx) {
    const id = ctx.params.id
    const { body } = ctx.request
    if(Object.keys(body) === 0) ctx.throw(400, '缺失更新参数!')
    const role = await roleModel.findById(id)
    const updateRole = Object.assign(role, body)
    const { name, auth } = updateRole
    try {
      await roleModel.findByIdAndUpdate(id, { name, auth })
      ctx.body = new ResModel({})
    }catch (e) {
      ctx.throw(400, '更新失败!'+ e)
    }
  }

  async remove(ctx) {
    const id = ctx.params.id
    try {
      await roleModel.findByIdAndRemove(id)
      ctx.body = new ResModel({})
    }catch (e) {
      ctx.throw(400, '删除失败!' + e)
    }
  }
}

module.exports = Role
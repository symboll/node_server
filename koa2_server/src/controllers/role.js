const roleModel = require('../models/role')
const { Success, Exception } = require('../util/res_model')

class Role {

  async list(ctx) { 
    const { query } = ctx.request
    let res = {} 
    if(Object.keys(query).length === 0) {
      res.count = 0
      res.count = await roleModel.countDocuments()
      if(res.count) {
        res.roles = await roleModel.find()
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
      const result = await roleModel.find({
        $and: and
      }).sort({ createdAt: 'desc' })
      res.roles = result
      ctx.body = new Success({ data: res })
    }
  }

  async create (ctx) {
    const { name, auth, level } = ctx.request.body
    if(!name || !auth || !level) { 
      throw new Exception({ message: 'name or auth or level必填!' })
    }
    const role = await roleModel.findOne({name})
    if(role) {
      throw new Exception({ message: '角色已存在!' })
    }
    try {
      await roleModel.create({ name, auth, level })
      ctx.body = new Success({})
      ctx.status = 201
    }catch (e) {
      throw new Exception({ message: '创建失败!'+ e })
    }
  }

  async update(ctx) {
    const id = ctx.params.id
    const { body } = ctx.request
    if(Object.keys(body) === 0) {
      throw new Exception({ message: '缺失更新参数!' })
    }
    const role = await roleModel.findById(id)
    const { name, auth,level } = Object.assign(role, body)
    try {
      await roleModel.findByIdAndUpdate(id, { name, auth, level })
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '更新失败!'+ e })
    }
  }

  async remove(ctx) {
    const id = ctx.params.id
    try {
      await roleModel.findByIdAndRemove(id)
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '删除失败!'+ e })
    }
  }
}

module.exports = Role
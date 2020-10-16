const staffModel = require('../models/staff')

class Staff {

  async list(ctx) { 
    const count = await staffModel.countDocuments()
    if(count) {
      const staffs = await staffModel.find()
      ctx.body = { count, staffs }
    } else {
      ctx.body = { count }
    }
    
  }

  async detail (ctx) {
    const id = ctx.params.id
    const staff = await staffModel.findById(id)
    if(!staff) ctx.throw(404, '用户不存在')

    ctx.body = { staff }
  }

  async create (ctx) {
    
    const { name, jobNo, hiredate } = ctx.request.body
    const staff = await staffModel.findOne({ jobNo })
    if(staff) {ctx.throw(403, '用户已经存在!')}

    try {
      await staffModel.create({ name, jobNo, hiredate })
      ctx.body = { success: true }
    }catch (e) {
      ctx.throw(400, '创建失败!'+ e)
    }
  }

  async update(ctx) {
    const id = ctx.params.id
    const { name, jobNo, hiredate  } = ctx.request.body
    try {
      await staffModel.findByIdAndUpdate(id, {  name, jobNo, hiredate  })

      ctx.body = { success: true }
    }catch (e) {
      ctx.throw(400, '更新失败!'+ e)
    }
  }

  async remove(ctx) {
    const id = ctx.params.id
    try {
      await staffModel.findByIdAndRemove(id)
      ctx.body = { success: true }
    }catch (e) {
      ctx.throw(400, '删除失败!' + e)
    }
  }

}

module.exports = Staff
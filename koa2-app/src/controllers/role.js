const roleModel = require('../models/role')
const authModel = require('../models/authCode')
const { Success, Exception } = require('../util/res_model')
const aux = require('../server/aux')
class Role {

  async list(ctx) { 
    const { query } = ctx.request
    if(Object.keys(query).length === 0) {
      const res = await aux.generalQuery(
        roleModel, 'roles',
        {
          supplementModel: authModel , 
          supplementName: 'auth', 
          maskfield: { _id: 0, updatedAt: 0, createdAt:0}
        }
      )
      ctx.body = new Success({ data: res })
    } else {
      const res = await aux.conditionalQuery(
        roleModel, query, 'roles',
        {
          supplementModel: authModel , 
          supplementName: 'auth', 
          maskfield: { _id: 0, updatedAt: 0, createdAt:0},
          element: 'auth'
        }
      )
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

    await aux.create(roleModel, { name, auth, level })
    ctx.body = new Success({})
    ctx.status = 201

  }

  async update(ctx) {
    const id = ctx.params.id
    const { body } = ctx.request
    if(Object.keys(body) === 0) {
      throw new Exception({ message: '缺失更新参数!' })
    }

    await aux.update(roleModel, id, body)
    ctx.body = new Success({})
  }

  async remove(ctx) {
    const id = ctx.params.id
    await aux.remove(roleModel, id)
    ctx.body = new Success({})
  }
}

module.exports = Role
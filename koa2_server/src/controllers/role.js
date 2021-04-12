const roleModel = require('../models/role')
const { Success, Exception } = require('../util/res_model')
const aux = require('./util')
class Role {

  async list(ctx) { 
    const { query } = ctx.request
    let res = { total: 0 } 
    if(Object.keys(query).length === 0) {
      try {
        res.total = await roleModel.countDocuments()
        if(res.total) {
          let roles = await roleModel.find()
            // .limit(10)
            .sort({ createdAt: 'desc' })
            
          for(let key of roles) {
            if(key.auth && key.auth.length > 0){
              key.auth= await aux.getAuthCode(key.auth)
            }
          }
          res.roles = roles
        }
        ctx.body = new Success({ data: res })
      }catch (e) {
        throw new Exception({ message: '查询失败'+ e.message })
      }
    } else {
      /**
       * 模糊查询
       * 存在 pageSize 或 pageNo 就认为是 分页查询
       */
      const and = [], elemMatch = {}
      const { pageSize=10, pageNo=1, ...p } = query
      const q = Object.keys(p)
      for(let k of q) {
        if(k !== 'auth[]') {
          if(!isNaN(Number(p[k]))){
            and.push({ [k]: query[k] })
          }else {
            and.push({ [k]: new RegExp(query[k]) })
          }
        }else {
          if(Array.isArray(query[k])) {
            for(let i of query[k]) {
              and.push({
                auth: { $elemMatch: {
                  $eq: i
                }}
              })
            }
          } else {
            elemMatch['$elemMatch'] = {$eq: query[k]}
          }
        }
      }
      const fuzzy = {}
      if(and.length) fuzzy['$and'] = and

      console.log('--fuzzy---->',fuzzy)
      try {
        res.total = await roleModel.countDocuments(fuzzy)
        if(res.total) {
          const roles = await roleModel.find(fuzzy)
            .skip((pageNo - 1) * (parseInt(pageSize)|| 10))
            .limit(parseInt(pageSize)|| 10)
            .sort({ createdAt: 'desc' })

          for(let key of roles) {
            if(key.auth && key.auth.length > 0){
              key.auth= await aux.getAuthCode(key.auth)
            }
          }
          res.roles = roles
        }
        ctx.body = new Success({ data: res })
      }catch (e) {
        throw new Exception({ message: '查询失败'+ e.message })
      }
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
      throw new Exception({ message: '创建失败!'+ e.message })
    }
  }

  async update(ctx) {
    const id = ctx.params.id
    const { body } = ctx.request
    if(Object.keys(body) === 0) {
      throw new Exception({ message: '缺失更新参数!' })
    }
    // const role = await roleModel.findById(id)
    // const { name, auth,level } = Object.assign(role, body)
    try {
      // await roleModel.findByIdAndUpdate(id, { name, auth, level })
      await roleModel.findByIdAndUpdate(id, body)
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '更新失败!'+ e.message })
    }
  }

  async remove(ctx) {
    const id = ctx.params.id
    try {
      await roleModel.findByIdAndRemove(id)
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '删除失败!'+ e.message })
    }
  }
}

module.exports = Role
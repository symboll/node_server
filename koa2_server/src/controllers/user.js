const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const roleModel = require('../models/role')
const ResModel = require('../util/res_model')
const getToken  = require('../util/token')


class User {
  constructor () {}

  async list(ctx) {
    const { query } = ctx.request
    let res = {} 
    if(Object.keys(query).length === 0) {
      res.count = 0
      res.count = await userModel.countDocuments()
      if(res.count) {
        let users = await userModel.find().limit(100)      // 没有查询条件，最多查询100条
        for(let k of users) {
          if( k.role && k.role.length !== 0) {
            k.role = await roleModel.find({ _id: { $in: k.role } })
          } 
        }
        res.users = users
      }
      ctx.body = new ResModel({ data: res })
    } else {
      res.users = []
      const result = await userModel.findOne(query)
      if(result && result.role && result.role.length !== 0){
        result.role = await roleModel.find({ _id: { $in: result.role } })
      }
      res.users.push(result)
      ctx.body = new ResModel({ data: res })
    }
  }
  async register (ctx) {
    const { username, password, email } = ctx.request.body
    try {
      const hasRegister = await userModel.findOne({ email })
      if(! (hasRegister && hasRegister._id)) {
        const res  = await userModel.create({username, password, email})
        ctx.body = new ResModel({ data: res })
      } else {
        throw new Error(`邮箱:${email},已经注册`)
      }
    }catch (e) {
      throw new Error(e.message || '出现错误')
    }
  }
  async login (ctx) {
    const { username, password } = ctx.request.body
    try {
      const hasRegister = await userModel.findOne({ username })
      if(hasRegister && hasRegister._id) {

        const res = bcrypt.compareSync(password,hasRegister.password)
        if(!res){
          ctx.body = new ResModel({ code: -1, message: "密码错误" })
          return
        }
        const token = getToken(hasRegister.username, hasRegister.role)
        ctx.body = new ResModel({ data: token })
      }else {
        throw new Error(`用户名${username},尚未注册`)
      }
    }catch (e) {
      throw new Error(e.message || '出现错误')
    }
  }

  async assignment (ctx) {
    const { id, role } = ctx.request.body
    // role []
    // 自己不能给自己赋权限
    try {
      const user = await userModel.findById(id)
      if(user && user._id) {
        await userModel.findByIdAndUpdate(id, { role })
        ctx.body = new ResModel({ })
      }else {
        ctx.throw(400, '出现错误!')
      }
    }catch (e) {
      ctx.throw(400, '无权限操作!')
    }
  }
}

module.exports = User
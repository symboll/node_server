const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const roleModel = require('../models/role')
const { Success, Exception } = require('../util/res_model')
const getToken  = require('../util/token')


class User {
  constructor () {}

  async list(ctx) {
    const { query } = ctx.request
    let res = { total: 0 } 
    try {
      if(Object.keys(query).length === 0) {
        res.total = await userModel.countDocuments()
        if(res.total) {
          let users = await userModel.find()
            .select('-password')                 // 剔除密码
            .limit(10)                           // 没有查询条件，最多查询10条
            .sort({ createdAt: 'desc' })      
          // for(let k of users) {
          //   if( k.role && k.role.length !== 0) {
          //     k.role = await roleModel.find({ _id: { $in: k.role } })
          //   } 
          // }
          res.users = users
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
        res.total = await userModel.countDocuments(fuzzy)
        if(res.total) {
          const result = await userModel.find(fuzzy)
            .select('-password')
            .skip((pageNo - 1) * (parseInt(pageSize)|| 10))
            .limit(parseInt(pageSize)|| 10)
            .sort({ createdAt: 'desc' })
          res.users = result
        }
        ctx.body = new Success({ data: res })
      }
    }catch (e) {
      throw new Exception({ message: '查询失败!'+ e.reason ? e.reason: e.message })
    }
  }
  async register (ctx) {
    const { username, password, email } = ctx.request.body
    try {
      const hasRegister = await userModel.findOne({ email })
      if(! (hasRegister && hasRegister._id)) {
        await userModel.create({username, password, email})
        ctx.body = new Success({})
        ctx.status = 201
      } else {
        throw new Exception({ message: `邮箱:${email},已经注册` })
      }
    }catch (e) {
      throw new Exception({ message: e.message || '出现错误' })

    }
  }
  async login (ctx) {
    const { username, password } = ctx.request.body
    try {
      const hasRegister = await userModel.findOne({ username })
      if(hasRegister && hasRegister._id) {

        const res = bcrypt.compareSync(password,hasRegister.password)
        if(!res){
          throw new Exception({ message: '密码错误!' })
        }
        const token = getToken(hasRegister.username, hasRegister.role)
        ctx.body = new Success({ data: token })
      }else {
        throw new Exception({ message: `用户名${username},尚未注册!` })
      }
    }catch (e) {
      throw new Exception({ message: e.message || '出现错误' })
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
        ctx.body = new Success({ })
      }else {
        throw new Exception({ message: '出现错误!' })
      }
    }catch (e) {
      throw new Exception({ message: '无权限操作!' })
    }
  }

  async authorization (ctx) {
    // console.log('ctx.auth--->',ctx.auth)
    ctx.body = new Success({ data: ctx.auth })
  }
}

module.exports = User
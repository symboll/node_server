const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const roleModel = require('../models/role')
const { Success, Exception } = require('../util/res_model')
const getToken  = require('../util/token')
const { options } = require('../config')

class User {
  constructor () {}

  async list(ctx) {
    const { query } = ctx.request
    let res = { total: 0 } 
    if(Object.keys(query).length === 0) {
      try {
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
      }catch (e) {
        throw new Exception({ message: '查询失败' + e.message })
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
        if(k !== 'role[]') {
          if(!isNaN(Number(p[k]))){
            and.push({ [k]: query[k] })
          }else {
            and.push({ [k]: new RegExp(query[k]) })
          }
        }else {
          if(Array.isArray(query[k])) {
            for(let i of query[k]) {
              and.push({
                role: { $elemMatch: {
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

      console.log('fuzzy--->', JSON.stringify(fuzzy))
      try {
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
      } catch (e) {
        throw new Exception({ message: '查询失败' + e.message })
      }
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
        const token = getToken(hasRegister.username, hasRegister._id)
        ctx.cookies.set('token', token, options)
        ctx.body = new Success({})
      }else {
        throw new Exception({ message: `用户名${username},尚未注册!` })
      }
    }catch (e) {
      throw new Exception({ message: e.message || '出现错误' })
    }
  }

  async logout (ctx) {
    ctx.cookies.set('token', '', options)
    ctx.body = new Success({})
  }

  async assignment (ctx) {
    // role []
    // 自己不能给自己赋权限
    const { role } = ctx.request.body
    const id = ctx.params.id
    const { _id } = ctx.auth || {}
    if(id === _id){
      throw new Exception({ message: "不能给自己赋权限!"})
    } 
    try {
      await userModel.findByIdAndUpdate(id, { role })
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '无权限操作!' + e.message })
    }
  }
  async update (ctx) {
    const { body } = ctx.request
    const id = ctx.params.id
    if(Object.keys(body) === 0) {
      throw new Exception({ message: '缺失更新参数!' })
    } 
    if(body.role) {
      throw new Exception({ message: '不能给自己赋权限!' })
    }
    // const user = await userModel.findById(id)
    // const { username, avatar, password, email } = Object.assign(user, body)
    try {
      // await userModel.findByIdAndUpdate(id, {username, avatar, password, email})
      await userModel.findByIdAndUpdate(id, body)
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '无权限操作!' + e.message })
    }
  }
  async authorization (ctx) {
    const { name, _id }  = ctx.auth || {}
    if(!name || !_id){
      throw new Exception({ message: '请先登录' })
    }else {
      const token = getToken(name, _id)
      ctx.cookies.set('token', token, options)
      ctx.body = new Success({ data: { name } })
    }
  }
}

module.exports = User
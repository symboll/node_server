const bcrypt = require('bcryptjs')
const userModel = require('../models/user')
const roleModel = require('../models/role')
const { Success, Exception } = require('../util/res_model')
const getToken  = require('../util/token')
const { options } = require('../config')
const aux = require('../server/aux')
class User {
  constructor () {}

  async list(ctx) {
    const { query } = ctx.request
    if(Object.keys(query).length === 0) {
      const res = await aux.generalQuery(
        userModel, 'users',
        {
          supplementModel: roleModel , 
          supplementName: 'role', 
          maskfield: {_id: 0, auth: 0, level: 0, updatedAt: 0, createdAt:0 }
        },
        {
          limit: 10,
          select:'-password' 
        }
      )
      ctx.body = new Success({ data: res })

    } else {
      const res = await aux.conditionalQuery(
        userModel, query, 'users',
        {
          supplementModel: roleModel , 
          supplementName: 'role', 
          maskfield: {_id: 0, auth: 0, level: 0, updatedAt: 0, createdAt:0 },
          element: 'role'
        },
        {
          select: "-password"
        }
      )
      ctx.body = new Success({ data: res })
    }
  }
  
  async detail (ctx) {
    const { id } = ctx.params
    try {
      const res = await userModel.findById(id)
      ctx.body = new Success({ data: res })
    }catch(e) {
      throw new Exception({ message: e.message ? e.message : e })
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
        const { username, avatar='', _id } = hasRegister
        const token = getToken(username, avatar,  _id)
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
 
    await aux.update(userModel, id, { role})
    ctx.body = new Success({})
  }

  async update (ctx) {
    const { body } = ctx.request
    const id = ctx.auth._id || ''
    if(Object.keys(body) === 0) {
      throw new Exception({ message: '缺失更新参数!' })
    } 
    if(body.role) {
      throw new Exception({ message: '不能给自己赋权限!' })
    }

    await aux.update(userModel, id, body)
    ctx.body = new Success({})
  }

  async authorization (ctx) {
    const { _id: id }  = ctx.auth || {}
    if(!id){
      throw new Exception({ message: '请先登录' })
    }else {
      try {
        const user = await userModel.findById(id)
        const { username, avatar=''} = user
        const token = getToken(username, avatar, id)
        ctx.cookies.set('token', token, options)
        ctx.body = new Success({ data: { name:username, avatar, id } })
      }catch (e) {
        throw new Exception({ message: '验证失败!' + e.message })
      }
    }
  }
}

module.exports = User
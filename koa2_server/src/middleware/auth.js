const BearerToken = require('bearer-token')
const jwt = require('jsonwebtoken')
const { security: { key }} = require('../config')
const roleModel = require('../models/role')
const authCodeModel = require('../models/authCode')
class Auth {
  constructor () {
    
  }
  // 验证是否已经登录
  check () {
    return async (ctx, next) => {
      BearerToken(ctx.req, function(err, token) {
        if(err) {
          ctx.throw(403, '禁止访问'+ err)
        }
        try {
          let decode = jwt.verify(token, key )
          ctx.auth = {
            name: decode.name,
            role: decode.role
          }
          console.log('auth--->', ctx.auth)
        }catch (err) {
          if(err.name == 'TokenExpiredError') {
            ctx.throw(403, 'token已经过期!')
          }
          ctx.throw(403, 'token不合法!')
        }
      })  
      await next()
    }
  }

  checkAuth (code) {
    return async(ctx, next) => {
      const { name, role } = ctx.auth
      if(role && role.length > 0) {
        const RoleRes = await roleModel.find({ _id: { $in: role } })
        let authArr = []
        RoleRes.forEach(item => authArr.push(...item.auth))
        const codeRes = await authCodeModel.find({ _id: { $in: authArr } })
        let res = codeRes.map(item => item.code)
        console.log(res)
        if(res.includes(code) || res.includes('superadmin')) {
          await next()
        } else {
          ctx.throw(403, '没有权限访问!')
        }
      }else {
        ctx.throw(403, '没有权限访问!')
      }
    }
  }
}

module.exports = Auth;
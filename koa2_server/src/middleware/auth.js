const jwt = require('jsonwebtoken')
const { security: { key }} = require('../config')
const roleModel = require('../models/role')
const authCodeModel = require('../models/authCode')
const { Exception } = require('../util/res_model')
class Auth {
  constructor () {
    
  }
  // 验证是否已经登录
  check () {
    return async (ctx, next) => {
      const authorization = ctx.headers['authorization'] || ''
      const token = authorization.split(' ')[1]
      if(token)  {
        try {
          let decode = jwt.verify(token, key )
          ctx.auth = {
            name: decode.name,
            role: decode.role
          }
          await next()
        }catch (error) {
          if(error.name == 'TokenExpiredError') {
            throw new Exception({ status: 403, message: 'token已经过期!' })
          }
          if(error.name == 'JsonWebTokenError') {
            throw new Exception({status: 403, message: '无效签名!' })
          }
          throw new Exception({ status:403, message: 'token不合法!' })
        }
      }else {
        throw new Exception({ status:401, message: '尚未登录!' })
      }
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
        
        // 用户有页面访问码， 或者用户是管理员
        if(res.includes(code) || res.includes('superadmin')) {
          await next()
        } else {
          throw new Exception({ status:403, message: '没有权限访问!' })
        }
      }else {
        throw new Exception({ status:403, message: '没有权限访问!' })
      }
    }
  }
}

module.exports = Auth;
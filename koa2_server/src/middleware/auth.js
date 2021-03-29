const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken')
const { security: { key }} = require('../config')

class Auth {
  constructor () {
    
  }
  check () {
    return async (ctx, next) => {
      const token = basicAuth(ctx.req)
      let decode;
      if(token && token.name) {
        try{
          decode = jwt.verify(token.name, key )
          ctx.auth = {
            name: decode.name,
            role: decode.role
          }
        }catch (err) {
          if(err.name == 'TokenExpiredError') {
            ctx.throw(403, 'token已经过期!')
          }
          ctx.throw(403, 'token不合法!')
        }
      } else {
        throw new Exception('禁止访问',403)
      }
  
      await next()
    }
  }
}

module.exports = Auth;
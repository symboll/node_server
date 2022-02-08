const { Exception } = require('../util/res_model')

const catchError = async(ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof Exception) {
      ctx.body = {
        message: error.message,
        code: error.code,
      }
      ctx.status = error.status
    }else {
      ctx.body = {
        message: error.message,
        code: -1,
      }
      ctx.status = 500
    }
  }
}
module.exports = catchError
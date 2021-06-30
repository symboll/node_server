module.exports = {
  success: function({ res, msg='请求成功' }) {
    this.ctx.body = {
      data: res,
      code: 200,
      msg
    },
    this.ctx.status = 200
  }
}
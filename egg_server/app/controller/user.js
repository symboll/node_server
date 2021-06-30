'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  constructor(props) {
    super(props)
    this.UserCreateRule = {
      userName: {
        type: "string",
        required: true,
        allowEmpty: false,
        format: /^[A-Za-z_@.]{3,10}/
      },
      password: {
        type: "password",
        required: true,
        allowEmpty: false,
        min: 6
      }
    }
  }
  async index () {
    const { ctx, service } = this
    ctx.validate(this.UserCreateRule)
    const res = await service.user.index()
    ctx.helper.success({ res })
  }
  async detail () {
    const { ctx, service } = this
    const res = await service.user.detail(ctx.params.id)
    ctx.helper.success({ res })
  }
  async create () {
    const { ctx, service } = this
    await service.user.create(ctx.request.body)
    ctx.helper.success({ msg: "创建成功" })
  }
  async update () {
    const { ctx, service } = this
    await service.user.update(ctx.params.id, ctx.request.body)
    ctx.helper.success({ msg: "更新成功" })
  }
  async remove () {
    const { ctx, service } = this
    await service.user.remove(ctx.params.id)
    ctx.helper.success({ msg: "删除成功" })
  }
}

module.exports = UserController;
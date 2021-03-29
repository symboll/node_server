//  code: 0   成功
//  code: -1   密码错误

class ResModel {
  constructor({message = '成功', status = 200, code = 0, data ={}}) {
    this.status = status
    this.message = message
    this.code = code
    this.data = data
  } 
}

module.exports = ResModel
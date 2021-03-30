//  code: 0   成功
//  code: -1   密码错误

class Success {
  constructor({message = '成功', code = 0, data ={}}) {
    this.message = message
    this.code = code
    this.data = data
  } 
}

class Exception extends Error {
  constructor ({ message = '异常', code = -1 , status= 400 }) {
    super()
    this.message = message
    this.code = code
    this.status = status          // 状态码
  }
}

module.exports = {
  Success,
  Exception
}
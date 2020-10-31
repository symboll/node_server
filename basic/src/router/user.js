const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')


const handleUserRouter = (req, res) => {
  const method = req.method

  
// if(method === 'POST' && req.path === '/api/user/login') {
  // const { username, password } = req.body
if(method === 'GET' && req.path === '/api/user/login') {
    const { username, password } = req.query
    return login(username, password).then(res => {
      console.log('res',res)
      if(res) {
        req.session.usernanme = res.username
        req.session.realname = res.realname

        return new SuccessModel()
      }
      return new ErrorModel('用户名或密码错误')
    })
  }

}

module.exports = handleUserRouter
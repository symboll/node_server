const Router = require('koa-router')
const User = require('../controllers/user')
const Auth = require('../middleware/auth')

const router = new Router({ prefix: '/user' })
const user = new User()
const auth = new Auth()

// 用户列表
router.get('/', user.list)

// 注册
router.post('/register', user.register)

// 登录
router.post('/login', user.login)

// 赋予权限 
router.post('/assignment', auth.check(), user.assignment)

// 获取用户信息
router.get('/authorization', auth.check(), user.authorization)

module.exports = router



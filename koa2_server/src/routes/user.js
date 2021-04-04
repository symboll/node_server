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

// 退出登录
router.post('/logout', user.logout)

// 赋予权限 [ 更新用户权限信息, 只能更新别人的。且 需要高级权限 ]
router.post('/assignment', auth.check(), auth.checkAuth('setting') ,user.assignment)

// 更新个人信息 [ 更新基本信息  只能更新自己的信息。 需要登录 ]
router.post('/update', auth.check(), user.update)

// 获取用户信息 [产生新的 token ]
router.get('/authorization', auth.check(), user.authorization)

module.exports = router



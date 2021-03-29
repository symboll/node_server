const Router = require('koa-router')
const Role = require('../controllers/role')

const router = new Router({ prefix: '/role' })
const role = new Role()

// const Auth = require('../middleware/auth')
// const auth = new Auth()     // 检查是否登录

router.get('/', role.list)
router.post('/', role.create)
router.put('/:id', role.update) 
router.delete('/:id', role.remove)

module.exports = router
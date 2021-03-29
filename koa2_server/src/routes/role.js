const Router = require('koa-router')
const Role = require('../controllers/role')
const Auth = require('../middleware/auth')

const router = new Router({ prefix: '/role' })
const role = new Role()
const auth = new Auth()

router.get('/', auth.check(),  role.list)
router.post('/', role.create)
router.put('/:id', role.update) 
router.delete('/:id', role.remove)

module.exports = router
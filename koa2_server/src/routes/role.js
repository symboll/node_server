const Router = require('koa-router')
const Role = require('../controllers/role')

const router = new Router({ prefix: '/role' })
const role = new Role()

router.get('/', role.list)
router.post('/', role.create)
router.put('/:id', role.update) 
router.delete('/:id', role.remove)

module.exports = router
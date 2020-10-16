const Router = require('koa-router')
const Staff = require('../controllers/staff')

const router = new Router({ prefix: '/staff' })
const staff = new Staff()


router.get('/', staff.list)
router.get('/:id', staff.detail)
router.post('/', staff.create)
router.put('/:id', staff.update) 
router.delete('/:id', staff.remove)

module.exports = router
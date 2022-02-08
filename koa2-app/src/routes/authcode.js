const Router = require('koa-router')
const AuthCode = require('../controllers/authCode')

const router = new Router({ prefix: '/authcode' })
const authcode = new AuthCode()


router.get('/', authcode.list)
router.post('/', authcode.create)
router.put('/:id', authcode.update) 
router.delete('/:id', authcode.remove)

module.exports = router
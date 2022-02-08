const Router = require('koa-router');
const router = new Router();

const Home = require('../controllers/home')
const home = new Home()

router.post('/upload', home.upload);

module.exports = router;
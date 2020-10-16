const path = require('path')
const koa = require('koa2')
const koaBody = require('koa-body')
const koaParameter = require('koa-parameter')
const error = require('koa-json-error')
const koaStatic = require('koa-static')
const routing = require('./src/routes')
require('./src/db')


const app = new koa()
const port = 3000

// 静态文件
app.use(koaStatic(path.join(__dirname,'public')))

// 错误处理
app.use(error({
  postFormat: (e, {stack,...rest}) => rest
}))

// 上传文件
app.use(koaBody({
  multipart: true,   // 代表启用文件
  formidable: {
    uploadDir: path.join(__dirname,'/public/uploads'),   // 上传目录
    keepExtensions: true,   // 保留 扩展名
  }
}))

// 解析body参数
app.use(koaParameter(app))

// 增加路由
routing(app)

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

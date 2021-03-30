const path = require('path')
const koa = require('koa2')
const koaBody = require('koa-body')
const koaParameter = require('koa-parameter')
const error = require('koa-json-error')
const koaStatic = require('koa-static')
const cors = require('koa2-cors')
const routing = require('./src/routes')
const catchError = require('./src/middleware/catchError')
require('./src/db')


const app = new koa()
const port = 3000

// 跨域
const allowedorgin = ['http://localhost:3000', 'http://localhost:8080']
app.use(cors({
  origin: function(ctx) { //设置允许来自指定域名请求
    if(allowedorgin.includes(ctx.request.headers.origin)) {
      return ctx.request.headers.origin
    }else {
      return false
    }
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}))

// 错误处理
app.use(error({
  postFormat: (e, {stack,...rest}) => rest
}))
app.use(catchError)

// 静态文件
app.use(koaStatic(path.join(__dirname,'public')))


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

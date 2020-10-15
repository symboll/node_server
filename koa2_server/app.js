const koa = require('koa2')
const app = new koa()
const port = 3000

app.use( async (ctx, next) => {
  next()
  ctx.body = 'hello world!!'
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

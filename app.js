const Koa = require('koa')
const path = require('path')
const router = require("koa-router")()
const views = require('koa-views')
const post1 = require('./controller/post01.js')
const post2 = require('./controller/post02.js')
/**
 * 自定义中间件
 */
const middleware = require('./middleware')

const app = new Koa()

// middleware(app)

app.use(views(path.resolve(__dirname, "views"), {
  map: {
    html: 'nunjucks'
  }
}))

router.get('/post1', post1.post)
router.get('/post2', post2.post)

app
  .use(router.routes())
  .use(router.allowedMethods())





console.log("app===================",app)
app.listen(8080)
console.log('app started at port 3000...');
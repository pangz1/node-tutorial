const Koa = require('koa')

/**
 * 自定义中间件
 */
const middleware = require('./middleware')

const app = new Koa()

middleware(app)



console.log("app===================",app)
app.listen(3000)
console.log('app started at port 3000...');
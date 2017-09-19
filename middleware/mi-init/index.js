let uuid = require("node-uuid")
const isProduction = process.env.NODE_ENV === 'production'
module.exports = () => {
  console.log("context===================", this)
  return function (context, next) {
    var id = uuid.v4().replace(/-/g, "")
    context.state.scope = {
      __requestId: id,
      __staticFileServer: isProduction?"https://www.staticfiles.com/":""
    }
    context.state.requestId = id
    return next()
  }
}
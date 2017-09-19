
function requestPostData (id) {
  // 模拟数据请求
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      let data = {
        name: '黄vv',
        department: '人力资源部',
        age: 18,
        salary: 500,
        address: ['上海浦东', '中国湖南', '中国福建']
      }
      resolve(data)
    }, 300);
  })
}

exports.post = async function (ctx, next) {
  let id = ctx.params.id
  let data = await requestPostData(id)

  ctx.type = 'html'
  ctx.body = ctx.render('personnel/personnel.html', data)
}

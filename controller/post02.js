
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
  console.log(ctx)
  let data = await requestPostData(1)

  ctx.type = 'html'
  await ctx.render('personnel/personnel.html', data)
}

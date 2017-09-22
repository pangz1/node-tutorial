function requestPostData (id) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      let data = {
        title: 'Post title',
        author: 'Xiaoming',
        publishDate: '2017-09-19',
        content: `
          <div class="content">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste distinctio sunt perspiciatis facere, enim quidem pariatur exercitationem minus rerum debitis similique qui iusto consectetur laborum minima cumque fugit. Fuga, sed.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta delectus deserunt hic expedita perspiciatis vero eos cum? Porro unde quos ab eveniet enim consequatur tempora inventore quam ipsa! Veritatis, aliquam?</p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae omnis maiores voluptatem consequuntur at distinctio odio quidem, aliquam assumenda. Sint.</p>
          </div>`
      }
      resolve(data)
    }, 300);
  })
}

function render (data) {
  // 这里省去<!doctype>和头部以及body标签,只包括文章的主体内容
  return `
    <div class="main">
      <header class="header">
        <h1 class="title">${data.title}</h1>
        <div class="post-info">
          <span class="post-author">${data.author}</span>
          <span class="post-pub-date">${data.publishDate}</span>
        </div>
      </header>
      <div>
        ${data.content}
      </div>
    </div>
  `
}


exports.post = async function (ctx, next) {
  let data = await requestPostData(1)

  console.log(data)

  ctx.type = 'html'
  ctx.body = render(data)
}


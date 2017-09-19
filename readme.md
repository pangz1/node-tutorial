#### fork一份到自己的账号上，然后修改对应的分支，文案内容都写在 `readme.md` 中

#### 参考 [egg.org](http://eggjs.org/zh-cn/tutorials/index.html) 或其它教程

注意事项: 
 
* 标题 h1~h3 ：h1为正文大标题，h2为分类的知识点，h3为知识点里面的节点 
* 段落之间的间隔，可以用 `<br>` 标签来隔开，标签上下各有一回车留白
* 配的图片，尽量居中显示 
* 展示的代码，尽量增加详细的注释
* 文章就是教案，要达到看着文章不用稿就能录屏 
* 措辞不要过激 
* 可以借鉴，不能抄袭 

需要用到页面展示的地方，可借鉴下当前目录下的 `html` 文件，略体现沪江元素更好些 

### 请求响应后，经过controller处理，返回到视图中，配合实例讲述

# nunjucks

## 使用es6模板字符串构造视图

前面已经介绍了 router 和 controller，了解了如何处理请求以及获取数据，这一节我们来学习如何借助模板引擎来展示数据。

首先来看一个获取文章的controller


    exports.post = async function (ctx, next) {
      let id = ctx.params.id
      let data = await requestPostData(id)

      ctx.type = 'html'
      ctx.body = ？？？
    }

上面的controller我们从路由参数上取到文章的id，然后通过这个id获取到了这篇文章的数据，我们不能直接返回这个数据，因为用户要看到的是一个页面，不是一堆数据。
所以这里我们先指定返回的类型是html，然后我们需要用获取到的文章数据构造一个html的模板，我们首先尝试着利用es6的模板字符串来完成这个工作

假设data是下面的结构

``` javascript
  {
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
```

我们用一个 render 函数来把 data 拼接成一个html页面并且返回这个html字符串

``` javascript
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
```

现在我们有了一个html字符串，把他赋值给controller 的ctx.body，我们就得到了一个渲染好的页面

``` javascript
  exports.post = async function (ctx, next) {
    let id = ctx.params.id
    let data = await requestPostData(id)

    ctx.type = 'html'
    ctx.body = render(data)
  }
```

上面的例子很简单，真正在项目开发的工程过，需求会比这个复杂的多，要涉及到列表的循环，条件判断，模板复用，简单的字符串拼接无法满足需求，而且我们这里把 views 与 controller 耦合在了一起，views完全没有办法复用。
幸运的是，这些问题模板引擎都可以为我们解决。

## nunjucks

模板引擎是一个待渲染的html的字符串，可以传入特定的变量去替换字符串种的某些待填充的符号, 以nunjucks为例。

这种模板引擎具有很好的伸缩性，具有渲染字符串，模板继承，过滤器，等一系列丰富的功能，足以满足所有可能的场景。

下面是一个简单的例子

demo.html
```html
<header>{{ data.department }}</header>
<content>
  <div>name: {{data.name}}</div>
  <div>age: {{data.age}}</div>
  {% if data.salary > 500 %}
    <div>大于500</div>
  {% else %}
    <div>小于等于500</div>
  {% endif %}
  <span>居住地址</span>
  <ul>
    {% for address in data.address %}
      <li>${address}</li>
    {% endfor %}
  </ul>
</content>
```

app1.js
```javascript
// 这边的data同上
await ctx.render('demo.html', {data,})
```

![](./c05/demo.jpg)


### 模板的继承

其实普通的模板字符串跟上面的模板引擎的区别是不大的，所以模板引擎肯定要有更吸引人的功能才会有大量人使用，其中比较的重要的功能(大部分模板引擎都有)就是模板的继承，它可以给模板更好的复用性，并且它能把模板字符串从controller中抽出，使代码有更好的可读性。其基于extends、block、include的语法可以提高现有模板的可用性和拓展性。下面一个demo介绍下

base.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
  body {
    margin: 0 auto;
    height: 100%;
    width: 500px;
  }
</style>
<body>
  {% block header %}
  {% endblock %}

  {% block content %}
  {% endblock %}
  
  {% block footer %}
  {% endblock %}
</body>
</html>
```
这片段的代码中存在着block块，这些块里面都是待填充的内容，除了块里的东西，都可以事先布局好。再看看继承这个片段部分可以怎么做。

extend.html
```html
{% extends "views/base.html" %}

{% block header %}
{% include "views/header.html" %}
{%endblock%}

{% block content %}
<header>{{ data.department }}</header>
<div>
  <div>name: {{data.name}}</div>
  <div>age: {{data.age}}</div>
  {% if data.salary > 500 %}
    <div>大于500</div>
  {% else %}
    <div>小于等于500</div>
  {% endif %}
  <span>居住地址</span>
  <ul>
    {% for address in data.address %}
      <li>{{address}}</li>
    {% endfor %}
  </ul>
</div>
{% endblock %}


{% block footer%}
{% include "views/footer.html" %}
{% endblock%}
```

header.html
```html
<h1>
  Big title 
</h1>
```
footer.html
```html
<footer style="font-weight:400;font-size:16px;">
  small footer
</footer>
```

app3.js
```javascript
// 这边的data同上
await ctx.render('extend.html', {data,})
```
在这种模式下，集成了多个可以使用的html模块具有非常强的可复用性，而且它是支持将extends/include关键词中的部分用变量替换，这意味着，动态地变更模板不是问题也让具有此功能的模板引擎远远超过了模板字符串的应用。更适合做一些组件化的场景。

## 模板中动态的变换header
接上文，如果有个业务是根据不同的用户展示不同的header，这时候可以使用模板引擎动态的include(extends也是可以)来做到这点。

extend.html
```html
{% extends "views/base.html" %}

{% block header %}
{% include "views/" + data.header + ".html" %}
{%endblock%}

{% block content %}
<header>{{ data.department }}</header>
<div>
  <div>name: {{data.name}}</div>
  <div>age: {{data.age}}</div>
  {% if data.salary > 500 %}
    <div>大于500</div>
  {% else %}
    <div>小于等于500</div>
  {% endif %}
  <span>居住地址</span>
  <ul>
    {% for address in data.address %}
      <li>{{address}}</li>
    {% endfor %}
  </ul>
</div>
{% endblock %}


{% block footer%}
{% include "views/" + data.footer + ".html" %}
{% endblock%}
```

gheader.html
```html
<h1 style="color: green;">
  Big title 
</h1>

```

bfooter.html
```html
<footer style="font-weight:700;font-size:32px;">
  big footer
</footer>
```

app4.js
```javascript
app.use(async ctx => {
  const data = {
    header: 'gheader',
    footer: 'bfooter',
    name: '黄vv',
    department: '人力资源部',
    age: 18,
    salary: 500,
    address: ['上海浦东', '中国湖南', '中国福建']
  }
  await ctx.render('extend1.html', {data,})
});
```
然后在对应的app4中加入对应的header和footer的样式就可以动态的改变最终的渲染效果

## 总结
简单的介绍模板引擎带，并没有涉及较深的原理是为了让大家能更好的上手，带来便利，如果感兴趣的同学可以自己去查看源码，实现其他也不会很难。[NunJucks官网](https://mozilla.github.io/nunjucks/)



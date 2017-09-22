module.exports = [
  {
    match: "/",
    controller: "home.index"
  },
  {
    match: "/login",
    controller: "home.login",
    method: "post"
  },
  {
    match: "/post2",
    controller: 'post02.post'
  },
  {
    match: "/post1",
    controller: 'post01.post'
  }
]
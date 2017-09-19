module.exports = [
  {
    match: "/",
    controller: "home.index"
  },
  {
    match: "/login",
    controller: "home.login",
    method: "post"
  }
]
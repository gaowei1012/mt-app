const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const UserModel = require('./../../dbs/users')

// 用户登录校验
/**
 * usernamre: 用户名
 * password: 密码
 * don: 回调函数
 */
passport.use(new LocalStrategy(async function(username, password, done) {

  // 查询条件
  let where = {
    username
  }

  // 在数据库中查询 当前用户
  let result = await UserModel.findOne(where)

  if (result != null) {
    if (result.password === password) {
      return done(null, result)
    } else {
      return done(null, false, '密码错误')  
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

// 序列化， 每次用户登录会通过session验证
passport.serializeUser(function(user, done) {
  done(null, user)
})

// 反序列化
passport.deserializeUser(function(user, done) {
  return done(null, user)
})


module.exports = passport

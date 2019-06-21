const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const UserModel = require('./../../dbs/users')

// 用户登录校验
passport.use(new LocalStrategy(async function(username, passwors, done) {

  let where = {
    username
  }

  let result = await UserModel.findOne(where)

  if (result != null) {
    if (result.password === passport) {
      return done(null, result)
    } else {
      return done(null, false, '密码错误')  
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  return done(null, user)
})


module.exports = passport

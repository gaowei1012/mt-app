const Router = require('koa-router')
const Redis = require('koa-redis')
const nodeMailer = require('nodemailer')
const User = require('../dbs/users')
const Email = require('../dbs/config')
const Passport = require('./utils/passport')
const axios = require('./utils/axios')

let router = new Router({
  prefix: '/users'
})

// redis store
let Store = new Redis().client

router.post('/singup', async (ctx) => {
  let {
    username,
    password,
    code,
    email
  } = ctx.request.body

  if (code) {
    const saveCode = await Store().hget(`nodemail${username}`, 'code')
    const saveExpire = await Store().hget(`nodemail${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新获取'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  let user = await User.find({username})
  if (user.lenght) {
    ctx.body = {
      code: -1,
      msg: '当前用户已注册'
    }
    return
  }
  let newUser = await User.create({username, password, email})
  if (newUser) {
    let res = await axios.post('/users/signin', {
      username, password
    })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})


router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function(err, user, info, status) {
    if(err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功'
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code:0,
          msg: info
        }
      }
    } 
  })(ctx, next)
})

router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store().hget(`nodemail${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证过于频繁，请在一分钟后再试!'
    }
    return false
  }
  // 发送的设置
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  // 发送的对象
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.user
  }

  let mailOptions = {
    form: `"认证邮件" <${Email.smtp.user}> `,
    to: ko.email,
    subject: '美团用户注册验证码',
    html: `您的验证码是:${ko.code}`
  }

  // 开始发送验证邮件
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err)
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '邮件已发送，有限一分钟'
  }
})

router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body ={
      code:0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    const {username, email} = ctx.session.passport.user 
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})


module.exports = router

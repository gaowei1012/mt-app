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

router.post('/singup', async (ctx, next) => {
  let {
    username,
    password,
    code,
    email
  } = ctx.request.body

  // 验证码校验
  if (code) {
    // 取出redis数据中的存的info
    const saveCode = await Store.hget(`nodemail${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail${username}`, 'expire')
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
  // 查询当前用户是否注册
  let user = await User.find({username})
  if (user.lenght) {
    ctx.body = {
      code: -1,
      msg: '当前用户已注册'
    }
    return
  }
  // 写入数据库
  let newUser = await User.create({username, password, email})
  if (newUser) {
    // 登录
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

  await next()
})


router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function(err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登陆成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// 验证码校验
/**
 * 邮箱验证
 * 拿到当前用户 在redis中查询 是否有当前用户 进行比对
 * 发送您验证邮箱，使用 nodemailer 
 * 首先设置发送前设置 再者就是发送给谁
 */
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }

  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    suth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '《慕课网高仿美团网全栈实战》注册码',
    html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的邀请码是:${ko.code}`
  }
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log('获取邮箱验证失败'+error)
    else Store.hmset(`nodemail:${ko.user}`, `code:${ko.code}`, `emial:${ko.email}`)
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
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

import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import koaBodyParser from 'koa-bodyparser'
import json from 'koa-json'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import users from './interface/users'
import { initSchema, connect } from './dbs/init'
import passport from './interface/utils/passport'

const app = new Koa()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({key: 'mt', prefix: 'mt:uid', store: new Redis()}))
app.use(koaBodyParser({
  extendTypes:['json','form','text']
}))
app.use(json())

// 数据库连接
;(async () => {
  await connect(),
  initSchema()
})()

app.use(passport.initialize())
app.use(passport.session())

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3010
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(users.routes()).use(users.allowedMethods())

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

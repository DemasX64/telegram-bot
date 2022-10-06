const db = require('../database')
const { Composer } = require('telegraf')

const loginMiddleware = () => {
  return Composer.on('message',async (ctx,next)=>{
    if (await db.isLogin(ctx.update.message.from.id)) {
      await next()
    } else {
      if (ctx.message.text.startsWith(`/login`)) {
        await next()
      } else {
        ctx.reply('Введите /login {токен} для доступа к боту')
        return;
      }
    }
  })
}

module.exports = {loginMiddleware}
const db = require('../database')
const { Composer } = require('telegraf')

const adminMiddleware = () => {
  return Composer.on('message',async (ctx,next)=>{
    if (await db.isAdmin(ctx.update.message.from.id)) {
      await next()
    } else {
      if (ctx.message.text.startsWith(`Список токенов`)) {
        return
      }
      if (ctx.message.text.startsWith(`Отправить сообщение`)) {
        return
      }
      if (ctx.message.text.startsWith(`Добавить приложение`)) {
        return
      }
      if (ctx.message.text.startsWith(`Добавить токен`)) {
        return
      }
      await next()
    }
  })
}

module.exports = {adminMiddleware}
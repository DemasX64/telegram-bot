const { Composer } = require('telegraf')

const isMessageExistMiddleware = () => {
  return Composer.on('message',async (ctx,next)=>{
    if (ctx?.update?.message?.from?.id){
      await next()
    } else return;
  })
}

module.exports = {isMessageExistMiddleware}
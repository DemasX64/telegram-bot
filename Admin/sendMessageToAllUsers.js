const { Context } = require('telegraf');
const db =require('../database')
const index = require('../index');

function sendMessageToAllUsers(ctx,message) {
  return new Promise((resolve,reject)=>{
    db.getAllUsers().then(
      async (users) => {
        for (let i = 0; i < users.length; i++) {
          try {
            await index.bot.telegram.sendMessage(users[i].UserID,message);
          } catch (err) {  }
        }
        ctx.reply('Отправлено')
        resolve("Отправлено")
      },
      () => {
        ctx.reply('Не отправлено')
        reject('Не отправлено')
      }
    )
  })
}

module.exports = {sendMessageToAllUsers}
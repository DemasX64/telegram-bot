const db = require('./database')
const {adminKeyboard} = require('./Keyboards/adminKeyboard')
const {userKeyboard} = require('./Keyboards/userKeyboard')
const {shortUserKeyboard} = require('./Keyboards/shortUserKeyboard')
const {getStatus} = require('./Utils/getStatus')

async function menu(ctx, UserID){
  if (await db.isAdmin(UserID)) {
    ctx.reply("Доступ администратора",adminKeyboard)
  } else {
    db.getUserApp(UserID).then(
      (app) => {
        // const status = () => {
        //   switch(app.IsAlive){
        //     case 0:
        //       return '🅱️';
        //     case 1:
        //       if (app.IsWork === 1) {
        //         return '✅';
        //       } else {
        //         return '⛔️';
        //       }
        //       //return '🟢';
        //     default:
        //       return '⚫';
        //   }
        // }
        let message = '<b>Текущее приложение:</b>\n';
        message += '<b>Name: </b> ' + `${getStatus(app)}` + ' ' + app.Name + '\n'; 
        message += '<b>Package: </b> ' + `<a href="play.google.com/store/apps/details?id=${app.Bundle}">${app.Bundle}</a>` + '\n\n'; 
        message += '<b>FBappid: </b> ' + app.FacebookID + '\n'; 
        message += '<b>Naming: </b> ' + app.Naming + '\n'; 
        message += '<b>Deeplink: </b> ' + app.Deeplink + '\n'; 
        message += '<b>Onelink: </b> ' + app.Onelink + '\n'; 
        message += '<b>Geo: </b> ' + app.Geo + '\n'; 
        ctx.reply(message, { parse_mode: 'HTML',...userKeyboard})
      },
      () => {
        ctx.reply('Приложение не выбрано', shortUserKeyboard)
      }
    )
  }
}

module.exports = {menu}
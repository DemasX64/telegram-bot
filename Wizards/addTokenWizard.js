const {backKeyboard} = require('../Keyboards/backKeyboard');
const {Scenes} = require('telegraf');
const {menu} = require('../menu');
const {addToken} = require('../database');
const {createSpreadsheet} = require("../Spreadsheets/createSpreadsheet")

const addTokenWizard = new Scenes.WizardScene(
  'ADD_TOKEN_SCENE', 
  (ctx) => {
    ctx.reply('Введите токен', backKeyboard);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if(ctx.message.text==='Назад') {
      ctx.scene.leave()
      menu(ctx,ctx.message.from.id)
    } else {
      const newToken = ctx.message.text;
      createSpreadsheet(newToken).then(
        async (spreadsheetID) => {
          await ctx.reply('Таблица создана');
          addToken(newToken,spreadsheetID).then(
            async () => {
             await ctx.reply('Токен добавлен');
           },
            async (err)=>{
              await ctx.reply(`Ошибка\n${err}`)
            }
          ).finally(
            () => {
              menu(ctx, ctx.message.from.id);
              return ctx.scene.leave();
            }
          )
        },
        async (err) => {
          await ctx.reply("Не удалось создать таблицу\n" + err)
          menu(ctx, ctx.message.from.id);
          return ctx.scene.leave();
        }
      )



      
    }
    // const spreadsheetId = await sheets.createSheet(newToken);
    // await addToken(newToken, spreadsheetId)
  },
);

module.exports = {addTokenWizard}
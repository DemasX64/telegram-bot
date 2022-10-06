const {backKeyboard} = require('../Keyboards/backKeyboard');
const {Scenes} = require('telegraf');
const {menu} = require('../menu');
const db = require('../database');
const {deleteAdAccounts} = require('../Browser/deleteAdAccounts')

const deleteAdAccountsWizard = new Scenes.WizardScene(
  'DELETE_AD_ACCOUNTS_SCENE',
  (ctx) => {
    db.getUserApp(ctx.message.from.id).then(
      (app) => {
        if(app?.FacebookID) {
          ctx.wizard.state.appData = {}; 
          ctx.wizard.state.appData.FacebookID = app.FacebookID;
          ctx.reply('Введите рекламные аккаунты, которые надо удалить', backKeyboard);
          return ctx.wizard.next();
        } else {
          ctx.reply("FacebookAppID не указан")
          return ctx.scene.leave()
        }
      },
      () => {
        ctx.reply("Приложение не выбрано")
        return ctx.scene.leave()
      }
    )
  },
  async (ctx) => {
    if(ctx.message.text==='Назад') {
      ctx.scene.leave()
      menu(ctx,ctx.message.from.id)
    } else {
      const ac = ctx.message.text.split(/[ ,\n]+/);
      const accounts = [];
      for (const i of ac) {
        if (!isNaN(i)) {
          accounts.push(i);
        }
      }
      await ctx.reply(await deleteAdAccounts(ctx.wizard.state.appData.FacebookID, accounts, ctx.scene.state.browser));
      menu(ctx, ctx.message.from.id);
      return ctx.scene.leave();
    }
  },
);

module.exports = {deleteAdAccountsWizard}
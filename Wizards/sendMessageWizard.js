const {backKeyboard} = require('../Keyboards/backKeyboard')
const {sendMessageToAllUsers} = require('../Admin/sendMessageToAllUsers')
const {Scenes} = require('telegraf')
const {menu} = require('../menu')

const sendMessageWizard = new Scenes.WizardScene(
  'SEND_MESSAGE_SCENE',
  (ctx) => {
    ctx.reply('Введите сообщение', backKeyboard);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text !== 'Назад') {
      await sendMessageToAllUsers(ctx,ctx.message.text).catch(
        (err) => {
          console.log(err)
        }
      );
    }
    menu(ctx, ctx.message.from.id);
    return ctx.scene.leave();
  },
);

module.exports = {sendMessageWizard}
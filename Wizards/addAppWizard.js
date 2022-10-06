const {wizardKeyboard} = require('../Keyboards/wizardKeyboard')
const {backKeyboard} = require('../Keyboards/backKeyboard')
const {Scenes} = require('telegraf');
const {menu} = require('../menu');
const db = require('../database');
// const addAppWizard = new Scenes.WizardScene(
//   'ADD_APP_SCENE',
//   (ctx) => {
//     ctx.wizard.state.appData = {}; 
//     ctx.reply('Введите идентификатор приложения', wizardKeyboard);
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     if (ctx.message.text == 0) {
//       ctx.wizard.state.appData.id = ctx.message.text;
//       await ctx.reply('Введите название');
//       return ctx.wizard.next();
//     }
//     if (isNaN(ctx.message.text)) {
//       ctx.reply('Идентификатор должен состоять из цифр');
//       return;
//     } else { ctx.wizard.state.appData.id = ctx.message.text; }

//     const isExist = await openAppPage(ctx.wizard.state.appData.id);
//     console.log(isExist);
//     if (!isExist) {
//       await ctx.reply('Идентификатор не существует');
//       await menu(ctx, ctx.message.from.id);
//       return  ctx.scene.leave();
//     } else { await ctx.reply('Введите название'); }
//     return ctx.wizard.next();
//   },
//   (ctx) => {
//     ctx.wizard.state.appData.name = ctx.message.text;
//     ctx.reply('Введите бандл');
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     ctx.wizard.state.appData.bundle = ctx.message.text;
//     const app = {
//       'name': ctx.wizard.state.appData.name,
//       'bundle': ctx.wizard.state.appData.bundle,
//       'added': utils.getDate(),
//     };
//     addApp(`${ctx.wizard.state.appData.name}`, `${ctx.wizard.state.appData.bundle}`, `${ctx.wizard.state.appData.id}`, `${await getToken(ctx.message.from.id)}`).then(async success => {
//       app.token = await getToken(ctx.message.from.id);
//       await sheets.addAppToSheet(await getSpreadsheetId(await getToken(ctx.message.from.id)), app);
//       await appChecker.checkNewApp(app);
//       await ctx.reply('Добавлено');
//       menu(ctx, ctx.message.from.id);
//       return ctx.scene.leave();
//     });
//   },
// );

const addAppWizard = new Scenes.WizardScene(
  'ADD_APP_SCENE',
  async (ctx) => {
    ctx.wizard.state.appData = {}; 
    await ctx.reply('Введите название',backKeyboard);
    return ctx.wizard.next();
  },
  async (ctx) => {
      ctx.wizard.state.appData.name = ctx.message.text;
      await ctx.reply('Введите бандл',backKeyboard);
      return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.appData.bundle = ctx.message.text;
    ctx.reply('Введите FacebookAppID',wizardKeyboard);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === 'Пропустить') {
      ctx.wizard.state.appData.facebook = null;
    } else {
      ctx.wizard.state.appData.facebook = ctx.message.text;
    }
    ctx.reply('Введите Appsflyer',wizardKeyboard);
      return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === 'Пропустить') {
      ctx.wizard.state.appData.appsflyer = null;
    } else {
      ctx.wizard.state.appData.appsflyer = ctx.message.text;
    }
    ctx.reply('Введите Deeplink',wizardKeyboard);
      return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === 'Пропустить') {
      ctx.wizard.state.appData.deeplink = null;
    } else {
      ctx.wizard.state.appData.deeplink = ctx.message.text;
    }
    ctx.reply('Введите OneLink',wizardKeyboard);
      return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === 'Пропустить') {
      ctx.wizard.state.appData.onelink = null;
    } else {
      ctx.wizard.state.appData.onelink = ctx.message.text;
    }
    ctx.reply('Введите гео',wizardKeyboard);
      return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text === 'Пропустить') {
      ctx.wizard.state.appData.geo = null;
    } else {
      ctx.wizard.state.appData.geo = ctx.message.text;
    }
    db.addApp(ctx.wizard.state.appData).then(
      async () => {
        await ctx.reply('Добавлено')
      },
      async (err) => {
        await ctx.reply('Ошибка при добавлении\n' + err)
      }
    ).finally(
      () => {
        menu(ctx,ctx.message.from.id)
        return ctx.scene.leave();
      }
    )
  },
);

module.exports = {addAppWizard}
const {
  Telegraf, Markup, Scenes, session,
} = require('telegraf');
const db = require('./database')
const {menu} = require('./menu')
const {sendMessageWizard} = require('./Wizards/sendMessageWizard')
const {addTokenWizard} = require('./Wizards/addTokenWizard')
const {addAppWizard} = require('./Wizards/addAppWizard')
const {addAdAccountsWizard} = require('./Wizards/addAdAccountsWizard')
const {deleteAdAccountsWizard} = require('./Wizards/deleteAdAccountsWizard')
const {updateAppTokens} = require('./Wizards/updateAppTokens')
const puppeteer = require('puppeteer')
const schedule = require('node-schedule')
const {loginFacebook} = require('./Browser/loginFacebook')
const {getAdAcconts} = require('./Browser/getAdAccounts')
const {startCheck} = require('./AppChecker/startCheck')
const {facebookKeyboard} = require('./Keyboards/facebookKeyboard')
const {tiktokKeyboard} = require('./Keyboards/tiktokKeyboard')
const {loginMiddleware} = require('./Middleware/loginMiddleware')
const {adminMiddleware} = require('./Middleware/adminMiddleware')
const {isMessageExistMiddleware} = require('./Middleware/isMessageExistMiddleware')
const {getStatus} = require('./Utils/getStatus')
const config = require('./config.json')

const bot = new Telegraf(config.telegram_token);

const stage = new Scenes.Stage([addTokenWizard, sendMessageWizard,addAppWizard,addAdAccountsWizard,deleteAdAccountsWizard,updateAppTokens]);

let browser

bot.use(session());
bot.use(stage.middleware());

bot.on('callback_query', (ctx) => {
  const type = ctx.update.callback_query.data.split(' ')[0]
  const AppID = ctx.update.callback_query.data.split(' ')[1]
  const UserID = ctx.update.callback_query.from.id
  switch (type) {
    case "set":
      db.selectApp(UserID,AppID).then(
        async () => {
          await ctx.reply('Приложение выбрано')
        },
        async () => {
          await ctx.reply('Приложение не было выбрано')
        }
      ).finally(
        () => {
          try {
            ctx.deleteMessage(ctx.update.callback_query.message.message_id)
          } catch (err) { }
          menu(ctx, UserID)
        }
      )
      break;
    case 'token':
      db.getSharedTokens(AppID).then(
        async (tokens) => {
          let message = "Список токенов приложения:\n"
          for (let i =0; i < tokens.length; i++) {
            message += `${tokens[i].Token}\n`
          }
          await ctx.reply(message)
          ctx.scene.enter('UPDATE_APP_TOKENS_SCENE', {AppID});
        },
        async () => {
          await ctx.reply('Список токенов приложения пуст')
          ctx.scene.enter('UPDATE_APP_TOKENS_SCENE', {AppID});
        }
      ).finally(
        () => {
          try {
            ctx.deleteMessage(ctx.update.callback_query.message.message_id)
          } catch (err) { }
        }
      )
      break;
    default:
      menu(ctx, UserID)
      break;
  }
})

bot.use(isMessageExistMiddleware())
bot.use(loginMiddleware())
bot.use(adminMiddleware())

bot.start((ctx) => {
  ctx.reply('Введите /login {токен} для доступа к боту');
});
// админ
bot.hears('Список токенов', (ctx) => {
  db.getAllTokens().then((tokens) => {
    let message = "Список токенов:\n"
    for (let i = 0; i < tokens.length; i++) {
      message += `${tokens[i].Token}\n`
    }
    ctx.reply(message)
  },
  () => {
    ctx.reply("Список токенов пуст")
  }
  )
})

bot.hears('Отправить сообщение', (ctx) => {
  ctx.scene.enter('SEND_MESSAGE_SCENE');
})

bot.hears('Добавить токен', (ctx) => {
  ctx.scene.enter('ADD_TOKEN_SCENE');
})

bot.hears('Список приложений', async (ctx) => {
  if (await db.isAdmin(ctx.message.from.id)) {
    db.getAllApps().then(
      async (apps) => {
        const buttons = [];
        for (let i = 0; i < apps.length; i++) {
          // const status = () => {
          //   switch(apps[i].IsAlive){
          //     case 0:
          //       return '🔴';
          //     case 1:
          //       return '🟢';
          //     default:
          //       return '⚫';
          //   }
          // }
          buttons.push([Markup.button.callback(`${getStatus(apps[i])} ${apps[i].Name}`, `token ${apps[i].AppID}`)]);
        }
        await ctx.reply('Список приложений:', Markup.inlineKeyboard(buttons));
        ctx.reply("Выберите приложение из списка, чтобы добавить/удалить токены")
      },
      () => {
        ctx.reply("Приложения не найдены")
      }
    )
  } else {
    db.getUserApps(ctx.message.from.id).then(
      async (apps) => {
        const buttons = [];
        for (let i = 0; i < apps.length; i++) {
          // const status = () => {
          //   switch(apps[i].IsAlive){
          //     case 0:
          //       return '🔴';
          //     case 1:
          //       return '🟢';
          //     default:
          //       return '⚫';
          //   }
          // }
          buttons.push([Markup.button.callback(`${getStatus(apps[i])} ${apps[i].Name}`, `set ${apps[i].AppID}`)]);
        }
        await ctx.reply('Ваши приложения:', Markup.inlineKeyboard(buttons));
        ctx.reply('Выберите приложение из списка, чтобы сделать текущим');
      },
      () => {
        ctx.reply("Список приложений пуст")
      }
    )
  }
})

bot.hears('Добавить приложение', (ctx) => {
  ctx.scene.enter('ADD_APP_SCENE');
})

addAppWizard.hears("Назад", (ctx) => {
  ctx.scene.leave();
  menu(ctx, ctx.message.from.id);
})

// пользователь

bot.hears('Таблица', (ctx) => {
  db.getUserSpreadsheetID(ctx.message.from.id).then(
    async (SpreadsheetID) => {
      await ctx.reply(`https://docs.google.com/spreadsheets/d/${SpreadsheetID}/edit#gid=0`)
    },
    async (err) => {
      await ctx.reply('Ошибка')
      console.log(err)
    }
  )
})

bot.hears('Facebook', (ctx) => {
  ctx.reply("Facebook", facebookKeyboard);
})

bot.hears('Добавить РК', (ctx) => {
  ctx.scene.enter('ADD_AD_ACCOUNTS_SCENE',  { browser });
})

bot.hears('Список РК', async (ctx) => {
  db.getUserApp(ctx.message.from.id).then(
    async (app) => {
      if (app.FacebookID) {
        const list = await getAdAcconts(app.FacebookID, browser);
        let answer = `Список РК приложения ${app.Name}:\nКоличество РК: ${list.length}\n`;
        if (list.length > 100) {
          for (let i = 0; i < 100; i++) {
            answer += `${list[i]}\n`;
          }
        } else {
          for (let i = 0; i < list.length; i++) {
            answer += `${list[i]}\n`;
          }
        }        
        ctx.reply(answer);
      } else {
        ctx.reply('FacebookID не указан')
      }
    },
    () => {
      ctx.reply('Приложение не выбрано')
    }
  )
})

bot.hears('Удалить РК', (ctx) => {
  ctx.scene.enter('DELETE_AD_ACCOUNTS_SCENE', { browser });
})

bot.hears('TikTok', (ctx) => {
  ctx.reply("Tiktok", tiktokKeyboard);
})

bot.hears('Получить ссылку', async (ctx) => {
  await ctx.reply("Вот ваша ссылка");
  menu(ctx,ctx.message.from.id)
})

bot.hears("Назад", (ctx) => {
  menu(ctx, ctx.message.from.id);
})

bot.hears('Помощь', (ctx) => {
  ctx.reply(`Обозначения:\n
  ✅ - Можно лить\n
  ⛔️ - Нельзя лить\n
  🅱️ - Приложение забанено\n
  ⚫ - Статус еще не получен\n\n
  Написать в поддержку t.me/RamilSamara`);
})

bot.command('login', (ctx) => {
  const token = ctx.message.text.slice("/login".length).trim();
  const UserID = ctx.message.from.id;

  db.checkToken(token).then(()=>{
    db.signIn(token, UserID).then(async () => {
      await ctx.reply('Успешный вход');
      menu(ctx,UserID)
    })
  },
  (() => {
    ctx.reply('Токен не найден');
  })
  )
})

async function launch() {
  browser = await puppeteer.launch({ headless: false });
  await loginFacebook(browser);
  schedule.scheduleJob('0 4 * * *', async () => {
    await browser.close();
    browser = await puppeteer.launch({ headless: false });
    await loginFacebook(browser);
  });
  schedule.scheduleJob('0,30 * * * *', async () => {
    startCheck()
  });
  bot.launch()
}

launch()

exports.bot = bot
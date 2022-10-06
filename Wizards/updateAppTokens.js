const {tokenKeyboard} = require('../Keyboards/tokenKeyboard')
const {backKeyboard} = require('../Keyboards/backKeyboard')
const {Scenes} = require('telegraf')
const {menu} = require('../menu')
const db = require('../database')
const {addAppToSpreadsheet} = require("../Spreadsheets/addAppToSpreadsheet")

const updateAppTokens = new Scenes.WizardScene(
  'UPDATE_APP_TOKENS_SCENE',
  (ctx) => {
    ctx.reply('Выберите действие', tokenKeyboard);
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.appData = {}; 
    switch (ctx.message.text) {
      case 'Назад':
        menu(ctx, ctx.message.from.id);
        return ctx.scene.leave();
        break;
      case 'Добавить':
        await ctx.reply('Введите токен, который хотите добавить',backKeyboard);
        ctx.wizard.state.appData.type = 'Добавить' 
        return ctx.wizard.next();
        break;
      case 'Удалить':
        await ctx.reply('Введите токен, который хотите удалить',backKeyboard);
        ctx.wizard.state.appData.type = 'Удалить'
        return ctx.wizard.next();
        break;
      case 'Поменять статус':
        db.getIsWork(ctx.scene.state.AppID).then(
          (IsWork) => {
            if (IsWork === 1) {
              db.changeIsWork(0, ctx.scene.state.AppID).then(
                () => {
                  ctx.reply('Статус изменен')
                  menu(ctx, ctx.message.from.id);
                  return ctx.scene.leave();
                }
              ).catch(async (err)=>{
                ctx.reply(err)
                menu(ctx, ctx.message.from.id);
                return ctx.scene.leave();
              })
            } else {
              db.changeIsWork(1, ctx.scene.state.AppID).then(
                () => {
                  ctx.reply('Статус изменен')
                  menu(ctx, ctx.message.from.id);
                  return ctx.scene.leave();
                }
              ).catch(async (err)=>{
                ctx.reply(err)
                menu(ctx, ctx.message.from.id);
                return ctx.scene.leave();
              })
            }
          } 
        ).catch(
          async (err) => {
            await ctx.reply('Ошибка изменения статуса\n' + err)
            menu(ctx, ctx.message.from.id);
            return ctx.scene.leave();
          }
        )
        break;
      default:
        ctx.reply('Неправильное значение', tokenKeyboard);
        return;
        break;
    }
  },
  async (ctx) => {
    const token = ctx.message.text

    if (token === "Назад") {
      menu(ctx, ctx.message.from.id);
      return ctx.scene.leave();
    }

    switch (ctx.wizard.state.appData.type) {
      case 'Добавить':
        db.shareApp(ctx.scene.state.AppID,token).then(
          async () => {
            db.getSpreadsheetID(token).then(
              async (SpreadsheetID) => {
                db.getAppByID(ctx.scene.state.AppID).then(
                  (app) => {
                    addAppToSpreadsheet(SpreadsheetID,app)
                  },
                  (err) => {
                    console.log('Ошибка получени приложения\n' + err)
                  } 
                )
              },
              (err) => {
                console.log('Ошибка получения таблицы\n' + err)
              }
            )
            await ctx.reply('Токен добавлен')
            menu(ctx, ctx.message.from.id);
            return ctx.scene.leave();
          },
          async () => {
            await ctx.reply('Ошибка добавления')
            menu(ctx, ctx.message.from.id);
            return ctx.scene.leave();
          }
        )
        break;
      case 'Удалить':
        db.unshareApp(ctx.scene.state.AppID,token).then(
          async () => {
            await ctx.reply('Токен удален')
            menu(ctx, ctx.message.from.id);
            return ctx.scene.leave();
          },
          async () => {
            await ctx.reply('Ошибка удаления')
            menu(ctx, ctx.message.from.id);
            return ctx.scene.leave();
          }
        )
        break;
      default:
        menu(ctx, ctx.message.from.id);
        return ctx.scene.leave();
        break;
    }
  },
);

module.exports = {updateAppTokens}
const { Markup } = require('telegraf');

const adminKeyboard = new Markup.keyboard([
  ['Список токенов'],
  ['Отправить сообщение'],
  ['Добавить токен'],
  ['Список приложений'],
  ['Добавить приложение'],
]);

module.exports = {adminKeyboard}
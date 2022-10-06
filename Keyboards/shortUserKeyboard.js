const { Markup } = require('telegraf');

const shortUserKeyboard = new Markup.keyboard([
  ['Список приложений'],
  ['Таблица'],
  ['Помощь'],
]);

module.exports = {shortUserKeyboard}
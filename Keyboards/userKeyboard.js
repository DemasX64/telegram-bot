const { Markup } = require('telegraf');

const userKeyboard = new Markup.keyboard([
  ['Facebook','TikTok'],
  ['Список приложений'],
  ['Таблица'],
  ['Помощь'],
]);

module.exports = {userKeyboard}
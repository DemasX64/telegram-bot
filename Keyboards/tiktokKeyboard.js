const { Markup } = require('telegraf');

const tiktokKeyboard = new Markup.keyboard([
  ['Получить ссылку'],
  ['Назад'],
]);

module.exports = {tiktokKeyboard}
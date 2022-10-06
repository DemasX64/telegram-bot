const { Markup } = require('telegraf');

const facebookKeyboard = new Markup.keyboard([
  ['Добавить РК','Список РК','Удалить РК'],
  ['Назад'],
]);

module.exports = {facebookKeyboard}
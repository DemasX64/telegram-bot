const { Markup } = require('telegraf');

const tokenKeyboard = new Markup.keyboard([
  ['Добавить'],
  ['Удалить'],
  ['Поменять статус'],
  ['Назад'],
]);

module.exports = {tokenKeyboard}
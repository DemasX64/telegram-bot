const { Markup } = require('telegraf');

const wizardKeyboard = new Markup.keyboard([
  ['Пропустить'],
  ['Назад'],
]);

module.exports = {wizardKeyboard}
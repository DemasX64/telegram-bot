const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')

async function setupSpreadsheet(spreadsheetId){
  try {
    await getGoogleSheets().spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: 'Sheet1!1:1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['№', 'Название', 'Комментарии', 'Ссылка', 'Описание', 'Установки', 'Оценка', 'Добавили в бот', 'Вышло из модерации', 'Бан' ]],
      },
    });
  } catch (err) {
    console.log(err)
  }
}

module.exports = { setupSpreadsheet}
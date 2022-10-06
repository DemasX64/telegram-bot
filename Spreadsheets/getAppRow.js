const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')

async function getAppRow(spreadsheetId, name){
  return new Promise(async (resolve , reject) => {
    try {
      const data = await getGoogleSheets().spreadsheets.values.get({
        spreadsheetId,
        range: 'B2:B1000', 
        majorDimension: 'COLUMNS',
        auth,
      });
      const values = data?.data?.values[0];
      if (values) {
        const row = values.indexOf(name);
        if (row !== -1) {
          resolve(row + 2)
        } else {
          reject("Не найдено")
        }
      } else {
        reject("Ошибка запроса")
      }
    } catch (err) {
      reject(err)
    } 
  })
}

module.exports = {getAppRow}
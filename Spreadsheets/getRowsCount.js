const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')


async function getRowsCount(spreadsheetId){
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getGoogleSheets().spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:A1000', 
        majorDimension: 'COLUMNS',
        auth,
      });
      const count = data?.data?.values[0]?.length;
      if (count) {
        resolve(count);
      } else {
        reject("Ошибка запроса")
      }
    } catch (err) {
      reject(err)
    }
  });
}

module.exports = { getRowsCount}
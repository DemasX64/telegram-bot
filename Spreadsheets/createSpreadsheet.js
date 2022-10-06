const {getGoogleSheets, auth,client } = require('../Spreadsheets/authSpreadsheet')
const {setupSpreadsheet} = require('../Spreadsheets/setupSpreadsheet')
const {shareSpreadsheet} = require('../Spreadsheets/shareSpreadsheet')
const {formatSpreadsheet} = require('../Spreadsheets/formatSpreadsheet')


async function createSpreadsheet(title){
  return new Promise(async (resolve, reject)=> {  
    try {
      const response = (await getGoogleSheets().spreadsheets.create({
        resource: {
          'properties': {
            'title': `${title}`
          }
        },
        auth,
      })).data;
      if (response?.spreadsheetId)
      {
        setupSpreadsheet(response.spreadsheetId);
        shareSpreadsheet(response.spreadsheetId);
        formatSpreadsheet(response.spreadsheetId);
        resolve(response.spreadsheetId);
      }
      else
        reject("Ошибка запроса" + response);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  createSpreadsheet
}
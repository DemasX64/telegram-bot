const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')

async function formatSpreadsheet(spreadsheetId){
  await getGoogleSheets().spreadsheets.batchUpdate({
    spreadsheetId,
    auth,
    resource: formatHeader,
  });
}

let formatHeader = {
  'requests': [
    {
      'repeatCell': {
        'cell': {
          'userEnteredFormat': {
            'backgroundColor': {
              'red': 0.98,
              'green': 0.74,
              'blue': 0.02
            },
            'textFormat': {
              'bold': true
            }
          }
        },
        'range': {
          'sheetId': 0,
          'endColumnIndex': 10,
          'endRowIndex': 1
        },
        'fields': 'userEnteredFormat(backgroundColor,textFormat)'
      }
    }
  ]
};

module.exports = { formatSpreadsheet}
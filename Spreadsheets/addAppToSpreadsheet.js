const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')
const {getRowsCount} = require('../Spreadsheets/getRowsCount')
const {formatRow} = require('../Spreadsheets/formatRow')

async function addAppToSpreadsheet(spreadsheetId, app){
  const url = `https://play.google.com/store/apps/details?id=${app.Bundle}`;
  const count = await getRowsCount(spreadsheetId);
  await getGoogleSheets().spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: `Sheet1!A${count+1}`,
    insertDataOption: 'INSERT_ROWS',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[`${count}`, `${app.Name}`, '', url, '', '', '', `${app.Added}`, '', '' ]],
    },
  });
  await formatRow(spreadsheetId);
}

module.exports = { addAppToSpreadsheet}
const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')
const {getAppRow} = require('../Spreadsheets/getAppRow')

async function updateAppInSpreadsheet(spreadsheetId, name, info){
  try {
    const row = await getAppRow(spreadsheetId, name);
    const data = await getGoogleSheets().spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!E${row}:G${row}`, 
      auth,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[`${info.description}`, `${info.installs}`, `${info.rating}` ]],
      },
    });
    console.log(data);
  } catch (err) {
    console.log(err)  
  }
}

module.exports = { updateAppInSpreadsheet}
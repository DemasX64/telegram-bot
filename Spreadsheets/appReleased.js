const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')
const {getDate} = require('../Utils/getDate')
const {getAppRow} = require('../Spreadsheets/getAppRow')

async function appReleased(spreadsheetId, name, date){
    getAppRow(spreadsheetId, name).then(
      async (row) => {
        try {
          if (!date)
            date = getDate();
          await getGoogleSheets().spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!I${row}`, 
            auth,
            valueInputOption: 'USER_ENTERED',
            resource: {
              values: [[`${date}` ]],
            },
          });
        } catch (err) {
          console.log(err)
        }
      },
      (err) => {
        console.log(err)
      }
    );
}

module.exports = { appReleased }
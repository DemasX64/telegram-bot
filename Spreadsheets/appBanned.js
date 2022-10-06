const {getGoogleSheets, auth} = require('../Spreadsheets/authSpreadsheet')
const {getDate} = require('../Utils/getDate')
const {getAppRow} = require('../Spreadsheets/getAppRow')

async function appBanned(spreadsheetId, name){
    getAppRow(spreadsheetId, name).then(
      async (row) => {
        try {
          const date = getDate();
          await getGoogleSheets().spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!J${row}`, 
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

module.exports = {appBanned}
const {getGoogleDrive, auth} = require('../Spreadsheets/authSpreadsheet')

async function shareSpreadsheet(fileId){
  try {
    const response = await getGoogleDrive().permissions.create({
      auth,
      fileId,
      requestBody: {
        role: 'writer',
        type: 'anyone',
      }
    }).data;
    console.log(JSON.stringify(response));
  } catch (err) {
    console.error(err);
  }
}

module.exports = { shareSpreadsheet}
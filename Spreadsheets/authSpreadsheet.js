const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFile: './Spreadsheets/credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
});

let googleSheets
let googleDrive

const init = async () => {
  const client = await auth.getClient();
  googleSheets = google.sheets({ version: 'v4', auth: client });
  googleDrive = google.drive({ version: 'v3', auth: client });
};

init()

function getGoogleSheets(){
  return googleSheets
}
function getGoogleDrive(){
  return googleDrive
}

module.exports = {
  auth,
  getGoogleSheets,
  getGoogleDrive
}
const {getDate} = require('../Utils/getDate')
const {db, getSpreadsheetsWithApp, getuse, getAllUsersOfApp} = require('../database')
const {appBanned} = require('../Spreadsheets/appBanned')
const {appReleased} = require('../Spreadsheets/appReleased')
const {updateAppInSpreadsheet} = require('../Spreadsheets/updateAppInSpreadsheet')
const index = require('../index');

async function updateApp(isAlive, app, info) {
  const wasAlive = app.IsAlive;
  const date = getDate();

  if (wasAlive === 1 && isAlive === 0) {
    const message = `Приложение ${app.Name} было забанено`;
    db.run('UPDATE AppInfos SET Banned = ? WHERE AppID = ?', [date,app.AppID])
    getAllUsersOfApp(app.AppID).then(
      async (users) => {
        for (let i = 0; i < users.length; i++) {
          try {
            await index.bot.telegram.sendMessage(users[i].UserID, message);
          } catch (err) { 
            console.log(err) 
          }
        }
      },
      (err) => {
        console.log(err)
      }
    )
    getSpreadsheetsWithApp(app.AppID).then(
      (spreadsheets) => {
        for (let i = 0; i < spreadsheets.lenght; i++) {
          appBanned(spreadsheets[i].SpreadsheetID, app.Name)
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }
  if (wasAlive === 0 && isAlive === 1) {
      const message = `Приложение ${app.Name} вышло из модерации`;
      db.run('UPDATE AppInfos SET Released = ? WHERE AppID = ?', [date, app.AppID])
      getAllUsersOfApp(app.AppID).then(
        async (users) => {
          for (let i = 0; i < users.length; i++) {
            try {
              await index.bot.telegram.sendMessage(users[i].UserID, message);
            } catch (err) { 
              console.log(err) 
            }
          }
        },
        (err) => {
          console.log(err)
        }
      )
      getSpreadsheetsWithApp(app.AppID).then(
        (spreadsheets) => {
          for (let i = 0; i < spreadsheets.lenght; i++) {
            appReleased(spreadsheets[i].SpreadsheetID, app.Name)
          }
        },
        (err) => {
          console.log(err)
        }
      )
    } 
  db.run('UPDATE AppInfos SET IsAlive = ? WHERE AppID = ?', [isAlive, app.AppID])
  if (info) {
    db.run('UPDATE AppInfos SET Description = ?, Installs = ?, Rating = ? WHERE AppID = ?', [info.description,info.installs,info.rating,app.AppID])
    getSpreadsheetsWithApp(app.AppID).then(
      (spreadsheets) => {
        for (let i = 0; i < spreadsheets.lenght; i++) {
          updateAppInSpreadsheet(spreadsheets[i].SpreadsheetID, app.Name, info)
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // if (status == 0) {
  //   if (oldStatus == 1) {
  //     const message = `Приложение ${app.Name} было забанено`;
  //     sendMessagesToUsersByToken(app.token, message);
  //     db.run('UPDATE apps SET banned=? WHERE bundle=?', [date, app.Bundle], async (err, row) => {
  //       if (err) {
  //         logger.logToFile(err);
  //       }
  //       sheets.appBanned(await getSpreadsheetId(app.token), app.name);
  //     });
  //   }
  //   db.run('UPDATE apps SET status=? WHERE bundle=?', [status, app.bundle], (err) => {
  //     if (err) {
  //       logger.logToFile(err);
  //     }
  //   });
  // } else {
  //   if (oldStatus == 0 || !oldStatus) {
  //     const message = `Приложение ${app.name} вышло из модерации`;
  //     sendMessagesToUsersByToken(app.token, message);
  //     db.run('UPDATE apps SET released=? WHERE bundle=?', [date, app.bundle], async (err, row) => {
  //       if (err) {
  //         logger.logToFile(err);
  //       }
  //       sheets.appReleased(await getSpreadsheetId(app.token), app.name);
  //     });
  //   }
  //   const obj = {
  //     description,
  //     installs,
  //     rating,
  //     name: app.name,
  //   };
  //   db.run('UPDATE apps SET status=?,description =?,installs =?,rating=? WHERE bundle=?', [status, description, installs, rating, app.bundle], async (err, row) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     if (row) {
  //       sheets.updateAppInfoInSheet(await getSpreadsheetId(app.token), obj);
  //     }
  //   });
  // }
}

module.exports = {updateApp}

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db.sqlite3');

const {getDate} = require('./Utils/getDate')

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Tokens (
    Token TEXT PRIMARY KEY,
    IsAdmin INTEGER DEFAULT 0,
    SpreadsheetID TEXT
    )`);
  db.run(`CREATE TABLE IF NOT EXISTS Apps (
    AppID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Bundle TEXT,
    IsWork DEFAULT 1
    )`);
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    UserID INTEGER PRIMARY KEY,
    AppID TEXT,
    Token TEXT,
    FOREIGN KEY (AppID) REFERENCES Apps (AppId) ON DELETE SET NULL,
    FOREIGN KEY (Token) REFERENCES Tokens (Token) ON DELETE SET NULL
    )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS SharedApps (
    Token TEXT,
    AppID INTEGER,
    FOREIGN KEY (Token) REFERENCES Tokens(Token) ON DELETE CASCADE,
    FOREIGN KEY (AppID) REFERENCES Apps (AppId) ON DELETE CASCADE
    )`);
  db.run(`CREATE TABLE IF NOT EXISTS AppUtils (
    AppID INTEGER,
    FacebookID TEXT,
    Deeplink TEXT,
    Onelink TEXT,
    Naming TEXT,
    Geo TEXT,
    FOREIGN KEY (AppID) REFERENCES Apps (AppId) ON DELETE CASCADE
    )`);
  db.run(`CREATE TABLE IF NOT EXISTS AppInfos (
    AppID INTEGER,
    IsAlive INTEGER,
    Description TEXT,
    Installs TEXT,
    Rating TEXT,
    Added TEXT,
    Released TEXT,
    Banned TEXT,
    FOREIGN KEY (AppID) REFERENCES Apps (AppId) ON DELETE CASCADE
    )`);
});


function isLogin(UserID){
  return new Promise((resolve, reject) => {
    db.get('SELECT Token FROM Users WHERE UserID = ?', [UserID], (err, row) => {
      if (err || !row?.Token) resolve(false)
      resolve(true)
    })
  })
}

function checkToken(Token){
  return new Promise((resolve, reject) => {
    db.get('SELECT Token FROM Tokens WHERE Token = ?', [Token], (err, row) => {
      if (err || !row) { reject(false); }
      resolve(true)
    })
  })
}

function signIn(Token, UserID){
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Users (UserID,Token)
                VALUES (?,?)
                ON CONFLICT(UserID)
                DO UPDATE SET
                Token=excluded.Token, AppID = NULL`, [UserID, Token], (err) => {
      if (err) { reject(err); }
      resolve(true);
    });
  });
}

function addToken(Token,SpreadsheetID){
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Tokens (Token, SpreadsheetID)
                VALUES (?,?)`,
                [ Token, SpreadsheetID], (err) => {
      if (err) { reject(err); }
      resolve(true);
    });
  });
}

function addApp(app){
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Apps (Name, Bundle)
            VALUES (?,?)`,
            [app.name, app.bundle],
            function (err) {
      if (err) { reject(err); }
      const AppID = this.lastID
      db.run(`INSERT INTO AppUtils (AppID, FacebookID, Deeplink, Onelink, Naming, Geo)
      VALUES (?,?,?,?,?,?)`,[AppID,app.facebook,app.deeplink,app.onelink,app.appsflyer,app.geo], (err) => {
        if (err) { reject(err); }
        db.run(`INSERT INTO AppInfos (AppID,Added)
                VALUES (?,?)`,[AppID,getDate()], (err) => {
        if (err) { reject(err); }
        resolve(true)
      })
      })
    });
  });
}

function shareApp(AppID,Token){
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO SharedApps (AppID,Token)
                VALUES (?,?)`,
                [AppID,Token], (err) => {
      if (err) { reject(err); }
      resolve(true);
    });
  });
}
function unshareApp(AppID,Token){
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM SharedApps 
                WHERE AppID = ? AND Token = ?`,
                [AppID,Token], (err) => {
      if (err) { reject(err); }
      resolve(true);
    });
  });
}

// function getUserApp(UserID){
//   return new Promise((resolve, reject) => {
//     db.get(`SELECT * `, [UserID], (err, app) => {
//       if (err) { reject(err); }
//       resolve(app);
//     });
//   });
// }

function getAppsByToken(Token){
  return new Promise((resolve, reject) => {
    db.all(`SELECT  SharedApps.AppID,Name, IsAlive
            FROM SharedApps 
            INNER JOIN Apps ON SharedApps.AppID = Apps.AppID
            INNER JOIN AppInfos ON SharedApps.AppID = AppInfos.AppID
            WHERE SharedApps.Token = ?`, [Token], (err, apps) => {
      if (err || apps.length === 0) { reject(apps); }
      resolve(apps);
    });
  });
}

function getAppByID(AppID){
  return new Promise((resolve, reject) => {
    db.get(`SELECT Name,Added,Bundle
            FROM Apps 
            LEFT JOIN AppUtils ON Apps.AppID = AppUtils.AppID
            LEFT JOIN AppInfos ON Apps.AppID = AppInfos.AppID
            WHERE Apps.AppID = ?`, [AppID], (err, app) => {
      if (err) { reject(app); }
      resolve(app);
    });
  });
}

function getSpreadsheetsWithApp(AppID){
  return new Promise((resolve, reject) => {
    db.all(`SELECT SpreadsheetID
            FROM SharedApps 
            INNER JOIN Tokens ON Tokens.Token = SharedApps.Token
            WHERE SharedApps.AppID = ?`, [AppID], (err, spreadsheets) => {
      if (err || spreadsheets.length === 0) { reject([]); }
      resolve(spreadsheets);
    });
  });
}


function getAllUsersOfApp(AppID){
  return new Promise((resolve, reject) => {
    db.all(`SELECT UserID
            FROM SharedApps 
            INNER JOIN Tokens ON Tokens.Token = SharedApps.Token
            INNER JOIN Users ON SharedApps.Token = Users.Token
            WHERE SharedApps.AppID = ?`, [AppID], (err, users) => {
      if (err || users.length === 0) { reject([]); }
      resolve(users);
    });
  });
}


function getUserApps(UserID){
  return new Promise((resolve, reject) => {
    db.all(`SELECT SharedApps.AppID,Name,IsAlive,IsWork
            FROM Users 
            INNER JOIN SharedApps ON Users.Token = SharedApps.Token
            INNER JOIN Apps ON SharedApps.AppID = Apps.AppID
            LEFT JOIN AppInfos ON SharedApps.AppID = AppInfos.AppID
            WHERE Users.UserID = ?`, [UserID],
             (err, apps) => {
      if (err || apps.length === 0) { reject(apps); }
      resolve(apps);
    });
  });
}

function selectApp(UserID,AppID){
  return new Promise((resolve, reject) => {
    db.run(`UPDATE Users SET AppID = ? WHERE UserID=?`, [AppID, UserID], (err) => {
      if (err) { reject(false); }
      resolve(true);
    });
  });
}

function changeIsWork(IsWork,AppID){
  return new Promise((resolve, reject) => {
    db.run(`UPDATE Apps SET IsWork = ? WHERE AppID=?`, [IsWork, AppID], (err) => {
      if (err) { reject(false); }
      resolve(true);
    });
  });
}
function getIsWork(AppID){
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM Apps WHERE AppID=?`, [AppID], (err, app) => {
      if (err || !app) { reject(false); }
      resolve(app.IsWork);
    });
  });
}

function getAllTokens(){
  return new Promise((resolve, reject) => {
    db.all(`SELECT Token FROM Tokens WHERE IsAdmin = 0`, (err, tokens) => {
      if (err || tokens.length === 0) { reject([]); }
      resolve(tokens);
    });
  });
}

function getAllUsers(){
  return new Promise((resolve, reject) => {
    db.all(`SELECT UserID
            FROM Users 
            INNER JOIN Tokens ON Users.Token = Tokens.Token
            WHERE Tokens.IsAdmin = 0`,
            (err, users) => {
      if (err || users.length === 0) { reject([]); }
      resolve(users);
    });
  });
}

// function getAllApps(UserID){
//   return new Promise((resolve, reject) => {
//     db.all(`SELECT Users.AppID,Name,IsAlive
//             FROM Users 
//             INNER JOIN Apps ON Users.AppID = Apps.AppID
//             LEFT JOIN AppUtils ON Users.AppID = AppUtils.AppID
//             LEFT JOIN AppInfos ON Users.AppID = AppInfos.AppID
//             WHERE Users.UserID = ?`, [UserID],
//             (err, apps) => {
//       if (err || apps.length === 0) { reject([]); }
//       resolve(apps);
//     });
//   });
// }

function getAllApps(){
  return new Promise((resolve, reject) => {
    db.all(`SELECT Apps.AppID,Name,IsAlive,IsWork
            FROM Apps 
            LEFT JOIN AppUtils ON Apps.AppID = AppUtils.AppID
            LEFT JOIN AppInfos ON Apps.AppID = AppInfos.AppID`,
            (err, apps) => {
      if (err || apps.length === 0) { reject([]); }
      resolve(apps);
    });
  });
}

function getSpreadsheetID(token){
  return new Promise((resolve, reject) => {
    db.get(`SELECT SpreadsheetID
            FROM Tokens 
            WHERE Token = ?`, [token],
            (err, spreadsheetID) => {
      if (err) { reject([]); }
      resolve(spreadsheetID.SpreadsheetID);
    });
  });
}
function getUserSpreadsheetID(UserID){
  return new Promise((resolve, reject) => {
    db.get(`SELECT SpreadsheetID
            FROM Users
            INNER JOIN Tokens ON Users.Token = Tokens.Token 
            WHERE UserID = ?`, [UserID],
            (err, spreadsheetID) => {
      if (err) { reject([]); }
      resolve(spreadsheetID.SpreadsheetID);
    });
  });
}

function getAllAppsForCheck(){
  return new Promise((resolve, reject) => {
    db.all(`SELECT Name,Apps.AppID,Bundle,IsAlive
            FROM Apps
            LEFT JOIN AppInfos ON Apps.AppID = AppInfos.AppID`,
            (err, apps) => {
      if (err || apps.length === 0) { reject([]); }
      resolve(apps);
    });
  });
}

function getUserApp(UserID){
  return new Promise((resolve, reject) => {
    db.get(`SELECT *
            FROM Users 
            INNER JOIN Apps ON Users.AppID = Apps.AppID
            LEFT JOIN AppUtils ON Users.AppID = AppUtils.AppID
            LEFT JOIN AppInfos ON Users.AppID = AppInfos.AppID
            WHERE Users.UserID = ?`, [UserID],
            (err, app) => {
      if (err || !app) { reject(); }
      resolve(app);
    });
  });
}

function getSharedTokens(AppID){
  return new Promise((resolve, reject) => {
    db.all(`SELECT Token FROM SharedApps WHERE AppID = ?`, [AppID], (err, tokens) => {
      if (err || tokens.length === 0) { reject([]); }
      resolve(tokens);
    });
  });
}

function getUsersByToken(){
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Users WHERE Token = ?`, (err, users) => {
      if (err || users.length === 0) { reject([]); }
      resolve(users);
    });
  });
}

function isAdmin(UserID){
  return new Promise((resolve, reject) => {
    db.get(`SELECT IsAdmin
            FROM Users 
            INNER JOIN Tokens ON Users.Token = Tokens.Token
            WHERE Users.UserID = ?`, [UserID], (err, res) => {
      if (err) { reject(false); }
      resolve(res?.IsAdmin);
    });
  });
}

module.exports = {
  signIn,
  checkToken,
  isLogin,
  getAllTokens,
  isAdmin,
  addToken,
  getAllUsers,
  getAllApps,
  getUserApp,
  getUserApps,
  selectApp,
  getAllAppsForCheck,
  addApp,
  db,
  getSharedTokens,
  shareApp,
  unshareApp,
  getSpreadsheetID,
  getUserSpreadsheetID,
  getAppByID,
  getSpreadsheetsWithApp,
  getAllUsersOfApp,
  changeIsWork,
  getIsWork
}
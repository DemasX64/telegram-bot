const db = require('../database');
const {checkApp} = require('../AppChecker/checkApp');

function startCheck() {
  db.getAllAppsForCheck().then(
    (apps) => {
      for (let i = 0; i < apps.length; i++) {
        setTimeout(checkApp, 4000 * i, apps[i]);
      }
    },
    () => {
      console.log('Приложения не найдены')
    }
  )
}

module.exports = {startCheck}
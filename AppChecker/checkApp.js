const axios = require('axios');
const {parseApp} = require('../AppChecker/parseApp');
const { updateApp } = require('./updateApp');

function getURL(bundle) {
  return `https://play.google.com/store/apps/details?id=${bundle}`;
}

function checkApp(app) {
  axios
    .get(getURL(app.Bundle), {
      validateStatus(status) {
        return status < 500;
      },
    })
    .then((res) => {
      if (res.status === 200) {
        parseApp(res.data, app);
      }
      if (res.status === 404) {
        updateApp(0, app);
      }
    })
    .catch((error) => {
      console.log(error)
    });
}

module.exports = { checkApp }
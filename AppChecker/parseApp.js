const cheerio = require('cheerio');
const {updateApp} = require('../AppChecker/updateApp');

const descriptionSelector = '.bARER';
const installsSelector = '.ClM7O';
const ratingSelector = 'div[itemprop="starRating"]';
const lastUpdateSelector = '.xg1aie';

function parseApp(data, app) {
  const $ = cheerio.load(data);
  let info = {}
  info.description = $(descriptionSelector).text();
  info.installs = $(installsSelector).text();
  info.rating = $(ratingSelector).text();
  if (info.installs) {
    info.installs = info.installs.replace(info.rating, '');
  }
  if (info.rating) {
    info.rating = info.rating.replace('star', '');
  }
  updateApp(1, app, info);
}

module.exports = {parseApp}
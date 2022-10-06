const puppeteer = require('puppeteer');
const config = require('../config.json');

const email = config.email;
const pass = config.password;

async function loginFacebook(browser) {
  console.log('login fb');
  const page = await browser.newPage();
  await page.goto('https://www.facebook.com/login');
  await page.type('[name="email"]', email);
  await page.type('[name="pass"]', pass);
  const loginElement = await page.$('[name="login"]');
  await loginElement.click();
  console.log('succeed fb login');
}
module.exports = {loginFacebook}
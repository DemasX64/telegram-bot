async function getAdAcconts(FacebookID,browser) {
  const page = await browser.newPage();
  return await page.goto('https://developers.facebook.com/apps/' + FacebookID + '/settings/advanced/', { waitUntil: 'networkidle2' }).then(async () => {
    const elements = await page.$$("[name='advertiser_account_ids[]']");
    const list = [];
    for (const x of elements) {
      const value = await x.getProperty('value');
      list.push(await value.jsonValue());
    }
    await page.close();
    return list;
  }).catch(async (res) => {
    console.log('fails', res);
    await page.close();
    return [];
  });
}

module.exports = {getAdAcconts}
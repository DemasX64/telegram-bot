async function addAdAccounts(FacebookID, accounts,browser) {
  const page = await browser.newPage();
  return await page.goto('https://developers.facebook.com/apps/' + FacebookID + '/settings/advanced/', { waitUntil: 'networkidle2' }).then(async () => {
    await page.evaluate(async (accounts, FacebookID) => {
      var xhr = new XMLHttpRequest();
      var fb_dtsg = document.getElementsByName('fb_dtsg')[0].getAttribute('value');
      var settedAccounts = document.getElementsByName('advertiser_account_ids[]');
      for (const x of settedAccounts) { accounts.push(x.getAttribute('value')); }
      var body = 'fb_dtsg=' + fb_dtsg;
      for (let i = 0;i < accounts.length;i++) { body += `&advertiser_account_ids[${i}]=${accounts[i]}`; }
      console.log(body);
      xhr.open('POST', `https://developers.facebook.com/x/apps/${FacebookID}/settings/advanced/save/`, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.send(body);
    }, accounts, FacebookID);
    // if(list.length+accounts.length>99)
    //   return "Количество рекламных аккаунтов в приложении превышает лимит"
    // else
    await page.close();
    return 'Добавлено';
  }).catch(async (res) => {
    console.log('fails', res);
    await page.close();
    return 'Неизвестная ошибка';
  });
}
module.exports = {addAdAccounts}
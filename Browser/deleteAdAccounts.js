async function deleteAdAccounts(FacebookID, accounts,browser) {
  const page = await browser.newPage();
  return await page.goto('https://developers.facebook.com/apps/' + FacebookID + '/settings/advanced/', { waitUntil: 'networkidle2' }).then(async () => {
    await page.evaluate(async (accounts, FacebookID) => {
      const xhr = new XMLHttpRequest();
      const fb_dtsg = document.getElementsByName('fb_dtsg')[0].getAttribute('value');
      const settedAccountsElements = document.getElementsByName('advertiser_account_ids[]');
      const settedAccounts = [];
      console.log(settedAccountsElements);
      for (let y = 0;y < settedAccountsElements.length; y++) {
        console.log('index' + y);
        console.log('get attr' + settedAccountsElements[y].getAttribute('value'));
        settedAccounts.push(settedAccountsElements[y].getAttribute('value'));
      }
      console.log(settedAccounts);
      for (const x in accounts) {
 if (settedAccounts.includes(accounts[x]))
          settedAccounts.splice(settedAccounts.indexOf(accounts[x]), 1); 
}
      console.log(settedAccounts);
      console.log(accounts);
      let body = 'fb_dtsg=' + fb_dtsg;
      for (let i = 0;i < settedAccounts.length;i++) { body += `&advertiser_account_ids[${i}]=${settedAccounts[i]}`; }
      console.log(body);
      xhr.open('POST', `https://developers.facebook.com/x/apps/${FacebookID}/settings/advanced/save/`, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.send(body);
    }, accounts, FacebookID);
    // if(list.length+accounts.length>99)
    //   return "Количество рекламных аккаунтов в приложении превышает лимит"
    // else
    await page.close();
    return 'Удалено';
  }).catch(async (res) => {
    console.log('fails', res);
    await page.close();
    return 'Неизвестная ошибка';
  });
}
module.exports = {deleteAdAccounts}
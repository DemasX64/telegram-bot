function getStatus(app) {
  switch(app.IsAlive){
    case 0:
      return '🅱️';
    case 1:
      if (app.IsWork == "1") {
        return '✅';
      } else {
        return '⛔️';
      }
      //return '🟢';
    default:
      return '⚫';
  }
}

module.exports = { getStatus }
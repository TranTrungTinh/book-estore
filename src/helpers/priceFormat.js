const wNumb = require('wnumb');
const discount = 30;

function priceFormat(price) {
  const moneyFormated = wNumb({ thousand: ',' });
  return moneyFormated.to(price);
}

function priceDiscount(price) {
  const money = +price + +price * (discount / 100);
  return priceFormat(money);
}
module.exports = { priceFormat, priceDiscount, discount };
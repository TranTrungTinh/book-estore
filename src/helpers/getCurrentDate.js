function getCurrentDate() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;

  if(day < 10) day = `0${date.getDate()}`;
  if(month < 10) month = `0${date.getMonth() + 1}`;
  
  return `${date.getFullYear()}-${month}-${day}`;
}

function showStatus(state) {
  if(state == 3) return 'Giao hàng thành công';
  if(state == 2) return 'Đang giao hàng';
  return 'Chưa giao';
}

module.exports = { getCurrentDate, showStatus };
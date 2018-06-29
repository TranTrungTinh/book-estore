function getCurrentDate() {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const hour = date.getHours();
  let minute = date.getMinutes();

  if(day < 10) day = `0${date.getDate()}`;
  if(minute < 10) minute = `0${date.getMinutes()}`;
  if(month < 10) month = `0${date.getMonth() + 1}`;
  

  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
}

function showStatus(state) {
  if(state == 3) return 'Đã giao hàng';
  if(state == 2) return 'Đang giao hàng';
  return 'Chưa giao';
}

function splitAddress(address) {
  if(!address) return [];
  return address.split('/');
}


module.exports = { getCurrentDate, showStatus, splitAddress };


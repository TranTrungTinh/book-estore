// setObject LocalStorage
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}

// 
$('#menu-list').on('click', '.list-group-item' , e => {
  const title = e.currentTarget.firstElementChild.firstChild.nodeValue;

  if (localStorage.getItem('titleList')) 
    localStorage.removeItem('titleList');
  localStorage.setItem('titleList', title);

});

$('#main-content').on('click', '.thumbnail > img', e => {
  
  // const _this = e.currentTarget
  // const image = _this.children[0].attributes[0].nodeValue;
  // const title = _this.children[1].children[0].innerText;
  // const price = _this.children[1].children[1].firstElementChild.innerText;
  // const sales = _this.children[1].children[2].firstElementChild.innerText;
  // const book = { title, image, price, sales };

  // if (localStorage.getItem('book')) 
  //   localStorage.removeItem('book');
  // localStorage.setObject('book', book);
  window.location.href = 'http://localhost:3000/book';
});

// Shopping cart button
$(document).on('click', '#btn-shopping-cart' , e => {
  window.location.href = 'http://localhost:3000/shopping-cart';
});
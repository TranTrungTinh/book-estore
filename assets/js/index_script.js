// setObject LocalStorage
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}


// First run
$( () => {
  // $('#home-page').show();
  $('#detail-page').hide();
  $('.navbar').load('assets/html/navigation.html');
  $('#menu-list').load('assets/html/menu.list.html');
  $('#main-content').load('assets/html/home.html');
});

// Main logo click
$(document).on('click', '.navbar-brand' , e => {
  $('#home-page').show();
  $('#detail-page').hide();
  // $('#main-content').html('');
  $('#main-content').load('assets/html/home.html');
});

// Hien thi danh sach san pham
$('#menu-list').on('click', '.list-group-item' , e => {
  // e.preventDefault();
  const title = e.currentTarget.firstElementChild.firstChild.nodeValue;

  if (localStorage.getItem('titleList')) 
    localStorage.removeItem('titleList');
  localStorage.setItem('titleList', title);

  $('#main-content').html('');
  $('#main-content').load('assets/html/item.list.html');
  // location.replace('/books/' + title);
});

// Hien thi chi tiet san pham
$('#main-content').on('click', '.thumbnail', e => {
  $('#home-page').hide();
  $('#detail-page').html('');
  $('#detail-page').show();
  $('#detail-page').load('assets/html/item.detail.html');

  const _this = e.currentTarget
  const image = _this.children[0].attributes[0].nodeValue;
  const title = _this.children[1].children[0].innerText;
  const price = _this.children[1].children[1].firstElementChild.innerText;
  const sales = _this.children[1].children[2].firstElementChild.innerText;
  const book = { title, image, price, sales };

  if (localStorage.getItem('book')) 
    localStorage.removeItem('book');
  localStorage.setObject('book', book);
  // console.log(book);
  // console.log(e);
  // window.location.href = 'https://www.google.com';
});
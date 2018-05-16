// setObject LocalStorage
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

// First run
$( () => {
  $('#home-page').show();
  $('#detail-page').hide();
  $('#item-cart-page').hide();
  $('#acount-page').hide();

  $('.navbar').load('assets/html/navigation.html');
  $('#menu-list').load('assets/html/menu.list.html');
  $('#main-content').load('assets/html/home.html');
  $('#detail-page').load('assets/html/item.detail.html');  
  $('#item-cart-page').load('assets/html/item.cart.html');
  $('#acount-page').load('assets/html/account.html');
});

// Main logo click
$(document).on('click', '.navbar-brand' , e => {
  $('#home-page').show();
  $('#detail-page').hide();
  $('#item-cart-page').hide();
  $('#acount-page').hide();

  $('#main-content').load('assets/html/home.html');
});

// hanlde search button
$(document).on('click', '#btnSearch' , e => {
  $('#home-page').show();
  $('#detail-page').hide();
  $('#item-cart-page').hide();
  $('#acount-page').hide();

  const keyWord = $('#txtSearch').val() || '';
  if(!keyWord) return swal("Có lỗi xảy ra!", "Vui lòng nhập từ khoá", "error");

  if (localStorage.getItem('keyWord')) 
    localStorage.removeItem('keyWord');
  localStorage.setItem('keyWord', keyWord);
  $('#txtSearch').val('')
  $('#main-content').load('assets/html/item.search.html');
});
// hanlde search enter key
$(document).on('keypress', '#txtSearch', e => {
  if(e.keyCode == 13) {
    e.preventDefault();
    $('#home-page').show();
    $('#detail-page').hide();
    $('#item-cart-page').hide();
    $('#acount-page').hide();

    const keyWord = $('#txtSearch').val() || '';
    if(!keyWord) return;

    if (localStorage.getItem('keyWord')) 
      localStorage.removeItem('keyWord');
    localStorage.setItem('keyWord', keyWord);
    
    $('#txtSearch').val('')
    $('#main-content').load('assets/html/item.search.html');
  }
});

// Hien thi danh sach san pham
$('#menu-list').on('click', '.list-group-item' , e => {
  // e.preventDefault();
  const title = e.currentTarget.firstElementChild.firstChild.nodeValue;

  if (localStorage.getItem('titleList')) 
    localStorage.removeItem('titleList');
  localStorage.setItem('titleList', title);

  $('#main-content').load('assets/html/item.list.html');
});

// Hien thi chi tiet san pham
$('#main-content').on('click', '.thumbnail', e => {
  $('#home-page').hide();
  $('#item-cart-page').hide();
  $('#acount-page').hide();

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

$('#main-content').on('click', '.btn-danger', e => {
  e.preventDefault();
  alert('abc');
});

// handle btn shopping cart
$(document).on('click', '#btn-shopping-cart' , e => {
  $('#home-page').hide();
  $('#detail-page').hide();
  $('#acount-page').hide();

  $('#item-cart-page').show();
  
});

// handle sign in
$('#btn-signin').click(e => {
  $('#home-page').hide();
  $('#detail-page').hide();
  $('#item-cart-page').hide();

  $('.close').trigger('click');

  $('#acount-page').show();
  $('.acount-history-panel').hide();
  // $('#acount-page').load('assets/html/account.html');
});



// handle acount
$('#acount-page').on('click', '#acount-info', e => {
  const isActive = $('#acount-info').hasClass('active');
  if(isActive) return;
  $('#acount-history').removeClass('active');
  $('#acount-info').addClass('active');
  $('.acount-info-panel').show()
  $('.acount-history-panel').hide()
});
$('#acount-page').on('click', '#acount-history', e => {
  const isActive = $('#acount-history').hasClass('active');
  if(isActive) return;
  $('#acount-info').removeClass('active');
  $('#acount-history').addClass('active');
  $('.acount-history-panel').show()
  $('.acount-info-panel').hide()
});
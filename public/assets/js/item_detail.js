// setObject LocalStorage
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}

function getData() {
  const defaultObj = {
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    price: '59.000 ₫',
    image: './assets/media/images/book01.jpg',
    sales: '1000'
  };

  if (!localStorage.getItem('book')) return defaultObj;
  return localStorage.getObject('book');
}

$( () => {
  const book = getData();
  const {title, image, price, sales} = book;
  $('.item_detail_header > .col-sm-12 > p').html(title);
  $('.item_price').html(price);
  $('.item_detail_img').attr('src', image);
  $('.item_sale').html(sales);
});

$('#detail-page').on('click', '.thumbnail', e => {
  const _this = e.currentTarget
  const image = _this.children[0].attributes[0].nodeValue;
  const title = _this.children[1].children[0].innerText;
  const price = _this.children[1].children[1].firstElementChild.innerText;
  const sales = _this.children[1].children[2].firstElementChild.innerText;
  const book = { title, image, price, sales };

  if (localStorage.getItem('book')) 
    localStorage.removeItem('book');
  localStorage.setObject('book', book);

  $('#detail-page').load('assets/html/item.detail.html');
  
});

$('#btnSub').click(e => {
  e.preventDefault();
  let count = $('#txtTotal').val();
  if(+count > 1) 
    $('#txtTotal').val(+(--count));
});
$('#btnAdd').click(e => {
  e.preventDefault();
  let count = $('#txtTotal').val();
  $('#txtTotal').val(+(++count));
});
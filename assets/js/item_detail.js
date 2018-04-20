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
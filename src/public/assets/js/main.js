/* ============ Function ============*/
// setObject LocalStorage
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}
function localSaveObject(key, obj) {
  if (localStorage.getItem(key)) 
    localStorage.removeItem(key);
  localStorage.setObject(key, obj);
}

function localSaveItem(key, value) {
  if (localStorage.getItem(key)) 
    localStorage.removeItem(key);
  localStorage.setItem(key, value);
}
/* ============ Function ============*/



/* ============ Handle left menu click ============*/
$('#menu-list').on('click', '.list-group-item' , e => {
  const title = e.currentTarget.firstElementChild.firstChild.nodeValue;
  localSaveItem('titleList', title);
});
/* ============ Handle left menu click ============*/



/* ============ Toggle Menu Tab ============*/
$('#collapseListGroupHeadingVN').click(() => {
  $('#collapseListGroupVN').collapse('toggle');
});
$('#collapseListGroupHeadingNXB').click(() => {
  $('#collapseListGroupNXB').collapse('toggle');
});
$('#collapseListGroupHeadingTG').click(() => {
  $('#collapseListGroupTG').collapse('toggle');
});
/* ============ Toggle Menu Tab ============*/



/* ============ Filter book with price in [10.000 ; 20.000]============*/
$('#btnFilter').click(e => {
  const start = $('#price-start').val();
  const end = $('#price-end').val();
  if(+start >= +end) return swal(
    'KHÔNG THỂ LỌC',
    'Vui lòng chọn lại mức giá',
    'warning'
  );
  const title = `Kết quả tìm kiếm cho giá từ '${start} đến ${end}' VND:`;
  localSaveItem('titleList', title);
  location.href = `/book/price/filter?start=${start}&end=${end}&page=1`;
});
/* ============ Filter book with price in [10.000 ; 20.000]============*/



/* ============ Filter book with name search ============*/
// by Enter
$(document).on('keypress', '#txtSearch', e => {
  if(e.keyCode == 13) {
    e.preventDefault();
    const keyWord = $('#txtSearch').val() || '';
    if(!keyWord) return;
    const title = `Kết quả tìm kiếm cho '${keyWord}':`;
    localSaveItem('titleList', title);
    location.href = `/book/name/filter?search=${keyWord}&page=1`;
  }
});

// by btnSearch
$('#btnSearch').click(e => {
  const keyWord = $('#txtSearch').val() || '';
  if(!keyWord) return swal("Có lỗi xảy ra!", "Vui lòng nhập từ khoá", "error");
  const title = `Kết quả tìm kiếm cho '${keyWord}':`;
  localSaveItem('titleList', title);
  location.href = `/book/name/filter?search=${keyWord}&page=1`;
});
/* ============ Filter book with name search ============*/



/* ============ Views book detail ============*/
$('#main-content').on('click', '.thumbnail', e => {
  const _this = e.target.nodeName;
  const idBook = e.currentTarget.lastElementChild.defaultValue;
  const title = e.currentTarget.children[2].children[0].innerText;
  
  if(_this !== 'SPAN' && _this !== 'BUTTON') return location.href = '/book/' + idBook;

  const count = localStorage.getItem('count') || '';
  if(!count) return swal("CẢNH BÁO","Bạn phải đăng nhập trước khi mua hàng","warning")
  .then(() => $('#myModelLogin').modal('show'));

  $.post('/shopping-cart/cart', { idBook }, data => {
    if(!data.success) return swal("OH OH",`Đã có "${title}" trong giỏ hàng`,"warning");;
    swal("XONG",`Đã thêm "${title}" vào giỏ hàng`,"success")
    .then(() => {
      localSaveItem('count', data.count);
      location.reload();
    });
  });
  
});
/* ============ Views book detail ============*/



/* ============ Detail page ============*/
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

$('#addItem-btn').click(e => {
  const count = localStorage.getItem('count') || '';
  if(!count) return swal("CẢNH BÁO","Bạn phải đăng nhập trước khi mua hàng","warning")
  .then(() => $('#myModelLogin').modal('show'));
  const pathname = location.pathname.toString();
  const flateIndex = pathname.lastIndexOf('/');
  const idBook = pathname.substring(flateIndex + 1);
  const amount = $('#txtTotal').val();
  $.post('/shopping-cart/cart', { idBook, amount }, data => {
    if(!data.success) return swal("OH OH",`Sách đã có trong giỏ hàng`,"warning");;
    swal("XONG",`Đã thêm sách vào giỏ hàng`,"success")
    .then(() => {
      localSaveItem('count', data.count);
      location.reload();
    });
  });
});
/* ============ Detail page ============*/




/* ============ Shopping cart ============*/
$(document).on('click', '#btn-shopping-cart' , e => {
  const count = localStorage.getItem('count') || '';
  if(!count) return swal("CẢNH BÁO","Bạn phải đăng nhập trước khi mua hàng","warning")
  .then(() => $('#myModelLogin').modal('show'));

  location.href = '/shopping-cart';
});

$('.item-cart-total').on('click', 'span:first-child > button', e => {
  // Handle button descrease
  const _this = e.delegateTarget.children["0"];
  let amount = _this.children[1].defaultValue;
  const idBook = _this.children[2].defaultValue;

  if(+amount <= 1) return;
  amount = +amount - 1;
  $.post('/shopping-cart/update', { idBook, amount }, data => {
    if(!data.success) return;
    setTimeout( () => location.reload(), 500);
    // location.reload();
  });
});

$('.item-cart-total').on('click', 'span:last-child > button', e => {
  // Handle button increase
  const _this = e.delegateTarget.children["0"];
  let amount = _this.children[1].defaultValue;
  const idBook = _this.children[2].defaultValue;

  amount = +amount + 1;
  $.post('/shopping-cart/update', { idBook, amount }, data => {
    if(!data.success) return;
    setTimeout( () => location.reload(), 500);    
    // location.reload();
  });
});

$('.item-cart-total').on('keypress', '.item-value', e => {
  if(e.keyCode == 13) {
    const _this = e.delegateTarget.children["0"];
    const idBook = _this.children[2].defaultValue;
    const amount = e.target.value;
    if(amount < 1) return location.reload();
    $.post('/shopping-cart/update', { idBook, amount }, data => {
      if(!data.success) return;
      setTimeout( () => location.reload(), 500);
    });
  }
});

$('.item-cart-author').on('click', 'a', e => {
  // Handle delete item in cart
  e.preventDefault();
  const idBook = e.currentTarget.attributes[1].value;
  $.post('/shopping-cart/delete', { idBook }, data => {
    if(!data.success) return;
    localSaveItem('count', data.count);
    setTimeout( () => location.reload(), 500);
  });
});

$('#orderCartBtn').click(e => {

  const total = $('#totalPrice').text() || '';
  if(!total) return;

  $('#orderCartBtn').html('<p class="small-loader"></p>');
  setTimeout(() => swal({
    title: "XÁC NHẬN !!!",
    text: "Bạn chắc chắn đặt hàng",
    icon: "info",
    buttons: true,
    dangerMode: true,
  }).then(yes => { 
    if(!yes) return $('#orderCartBtn').html('Tiến hành đặt hàng');
    $.post('/shopping-cart/order', { total }, data => {
      if(!data.success) return console.log(data);
      localSaveItem('count', '0');
      swal("THÀNH CÔNG","Đơn hàng của bạn đã được ghi nhận !!!","success")
      .then(() => location.href = '/user/account/orders');
    });
  }), 1500);
});
/* ============ Shopping cart ============*/



/* ============ Account Icon Click ============*/
$('#btn-account').click(e => {
  const currentPage = location.pathname.toString();
  if(currentPage === '/user/account/edit') return;
  const name = localStorage.getItem('name') || ''
  if (!name) return $('#myModelLogin').modal('show');
  $('#toggle-account').text(name);
  location.href = '/user/account/edit';
});
/* ============ Account Icon Click ============*/



/* ============ Handle Login - Logout ============*/
$('#btn-signin').click(e => {
  e.preventDefault();
  const email = $('#inputEmailLogin').val() || '';
  const password = $('#inputPasswordLogin').val() || '';

  if(!email || !password) return swal("CẢNH BÁO","Vui lòng nhập đầy đủ thông tin","warning");
  
  $.post('/user/signin', {email, password}, data => {
    if(!data.success) return swal("CÓ LỖI!", "Sai email hoặc password !!!", "error");
    $('#sign-in-loader').html('<div class="loader"></div>');
    setTimeout(() => {
      localSaveItem('name', data.user.NAME);
      localSaveItem('count', data.user.COUNT);
      if(data.user.ADDRESS) localSaveItem('address', data.user.ADDRESS);
      location.href = '/user/account/edit';
    }, 1500);
  });
});
$('#btn-logout').click(e => {
  e.preventDefault();
  const name = localStorage.getItem('name') || '';
  if(!name) return;
  swal({
    title: "Đăng xuất?",
    text: "Đăng xuất khỏi tài khoản " + name,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then(yes => { if(!yes) return;
    $.post('/user/logout', data => {});
    localStorage.removeItem('name');
    localStorage.removeItem('count');
    localStorage.removeItem('address');
    location.href = '/home';
  });
});

$('#btn-signup').click(e => {
  e.preventDefault();
  const name = $('#inputNameRegister').val() || '';
  const email = $('#inputEmailRegister').val() || '';
  const password = $('#inputPasswordRegister').val() || '';
  const gender = $('input[id=genderMale]:checked').val() ? 'NAM' : 'NU';
  const captcha = $('#g-recaptcha-response').val() || '';
  const isGmail = email.endsWith('@gmail.com');

  if(!name || !email || !password) return swal("CẢNH BÁO","Vui lòng nhập đầy đủ thông tin","warning");
  if(!isGmail) return swal("THÔNG BÁO","Email phải là gmail","info");
  if(!captcha) return swal("THÔNG BÁO","Vui lòng check captcha","info");


  $('#sign-up-loader').html('<div class="loader"></div>');

  const userInfo = {name, email, password, gender, captcha };
  $.post('/user/signup', userInfo, data => {
    const {success, message} = data;
    if(message === 'EMAIL_EXISTED') return swal("LỖI","Email đã có người đăng ký !!!","error")
    .then(() => setTimeout(() => location.href = '/home'), 1500);
    if(message === 'INVALID_CAPTCHA') return swal("LỖI","Sai mã captcha !!!","error")
    .then(() => setTimeout(() => location.href = '/home'), 1500);    
    if(success) return swal("THÀNH CÔNG","Đăng ký thành công !!!","success")
    .then(() => setTimeout(() => location.href = '/home'), 2500);
  });
});
/* ============ Handle Login - Logout ============*/




/* ============ Account page ============*/
$('#acount-info').click(e => {
  const isActive = $('#acount-info').hasClass('active');
  if(isActive) return;
  $('#acount-history').removeClass('active');
  $('#acount-address').removeClass('active');
  $('#acount-info').addClass('active');
  location.href = '/user/account/edit';
});
$('#acount-history').click(e => {
  const isActive = $('#acount-history').hasClass('active');
  if(isActive) return;
  $('#acount-info').removeClass('active');
  $('#acount-address').removeClass('active');
  $('#acount-history').addClass('active');
  location.href = '/user/account/orders';  
});
$('#acount-address').click(e => {
  const isActive = $('#acount-address').hasClass('active');
  if(isActive) return;
  $('#acount-info').removeClass('active');
  $('#acount-history').removeClass('active');
  $('#acount-address').addClass('active');
  location.href = '/user/account/address';  
});


$('#btn-update').click(e => {
  e.preventDefault();
  const name = $('#inputAcountName').val() || '';
  const phone = $('#inputAcountPhone').val() || '';
  const gender = $('input[id=genderFemale]:checked').val() ? 'NU' : 'NAM';
  const birthday = $('#birthday').val();
  const userInfo = { name, phone, gender, birthday };

  $('#update-loader').html('<div class="loader"></div>');
  $.post('/user/account/update', userInfo, data => {
    if(!data.success) return; 
    setTimeout(() => {
      localSaveItem('name', data.name);
      location.href = '/user/account/edit'
    }, 1500);
  });
});

$('#div-address-add').click(e => {
  e.preventDefault();
  $('#div-address-add').slideUp();
  $('#div-address-form').slideDown();
});
$('#div-address-info').click(e => {
  e.preventDefault();
  $('#div-address-info').slideUp();
  $('#div-address-form').slideDown();
});
$('#btn-address-cancel').click(e => {
  e.preventDefault();
  const check = localStorage.getItem('address') ? true : false;
  $('#div-address-form').slideUp();
  if(check) $('#div-address-info').slideDown();
  else $('#div-address-add').slideDown();
});


$('#btn-address-update').click(e => {
  e.preventDefault();
  const city = $('#inputAcountCity').val() || '';
  const district = $('#inputAcountDistrict').val() || '';
  const village = $('#inputAcountVillage').val() || '';
  const home = $('#inputAcountHome').val() || '';
  if(!city || !district || !village || !home) return swal("CẢNH BÁO","Vui lòng nhập đầy đủ thông tin","warning");
  $('#update-address-loader').html('<div class="loader"></div>');
  const address = `${home}/${village}/${district}/${city}`;
  $.post('/user/account/address', {address}, data => {
    if(data.address) localSaveItem('address', data.address);
    setTimeout(() => location.reload(), 1500);
  });

});

/* ============ Account page ============*/

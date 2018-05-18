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
  if(_this === 'SPAN' || _this === 'BUTTON') { return; }
  const idBook = e.currentTarget.lastElementChild.defaultValue;
  location.href = '/book/' + idBook;
});
/* ============ Views book detail ============*/



/* ============ Shopping cart ============*/
$(document).on('click', '#btn-shopping-cart' , e => {
  location.href = '/shopping-cart';
});
/* ============ Shopping cart ============*/



/* ============ Account Icon Click ============*/
$('#btn-account').click(e => {
  // const check = localStorage.getItem('name') || ''
  // if (!check) return $('#myModelLogin').modal('show');
  // const user = localStorage.getObject('account');
  // $('#toggle-account').text(user.name);
  // location.href = '/home';
  $('#myModelLogin').modal('show');
});
/* ============ Account Icon Click ============*/



/* ============ Handle Login - Logout ============*/
$('#btn-signin').click(e => {
  e.preventDefault();
  const email = $('#inputEmailLogin').val() || '';
  const password = $('#inputPasswordLogin').val() || '';

  if(!email || !password) return swal("CẢNH BÁO","Vui lòng nhập đầy đủ thông tin","warning");

  $.post('/user/signin', {email, password}, data => {
    if(!data.success) return swal("CÓ LỖI!", "Sai email hoặc password", "error");
    localSaveItem('name', data.user.NAME);
    localSaveObject('account', data.user);
    location.href = '/home';
  });
});
$('#btn-logout').click(e => {
  e.preventDefault();
  const name = localStorage.getItem('account') || '';
  if(!name) return;
  swal({
    title: "Đăng xuất?",
    text: "Đăng xuất khỏi tài khoản " + name,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then(yes => {
    if(yes) {
      localStorage.removeItem('account');
      location.href = '/home'
    }
  });
});

$('#btn-signup').click(e => {
  e.preventDefault();
  const name = $('#inputNameRegister').val() || '';
  const email = $('#inputEmailRegister').val() || '';
  const password = $('#inputPasswordRegister').val() || '';
  const gender = $('input[id=genderMale]:checked').val() ? 'NAM' : 'NU';
  const captcha = $('#g-recaptcha-response').val() || '';

  if(!name || !email || !password) return swal("CẢNH BÁO","Vui lòng nhập đầy đủ thông tin","warning");
  if(!captcha) return swal("THÔNG BÁO","Vui lòng check captcha","info");

  const userInfo = {name, email, password, gender, captcha };
  $.post('/user/signup', userInfo, data => {
    const {success, message} = data;
    if(message === 'EMAIL_EXISTED') return swal("LỖI","Email đã có người đăng ký !!!","error");
    if(message === 'INVALID_CAPTCHA') return swal("LỖI","Sai mã captcha !!!","error");
    if(success) return swal("SUCCESS","Đăng ký thành công !!!","success")
    .then(() => location.href = '/home');
  });

});
/* ============ Handle Login - Logout ============*/

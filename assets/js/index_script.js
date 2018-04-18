
$('.list-group-item').click(e => {
  $('#main-content').html('');
  $('#main-content').load('assets/html/item.list.html');
});
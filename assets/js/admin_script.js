function changeOrderRowStatus(row) {
    let tr = row.closest('tr')
    switch (parseInt(row.value)) {
        case 1:
            tr.className = 'warning';
            break;
        case 2:
            tr.className = 'active';
            break;
        case 3:
            tr.className = 'success';
            break;
        default: // 0
            tr.className = 'danger';
            break;
    }
}

window.onload = () => {
    // dashboard as default
    $('#Navigator > .nav > li > a:first').trigger('click');
    // set color for order rows based on its status
    let rows = $('#Orders > table select');
    if (rows) {
        $.each(rows, (index, el) => {
            changeOrderRowStatus(el);
        });
    }
}

$('#Navigator > .nav > li').click((e) => {
    // change section accordingly
    e.preventDefault();
    let sections = $('#Content > section');
    if (sections) {
        for (let i = 0; i < sections.length; i++) {
            let sectionId = sections[i].getAttribute('id');
            if (('#' + sectionId) === e.target.getAttribute('href')) {
                $('#' + sectionId).show('slide');
            } else {
                $('#' + sectionId).hide();
            }
        }
    }

    return false;
});

// change order row color when its status changed
$('#Orders > table select').change((e) => {
    e.preventDefault();
    changeOrderRowStatus(e.target);
});

// toggle collapsing an order row for info details & updating
var prevSelectedRow;
$('#Products > table > tbody > tr').click((e) => {
    e.preventDefault();
    let tr = e.target.closest('tr');
    // copy current selected row info into modal
    let modal = $('.modal')[0];
    // product image
    let img = tr.getElementsByTagName('img')[0];
    modal.getElementsByTagName('img')[0].src = img.src;
    // product price, amount, author, type, publisher
    let input = modal.getElementsByTagName('input');
    let td = tr.getElementsByTagName('td');
    for (let i = 1; i < input.length; i++) {
        input[i].value = td[i].innerHTML;
    }
    // product description
    modal.getElementsByTagName('textarea')[0].innerHTML = td[2].innerHTML;
});
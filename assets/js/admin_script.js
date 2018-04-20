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
    if (tr && tr !== prevSelectedRow) {
        tr.classList.toggle('product-detail');
        let textarea = tr.getElementsByTagName('textarea');
        $.each(textarea, (index, el) => {
            el.classList.toggle('textarea-detail');
        });
    }
    // collapse all other rows by remove their 'detail' class
    if (prevSelectedRow && prevSelectedRow != tr) {
        prevSelectedRow.className = '';
        prevSelectedRow.getElementsByTagName('textarea')[0].className = '';
        let textarea = prevSelectedRow.getElementsByTagName('textarea');
        $.each(textarea, (index, el) => {
            el.className = '';
        });
    }
    prevSelectedRow = tr;
});
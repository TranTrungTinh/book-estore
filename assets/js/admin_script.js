function changeOrderRowStatus(row) {
    switch (parseInt(row.value)) {
            case 1:
                row.closest('tr').className = 'warning';
                break;
            case 2:
                row.closest('tr').className = 'active';
                break;
            case 3:
                row.closest('tr').className = 'success';
                break;
            default: // 0
                row.closest('tr').className = 'danger';
                break;
        }
}

window.onload = () => {
    // dashboard as default
    $('#Navigator > .nav > li > a').trigger('click');
    // set color for orders
    let rows = $('#Orders > table select');
    $.each(rows, function(index, el) {
        changeOrderRowStatus(el);
    });
}

$('#Navigator > .nav > li').on('click', () => {
    if (event.target.tagName === 'A') {
        // change section accordingly
        let sections = $('#Content > section');
        for (let i = 0; i < sections.length; i++) {
            if (('#' + sections[i].getAttribute('id')) === event.target.getAttribute('href')) {
                sections[i].style.display = 'block';
            } else {
                sections[i].style.display = 'none';
            }
        }
    }

    return false;
});

$('#Orders > table select').on('change', () => {
    changeOrderRowStatus(event.target);
});
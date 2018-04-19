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
    $('#Navigator > .nav > li > a').trigger('click');
    // set color for orders
    let rows = $('#Orders > table select');
    $.each(rows, function(index, el) {
        changeOrderRowStatus(el);
    });
}

$('#Navigator > .nav > li').click((e) => {
        // change section accordingly
        e.preventDefault();
        let sections = $('#Content > section');
        for (let i = 0; i < sections.length; i++) {
            if (('#' + sections[i].getAttribute('id')) === e.target.getAttribute('href')) {
                sections[i].style.display = 'block';
            } else {
                sections[i].style.display = 'none';
            }
        }

        return false;
});

$('#Orders > table select').change((e) => {
    e.preventDefault();
    changeOrderRowStatus(e.target);
});
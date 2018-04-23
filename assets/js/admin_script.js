function changeOrderRowStatus(sel) {
    let tr = sel.closest('tr');
    switch (sel.value) {
        case 'pending':
            tr.className = 'warning';
            break;
        case 'delivering':
            tr.className = 'active';
            break;
        case 'done':
            tr.className = 'success';
            break;
        case 'cancel':
            tr.className = 'danger';
        default:
            break;
    }
}

function changeAllOrdersStatus() {
    let sel = $('#Orders table')[0].getElementsByTagName('select');
    for (let i = 0; i < sel.length; i++) {
        changeOrderRowStatus(sel[i]);
    }
}

function loadList(container, url, func) {
    container.innerHTML = '';
    container.load(url, func);
}

function loadListBySection(id) {
    switch (id) {
        case 'Products':
            loadList($('#Products tbody'), '../html/admin_products_list.html');
            break;
        case 'Orders':
            loadList($('#Orders tbody'), '../html/admin_orders_list.html', changeAllOrdersStatus);
            break;
        default:
            break;
    }
}

window.onload = () => {
    // dashboard to load as default
    $('#Navigator > .nav > li > a:first').click();
}

$('#Navigator > .nav > li').click((e) => {
    // load/reload section accordingly
    e.preventDefault();
    let sections = $('#Content section');
    for (let i = 0; i < sections.length; i++) {
        let sectionId = sections[i].getAttribute('id');
        if (('#' + sectionId) === e.target.getAttribute('href')) {
            loadListBySection(sectionId);
            $('#' + sectionId).show('slide');
        } else {
            $('#' + sectionId).hide();
        }
    }

    return false;
});

// change order row color when its status changed
$('#Orders table').change((e) => {
    e.preventDefault();
    changeOrderRowStatus(e.target);
});

var selectedItem;
$('#Products tbody').click((e) => {
    e.preventDefault();
    let tr = e.target.closest('tr');
    selectedItem = tr;
    // copy current selected row info into modal
    // product image
    $('#DetailModal img')[0].src = tr.getElementsByTagName('img')[0].src;
    // product price, amount, author, type, publisher
    let td = tr.getElementsByTagName('td');
    for (let i = 1; i < td.length - 1; i++) {
        $('#DetailModal input')[i].value = td[i].textContent;
    }
    // product description
    $('#DetailModal textarea')[0].value = td[td.length - 1].textContent;
});

// clear all field content
$('#AddNewProduct').click(() => {
    selectedItem = null;
    $('#DetailModal img')[0].src = '';
    $.each($('#DetailModal input'), (index, ele) => {
        ele.value = '';
    });
    $('#DetailModal textarea')[0].value = '';
})

// refresh button
$('.btn-refresh').click((e) => {
    e.preventDefault();
    let section = e.target.closest('section');
    loadListBySection(section.id);
    // re-filtering
    $(section)[0].getElementsByClassName('btn-search')[0].click();
    // after this all info are reset to default as they were hard-coded
})

// item filtering by categories
// Products
$('#ProductsSearch').click(() => {
    let typeOfInfoOnCol = 0;
    switch ($('#Products .form-inline select')[0].value) {
        case 'product':
            typeOfInfoOnCol = 1;
            break;
        case 'author':
            typeOfInfoOnCol = 4;
            break;
        case 'type':
            typeOfInfoOnCol = 5;
            break;
        case 'publisher':
            typeOfInfoOnCol = 6;
            break;
        default:
        typeOfInfoOnCol = 0;
            break;
    }

    let strToSearch = $('#StrToSearchProducts')[0].value;
    if(strToSearch.length < 1) return;
    $.each($('#Products tbody tr'), (index, ele) => {
        if(ele.getElementsByTagName('td')[typeOfInfoOnCol].textContent.toLowerCase()
        .indexOf(strToSearch.toLowerCase()) < 0) {
            $(ele).hide();
        }
        else {
            $(ele).hide().fadeIn('fast');
        }
    });
});
// Orders
$('#Orders .form-inline select').change(() => {
    let filterOrderStt = $('#Orders .form-inline select')[0].value;

    $.each($('#Orders tbody tr'), (index, ele) => {
        let rowOrderStt = ele.getElementsByTagName('select')[0].value;
        if(filterOrderStt !== rowOrderStt) {
            $(ele).hide();
        }
        else {
            $(ele).hide().fadeIn('fast');
        }
    });
});

$('#OrdersSearch').click(() => {
    let filterOrderStt = $('#Orders .form-inline select')[0].value,
    strToSearch = $('#StrToSearchOrders')[0].value;
    if(strToSearch.length < 1) return;
    $.each($('#Orders tbody tr'), (index, ele) => {
        let rowOrderStt = ele.getElementsByTagName('select')[0].value,
        orderCode = ele.getElementsByTagName('td')[0].textContent;
        if(orderCode.length < 1) return;
        // not found
        if(orderCode.toLowerCase()
        .indexOf(strToSearch.toLowerCase()) < 0 ||
         (filterOrderStt !== 'all' && filterOrderStt !== rowOrderStt)) {
            $(ele).hide();
        }
        // found
        else if(orderCode.toLowerCase()
        .indexOf(strToSearch.toLowerCase()) > -1 && 
        (filterOrderStt === 'all' || filterOrderStt === rowOrderStt)) {
            $(ele).hide().fadeIn('fast');
        }
    });
});

// add new product to Products list
$('#ModalSave').click(() => {
    let imgSrc,
        title = $('#DetailModal input')[1].value,
        price = $('#DetailModal input')[2].value,
        amount = $('#DetailModal input')[3].value,
        author = $('#DetailModal input')[4].value,
        type = $('#DetailModal input')[5].value,
        publisher = $('#DetailModal input')[6].value,
        description = $('#DetailModal textarea')[0].value;

    // add new product
    if(!selectedItem) {
        imgSrc = $('#DetailModal input')[0].value;
        let tr = document.createElement('tr');
        tr.innerHTML = '<tr data-toggle="modal" data-target="#DetailModal">' +
            '<td class="img-wrapper img-wrapper-sm">' +
            '<img src="' + imgSrc + '" alt="Ảnh minh họa">' +
            '</td>' +
            '<td>' + title + '</td>' +
            '<td>' + price + '</td>' +
            '<td>' + amount + '</td>' +
            '<td>' + author + '</td>' +
            '<td>' + type + '</td>' +
            '<td>' + publisher + '</td>' +
            '<td>' +
            '<div class="detail-wrapper">' +
            description +
            '</div>' +
            '</td>' +
            '</tr>';
            
        $('#Products tbody')[0].appendChild(tr);
    }
    // update product info
    else {
        imgSrc = $('#DetailModal img')[0].src || $('#DetailModal input')[0].files[0].name;
        let tds = selectedItem.getElementsByTagName('td');
        tds[0].getElementsByTagName('img')[0].src = imgSrc;
        tds[1].textContent = title;
        tds[2].textContent = price;
        tds[3].textContent = amount;
        tds[4].textContent = author;
        tds[5].textContent = type;
        tds[6].textContent = publisher;
        tds[7].getElementsByClassName('detail-wrapper')[0].innerHTML = description;
    }
});

// delete seelected Products
$('#ModalDelete').click(() => {
    if (selectedItem) {
        $('#Products tbody')[0].removeChild(selectedItem);
    }
});
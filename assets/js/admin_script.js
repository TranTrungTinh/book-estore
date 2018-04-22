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
            loadList($('#Products > table > tbody'), '../html/admin_products_list.html');
            break;
        case 'Orders':
            loadList($('#Orders > table > tbody'), '../html/admin_orders_list.html', changeAllOrdersStatus);
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
    let sections = $('#Content > section');
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
$('#Orders > table').change((e) => {
    e.preventDefault();
    changeOrderRowStatus(e.target);
});

var selectedItem;
$('#Products > table > tbody').click((e) => {
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

// Clear all field content
$('#AddNewProduct').click(() => {
    selectedItem = null;
    $('#DetailModal img')[0].src = '';
    $.each($('#DetailModal input'), (index, ele) => {
        ele.value = '';
    });
    $('#DetailModal textarea')[0].value = '';
})

// Refresh button
$('.btn-refresh').click((e) => {
    e.preventDefault();
    loadListBySection(e.target.closest('section').id);
})

// Add new product to Products list
$('#ModalSave').click(() => {
    let imgSrc,
        price = $('#DetailModal input')[1].value,
        amount = $('#DetailModal input')[2].value,
        author = $('#DetailModal input')[3].value,
        type = $('#DetailModal input')[4].value,
        publisher = $('#DetailModal input')[5].value,
        description = $('#DetailModal textarea')[0].value;

    // add new product
    if(!selectedItem) {
        imgSrc = $('#DetailModal input')[0].files[0].name
        let tr = document.createElement('tr');
        tr.innerHTML = '<tr data-toggle="modal" data-target="#DetailModal">' +
            '<td class="img-wrapper img-wrapper-sm">' +
            '<img src="' + imgSrc + '" alt="Ảnh minh họa">' +
            '</td>' +
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
            
        $('#Products > table > tbody')[0].appendChild(tr);
    }
    // update product info
    else {
        imgSrc = $('#DetailModal img')[0].src || $('#DetailModal input')[0].files[0].name;
        console.log(description);
        let tds = selectedItem.getElementsByTagName('td');
        tds[0].getElementsByTagName('img')[0].src = imgSrc;
        tds[1].textContent = price;
        tds[2].textContent = amount;
        tds[3].textContent = author;
        tds[4].textContent = type;
        tds[5].textContent = publisher;
        tds[6].getElementsByClassName('detail-wrapper')[0].innerHTML = description;
    }
});

// Delete seelected Products
$('#ModalDelete').click(() => {
    if (selectedItem) {
        $('#Products > table > tbody')[0].removeChild(selectedItem);
    }
});
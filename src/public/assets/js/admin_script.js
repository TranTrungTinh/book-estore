/*=============================== Globally used ===============================*/

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

// load section as first nav item
// window.onload = () => {
//     loadListBySection($('#Content section')[0].id);
// };

$('#Navigator > .nav > li').click((e) => {
    // load/reload section accordingly
    e.preventDefault();
    let sections = $('#Content section');
    for (let i = 0; i < sections.length; i++) {
        let sectionId = sections[i].id;
        if (('#' + sectionId) === e.target.getAttribute('href')) {
            // loadListBySection(sectionId);
            $('#' + sectionId).show('slide');
        } else {
            $('#' + sectionId).hide();
        }
    }

    return false;
});

var selectedProduct; // used to interact with product
$('#Products tbody').click((e) => {
    e.preventDefault();
    let tr = e.target.closest('tr');
    selectedProduct = tr;
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

// clear all field content whenever..
$('#AddNewProduct').click(() => {
    selectedProduct = null;
    $('#DetailModal img')[0].src = '';
    $.each($('#DetailModal input'), (index, ele) => {
        ele.value = '';
    });
    $('#DetailModal textarea')[0].value = '';
})

// refresh the entire list
$('.btn-refresh').click((e) => {
    e.preventDefault();
    let section = e.target.closest('section');
    loadListBySection(section.id);
    // re-filtering
    $(section)[0].getElementsByClassName('btn-search')[0].click();
    // after this all info are reset to default as they were hard-coded
})

/*=============================== Products ===============================*/

$('#StrToSearchProducts').keyup(() => {
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
    $.each($('#Products tbody tr'), (index, ele) => {
            if(strToSearch.length > 0 && 
            ele.getElementsByTagName('td')[typeOfInfoOnCol]
            .textContent.toLowerCase()
            .indexOf(strToSearch.toLowerCase()) < 0) {
                $(ele).hide();
            }
            else {
                $(ele).show();
            }
    });
});

// add new product to Products list
function addNewProduct(item) {
    imgSrc = $('#DetailModal input')[0].value;
        let tr = document.createElement('tr');
        tr.innerHTML = '<tr data-toggle="modal" data-target="#DetailModal">' +
            '<td class="img-wrapper img-wrapper-sm">' +
            '<img src="' + imgSrc + '" alt="Ảnh minh họa">' +
            '</td>' +
            '<td>' + item.title + '</td>' +
            '<td>' + item.price + '</td>' +
            '<td>' + item.amount + '</td>' +
            '<td>' + item.author + '</td>' +
            '<td>' + item.type + '</td>' +
            '<td>' + item.publisher + '</td>' +
            '<td>' +
            '<div class="detail-wrapper">' +
            item.description +
            '</div>' +
            '</td>' +
            '</tr>';
            
        $('#Products tbody')[0].appendChild(tr);
}

function updateProductInfo(item) {
    let tds = selectedProduct.getElementsByTagName('td');
    tds[0].getElementsByTagName('img')[0].src = imgSrc;
    tds[1].textContent = item.title;
    tds[2].textContent = item.price;
    tds[3].textContent = item.amount;
    tds[4].textContent = item.author;
    tds[5].textContent = item.type;
    tds[6].textContent = item.publisher;
    tds[7].getElementsByClassName('detail-wrapper')[0].innerHTML = item.description;
}

$('#ModalSave').click(() => {
    let item = {
        imgSrc: '',
        title: $('#DetailModal input')[1].value,
        price: $('#DetailModal input')[2].value,
        amount: $('#DetailModal input')[3].value,
        author: $('#DetailModal input')[4].value,
        type: $('#DetailModal input')[5].value,
        publisher: $('#DetailModal input')[6].value,
        description: $('#DetailModal textarea')[0].value
    }

    if(!selectedProduct) {
        addNewProduct(item);
    }
    else {
        item.imgSrc = $('#DetailModal img')[0].src || $('#DetailModal input')[0].files[0].name;
        updateProductInfo(item);
    }
});

// delete seelected Products
$('#ModalDelete').click(() => {
    if (selectedProduct) {
        $('#Products tbody')[0].removeChild(selectedProduct);
    }
});

/*=============================== Orders ===============================*/

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

function handleOrdersAppreance() {
	let filterOrderStt = $('#Orders .form-inline select')[0].value,
    strToSearch = $('#StrToSearchOrders')[0].value;
	
    $.each($('#Orders tbody tr'), (index, ele) => {
        let rowOrderStt = ele.getElementsByTagName('select')[0].value,
        orderCode = ele.getElementsByTagName('td')[0].textContent;

        if(orderCode.toLowerCase().indexOf(strToSearch.toLowerCase()) < 0 || 
            (filterOrderStt !== 'all' && filterOrderStt !== rowOrderStt)) {
                $(ele).hide();
            }
        else if(orderCode.toLowerCase().indexOf(strToSearch.toLowerCase()) > -1 && 
            (filterOrderStt === 'all' || filterOrderStt === rowOrderStt)) {
                $(ele).show();
            }
        
    });
}

// change order row color when its status changed
$('#Orders table').change((e) => {
    e.preventDefault();
    changeOrderRowStatus(e.target);
});

$('#Orders .form-inline select').change(() => {
    handleOrdersAppreance();
});
	

$('#StrToSearchOrders').keyup(() => {
	handleOrdersAppreance();
});

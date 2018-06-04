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

// load/reload section accordingly
$('#Navigator > .nav > li').click((e) => {
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

// refresh the entire list
$('.btn-refresh').click((e) => {
    e.preventDefault();
    let section = e.target.closest('section');
    loadListBySection(section.id);
    // re-filtering
    $(section)[0].getElementsByClassName('btn-search')[0].click();
    // after this all info are reset to default as they were hard-coded
});

// Authors, Categories, Publishers whose table has 2 column: id, name
function handleOthersAppreance(id) {
    let strToSearch = $(`#StrToSearch${id}`)[0].value;

    let typeOfInfoOnCol = 0;
    switch ($(`#${id} select`)[0].value) {
        case 'id':
            typeOfInfoOnCol = 0;
            break;
        case 'name':
            typeOfInfoOnCol = 1;
            break;
        default:
            typeOfInfoOnCol = null;
            break;
    }

    $.each($(`#${id} tbody tr`), (index, ele) => {
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
}

/*=============================== Products ===============================*/

$('#StrToSearchProducts').keyup(() => {
    let typeOfInfoOnCol = 0;
    switch ($('#Products select')[0].value) {
        case 'id':
            typeOfInfoOnCol = 1;
            break;
        case 'product':
            typeOfInfoOnCol = 2;
            break;
        case 'author':
            typeOfInfoOnCol = 5;
            break;
        case 'type':
            typeOfInfoOnCol = 6;
            break;
        case 'publisher':
            typeOfInfoOnCol = 7;
            break;
        default:
            typeOfInfoOnCol = null;
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

// clear searches & reset appearance
$('#Products select').change(() => {
    $('#StrToSearchProducts')[0].value = '';
    $('#Products tbody tr').each((index, ele) => {
        $(ele).show();
    });
});

var selectedProduct; // used to interact with product
$('#Products tbody').click((e) => {
    e.preventDefault();
    let tr = e.target.closest('tr');
    selectedProduct = tr;
    // copy current selected row info into modal
    // product image
    $('#Modal_Product img')[0].src = tr.getElementsByTagName('img')[0].src;
    // product price, amount, author, type, publisher
    let td = tr.getElementsByTagName('td');
    for (let i = 1; i < td.length - 1; i++) {
        if(i < 5) $('#Modal_Product input')[i].value = td[i].textContent;
        else {} // check the author id and choose the coresponding option
    }

    // product description
    //$('#Modal_Product .wysihtml5-editor')[0].innerHTML = $('p.detail-wrapper')[0].innerHTML;
    // show modal
    $('#Modal_Product').modal('show');
});

// clear all field content whenever..
$('#AddNewProduct').click(() => {
    selectedProduct = null;
    $('#Modal_Product img')[0].src = './assets/media/images/book_default.png';
    $.each($('#Modal_Product input'), (index, ele) => {
        ele.value = '';
    });
    $('#Modal_Product textarea')[0].value = '';
})

function addNewProduct(item) {}

function updateProductInfo(item) {}

$('#ModalSave_Product').click(() => {
    let item = {
        imgSrc: '',
        id: $('#Modal_Product input')[1].value,
        title: $('#Modal_Product input')[2].value,
        price: $('#Modal_Product input')[3].value,
        amount: $('#Modal_Product input')[4].value,
        author: $('#Modal_Product select')[0].value,
        type: $('#Modal_Product select')[1].value,
        publisher: $('#Modal_Product select')[2].value,
        description: $('#Modal_Product textarea')[0].val()
    }

    if(!selectedProduct) {
        addNewProduct(item);
    }
    else {
        item.imgSrc = $('#Modal_Product img')[0].src || $('#Modal_Product input')[0].files[0].name;
        updateProductInfo(item);
    }
});

// delete seelected Products
$('#ModalDelete').click(() => {});

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
	let filterOrderStt = $('#Orders select')[0].value,
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

$('#Orders select').change(() => {
    handleOrdersAppreance();
});
	
$('#StrToSearchOrders').keyup(() => {
	handleOrdersAppreance();
});

/*=============================== Authors ===============================*/

var selectedAuthor = null;
$('#Authors tbody').click((e) => {
    e.preventDefault();
    let tr = e.target.closest('tr');
    selectedProduct = tr;
    // copy current selected row info into modal
    // author code
    let td = tr.getElementsByTagName('td');
    $('#Modal_Author input')[0].value = td[0].textContent;
    // author name
    $('#Modal_Author textarea')[0].value = td[1].textContent;
    // show modal
    $('#Modal_Author').modal('show');
});

// clear all field content whenever..
$('#AddNewAuthor').click(() => {
    selectedProduct = null;
    $('#Modal_Author input')[0].value = '';
    $('#Modal_Author textarea')[0].value = '';
});

function addNewAuthor(item) {}

function updateAuthorInfo(item) {}

$('#ModalSave_Author').click(() => {
    if(!selectedAuthor) {
        addNewProduct({title: $('#Modal_Author input')[1].value});
    }
    else {
        updateProductInfo({title: $('#Modal_Author input')[1].value});
    }
});

// clear searches & reset appearance
$('#Authors select').change(() => {
    // clear search string in input field
    $('#StrToSearchAuthors')[0].value = '';
    $('#Authors tbody tr').each((index, ele) => {
        $(ele).show();
    });
});

$('#StrToSearchAuthors').keyup(() => {
    handleOthersAppreance('Authors');
});

/*=============================== Categories ===============================*/

var selectedCat = null;
$('#Cats tbody').click((e) => {
    e.preventDefault();
    let tr = e.target.closest('tr');
    selectedCat = tr;
    // copy current selected row info into modal
    // author code
    let td = tr.getElementsByTagName('td');
    $('#Modal_Cat input')[0].value = td[0].textContent;
    // author name
    $('#Modal_Cat textarea')[0].value = td[1].textContent;
    // show modal
    $('#Modal_Cat').modal('show');
});

// clear all field content whenever..
$('#AddNewCat').click(() => {
    selectedCat = null;
    $('#Modal_Cat input')[0].value = '';
    $('#Modal_Cat textarea')[0].value = '';
});

function addNewCat(item) {}

function updateCatInfo(item) {}

$('#ModalSave_Cat').click(() => {
    if(!selectedCat) {
        addNewCat({title: $('#Modal_Cat input')[1].value});
    }
    else {
        updateCatInfo({title: $('#Modal_Cat input')[1].value});
    }
});

// clear searches & reset appearance
$('#Cats select').change(() => {
    // clear search string in input field
    $('#StrToSearchCats')[0].value = '';
    $('#Cats tbody tr').each((index, ele) => {
        $(ele).show();
    });
});

$('#StrToSearchCats').keyup(() => {
    handleOthersAppreance('Cats');
});

/*=============================== Publishers ===============================*/

var selectedPublisher = null;
$('#Publishers tbody').click((e) => {
    e.preventDefault();
    let tr = e.target.closest('tr');
    selectedPublisher = tr;
    // copy current selected row info into modal
    // author code
    let td = tr.getElementsByTagName('td');
    $('#Modal_Publisher input')[0].value = td[0].textContent;
    // author name
    $('#Modal_Publisher textarea')[0].value = td[1].textContent;
    // show modal
    $('#Modal_Publisher').modal('show');
});

// clear all field content whenever..
$('#AddNewPublisher').click(() => {
    selectedPublisher = null;
    $('#Modal_Publisher input')[0].value = '';
    $('#Modal_Publisher textarea')[0].value = '';
});

function addNewPublisher(item) {}

function updatePublisherInfo(item) {}

$('#ModalSave_Publisher').click(() => {
    if(!selectedPublisher) {
        addNewPublisher({title: $('#Modal_Publisher input')[1].value});
    }
    else {
        updatePublisherInfo({title: $('#Modal_Publisher input')[1].value});
    }
});

// clear searches & reset appearance
$('#Publishers select').change(() => {
    // clear search string in input field
    $('#StrToSearchPublishers')[0].value = '';
    $('#Publishers tbody tr').each((index, ele) => {
        $(ele).show();
    });
});

$('#StrToSearchPublishers').keyup(() => {
    handleOthersAppreance('Publishers');
});
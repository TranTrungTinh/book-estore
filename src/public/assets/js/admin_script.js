/*=============================== Globally used ===============================*/

function loadList(container, url, func) {
    container.innerHTML = ''
    container.load(url, func)
}

function loadListBySection(id) {
    switch (id) {
        case 'Products':
            loadList($('#Products tbody'), '../html/admin_products_list.html')
            break
        case 'Orders':
            loadList($('#Orders tbody'), '../html/admin_orders_list.html', changeAllOrdersStatus)
            break
        default:
            break
    }
}

// load/reload section accordingly
$('#Navigator > .nav > li').click((e) => {
    e.preventDefault()
    let sections = $('#Content section')
    for (let i = 0; i < sections.length; i++) {
        let sectionId = sections[i].id
        if (('#' + sectionId) === e.target.getAttribute('href')) {
            // loadListBySection(sectionId)
            $('#' + sectionId).show('slide')
        } else {
            $('#' + sectionId).hide()
        }
    }

    return false
})

// refresh the entire list
$('.btn-refresh').click((e) => {
    e.preventDefault()
    let section = e.target.closest('section')
    loadListBySection(section.id)
    // re-filtering
    $(section)[0].getElementsByClassName('btn-search')[0].click()
    // after this all info are reset to default as they were hard-coded
})

// Authors, Categories, Publishers whose table has 2 column: id, name
function handleOthersAppreance(sectionId) {
    let strToSearch = $(`#StrToSearch${sectionId}`)[0].value

    let typeOfInfoOnCol = 0
    switch ($(`#${sectionId} select`)[0].value) {
        case 'name':
            typeOfInfoOnCol = 1
            break
        default:
            typeOfInfoOnCol = 0
            break
    }
    
    var container = $(`#${sectionId} tbody`)[0]
    $(container).empty()

    let sectionNumberId = -1
    switch(sectionId) {
        case 'Authors': 
        sectionNumberId = 2
        break
        case 'Cats': 
        sectionNumberId = 3
        break
        case 'Publishers': 
        sectionNumberId = 4
        break
    }

    var data = itemsList[sectionNumberId]

    $.each(data, (index, ele) => {
        if (!(strToSearch.length > 0 &&
            ele.getElementsByTagName('td')[typeOfInfoOnCol]
            .textContent.toLowerCase()
            .indexOf(strToSearch.toLowerCase()) < 0)) {
            container.appendChild(ele)
        }
    })
}

// Pagination
var itemsList = [$('#Products tbody tr'), $('#Orders tbody tr'), $('#Authors tbody tr'), $('#Cats tbody tr'), $('#Publishers tbody tr')]

$('.pagination-ul').each((index, ele) => {
    let sectionId = $(ele).closest('section').attr('id'),
        container = $(`#${sectionId} tbody`)[0],
        data = itemsList[index]
    
    $(ele).twbsPagination({
        totalPages: Math.ceil(data.length / 8),
        visiblePages: 5,
        onPageClick: (event, page) => {
            const start = (+page - 1) * 8 || 0
            $(container).empty()
            for (let i = start; i < start + 8 && i < data.length; i++) {
                container.appendChild(data[i])
            }
        }
    })
})

function updatePagination(sectionId) {
    let pgUl = $(`#${sectionId} .pagination-ul`)[0],
        data = $(`#${sectionId} tbody tr`)
    let newTotalPages = Math.ceil(data.length / 8)
    let defaultOpts = {
            totalPages: newTotalPages
        }
    
    $(pgUl).twbsPagination('destroy')

    $(pgUl).twbsPagination($.extend({}, defaultOpts, {
        startPage: 1,
        totalPages: newTotalPages,
        onPageClick: (event, page) => {
            const start = (+page - 1) * 8 || 0,
                container = $(`#${sectionId} tbody`)[0]
            $(container).empty()
            for (let i = start; i < start + 8; i++) {
                if(i > data.length - 1) continue // skip some shitty
                container.appendChild(data[i])
            }
        }
    }))
}

/*=============================== Products ===============================*/

$('#StrToSearchProducts').keyup(() => {
    let typeOfInfoOnCol = 0
    switch ($('#Products select')[0].value) {
        case 'id':
            typeOfInfoOnCol = 1
            break
        case 'product':
            typeOfInfoOnCol = 2
            break
        case 'author':
            typeOfInfoOnCol = 5
            break
        case 'catetory':
            typeOfInfoOnCol = 6
            break
        case 'publisher':
            typeOfInfoOnCol = 7
            break
        default:
            typeOfInfoOnCol = null
            break
    }

    let strToSearch = $('#StrToSearchProducts')[0].value,
        productsList = itemsList[0].slice()
        container = $('#Products tbody')[0]
    $(container).empty()
    $.each(productsList, (index, ele) => {
        if (!(strToSearch.length > 0 &&
            ele.getElementsByTagName('td')[typeOfInfoOnCol]
            .textContent.toLowerCase()
            .indexOf(strToSearch.toLowerCase()) < 0)) {
            container.appendChild(ele)
        }
    })

    updatePagination('Products')
})

// clear searches & reset appearance
$('#Products select').change(() => {
    const container = $('#Products tbody')[0]
    $(container).empty()
    $('#StrToSearchProducts')[0].value = ''
    itemsList[0].each((index, ele) => {
        container.appendChild(ele)
    })
})

var selectedProduct // determine whether modal save new product or update existed product
// pop up modal containing infos coresponding with selected row
$('#Products tbody').click((e) => {
    e.preventDefault()
    let tr = e.target.closest('tr')
    selectedProduct = tr
    // copy current selected row info into modal
    // product image
    $('#Modal_Product img')[0].src = tr.getElementsByTagName('img')[0].src
    // product price, amount, author, category, publisher
    let tds = tr.getElementsByTagName('td')
    for (let i = 1; i < 5; i++) {
        // price
        if(i === 3)
            $('#Modal_Product input')[i].value = tds[i].textContent.replace(',','').trim()
        else
            $('#Modal_Product input')[i].value = tds[i].textContent.trim()
    }
    let authorId = tr.getElementsByTagName('span')[0].textContent,
        catId = tr.getElementsByTagName('span')[1].textContent,
        publisherId = tr.getElementsByTagName('span')[2].textContent

    let optionsAuthor = $('#Modal_Product select:nth-of-type(1) > option'),
        optionsCat = $('#Modal_Product select:nth-of-type(2) > option'),
        optionsPublisher = $('#Modal_Product select:nth-of-type(3) > option')

    for (let i = 0; i < optionsAuthor.length; i++) {
        if (optionsAuthor[i].getAttribute('value') === authorId) {
            optionsAuthor[i].setAttribute('selected', true)
        } else {
            optionsAuthor[i].removeAttribute('selected')
        }
    }
    for (let i = 0; i < optionsCat.length; i++) {
        if (optionsCat[i].getAttribute('value') === catId) {
            optionsCat[i].setAttribute('selected', true)
        } else {
            optionsCat[i].removeAttribute('selected')
        }
    }
    for (let i = 0; i < optionsPublisher.length; i++) {
        if (optionsPublisher[i].getAttribute('value') === publisherId) {
            optionsPublisher[i].setAttribute('selected', true)
        } else {
            optionsPublisher[i].removeAttribute('selected')
        }
    }

    // product description
    $('#txtEditor').Editor("setText", selectedProduct.getElementsByClassName('detail-wrapper')[4].innerHTML)
    // show modal
    $('#Modal_Product').modal('show')
})

// clear all field content whenever..
$('#AddNewProduct').click(() => {
    selectedProduct = null
    $('#Modal_Product img')[0].src = './assets/media/images/book_default.png'
    $.each($('#Modal_Product input'), (index, ele) => {
        ele.value = ''
    })
    $('#txtEditor').Editor("setText", '')
})

function addNewProduct(item) {}

function updateProductInfo(item) {}

$('#ModalSave_Product').click(() => {
    let item = {
        imgSrc: '',
        /* image file path here */
        id: $('#Modal_Product input')[1].value,
        title: $('#Modal_Product input')[2].value,
        price: $('#Modal_Product input')[3].value,
        amount: $('#Modal_Product input')[4].value,
        author: $('#Modal_Product select')[0].value,
        type: $('#Modal_Product select')[1].value,
        publisher: $('#Modal_Product select')[2].value,
        description: $('#txtEditor').Editor("getText")
    }

    if (!selectedProduct) {
        addNewProduct(item)
    } else {
        item.imgSrc = $('#Modal_Product img')[0].src || $('#Modal_Product input')[0].files[0].name
        updateProductInfo(item)
    }
})

// delete selected Products
$('#ModalDelete').click(() => {})

/*=============================== Orders ===============================*/

function changeOrderRowStatus(sel) {
    let tr = sel.closest('tr')
    switch (sel.value) {
        case 'pending':
            tr.className = 'warning'
            break
        case 'delivering':
            tr.className = 'active'
            break
        case 'done':
            tr.className = 'success'
            break
        default:
            break
    }
}

function changeAllOrdersStatus() {
    let sel = $('#Orders table')[0].getElementsByTagName('select')
    for (let i = 0; i < sel.length; i++) {
        changeOrderRowStatus(sel[i])
    }
}

function handleOrdersAppreance() {
    let filterOrderStt = $('#Orders select')[0].value,
        strToSearch = $('#StrToSearchOrders')[0].value,
        ordersList = itemsList[1].slice()
        container = $('#Orders tbody')[0]
    $(container).empty()

    $.each(ordersList, (index, ele) => {
        let rowOrderStt = ele.getElementsByTagName('select')[0].value,
            orderCode = ele.getElementsByTagName('td')[0].textContent

        if (orderCode.toLowerCase().indexOf(strToSearch.toLowerCase()) > -1 &&
            (filterOrderStt === 'all' || filterOrderStt === rowOrderStt)) {
            container.appendChild(ele)
        }
    })
}

// change order row color when its status changed
$('#Orders table').change((e) => {
    e.preventDefault()
    changeOrderRowStatus(e.target)
})

$('#Orders select').change(() => {
    handleOrdersAppreance('Orders')
    updatePagination('Orders')
})

$('#StrToSearchOrders').keyup(() => {
    handleOrdersAppreance('Orders')
    updatePagination('Orders')
})

/*=============================== Authors ===============================*/

var selectedAuthor = null // see selectedProduct
$('#Authors tbody').click((e) => {
    e.preventDefault()
    let tr = e.target.closest('tr')
    selectedAuthor = tr
    // copy current selected row info into modal
    // author code
    let td = tr.getElementsByTagName('td')
    $('#Modal_Author input')[0].value = td[0].textContent.trim()
    // author name
    $('#Modal_Author input')[1].value = td[1].getElementsByClassName('detail-wrapper')[0].textContent.trim()
    // show modal
    $('#Modal_Author').modal('show')
})

// clear all field content whenever..
$('#AddNewAuthor').click(() => {
    selectedAuthor = null
    $('#Modal_Author input').each((index, ele) => {
        ele.value = ''
    })
})

function addNewAuthor(item) {}

function updateAuthorInfo(item) {}

$('#ModalSave_Author').click(() => {
    if (!selectedAuthor) {
        addNewProduct({
            title: $('#Modal_Author input')[1].value
        })
    } else {
        updateProductInfo({
            title: $('#Modal_Author input')[1].value
        })
    }
})

// clear searches & reset appearance
$('#Authors select').change(() => {
    const container = $('#Authors tbody')[0]
    $(container).empty()
    // clear search string in input field
    $('#StrToSearchAuthors')[0].value = ''
    itemsList[2].each((index, ele) => {
        container.appendChild(ele)
    })
    updatePagination('Authors')
})

$('#StrToSearchAuthors').keyup(() => {
    handleOthersAppreance('Authors')
    updatePagination('Authors')
})

/*=============================== Categories ===============================*/

var selectedCat = null // see selectedProduct
$('#Cats tbody').click((e) => {
    e.preventDefault()
    let tr = e.target.closest('tr')
    selectedCat = tr
    // copy current selected row info into modal
    // author code
    let td = tr.getElementsByTagName('td')
    $('#Modal_Cat input')[0].value = td[0].textContent.trim()
    // author name
    $('#Modal_Cat input')[1].value = td[1].getElementsByClassName('detail-wrapper')[0].textContent.trim()
    // show modal
    $('#Modal_Cat').modal('show')
})

// clear all field content whenever..
$('#AddNewCat').click(() => {
    selectedCat = null
    $('#Modal_Cat input').each((index, ele) => {
        ele.value = ''
    })
})

function addNewCat(item) {}

function updateCatInfo(item) {}

$('#ModalSave_Cat').click(() => {
    if (!selectedCat) {
        addNewCat({
            title: $('#Modal_Cat input')[1].value
        })
    } else {
        updateCatInfo({
            title: $('#Modal_Cat input')[1].value
        })
    }
})

// clear searches & reset appearance
$('#Cats select').change(() => {
    const container = $('#Cats tbody')[0]
    $(container).empty()
    // clear search string in input field
    $('#StrToSearchCats')[0].value = ''
    itemsList[3].each((index, ele) => {
        container.appendChild(ele)
    })
    updatePagination('Cats')
})

$('#StrToSearchCats').keyup(() => {
    handleOthersAppreance('Cats')
    updatePagination('Cats')
})

/*=============================== Publishers ===============================*/

var selectedPublisher = null // see selectedProduct
$('#Publishers tbody').click((e) => {
    e.preventDefault()
    let tr = e.target.closest('tr')
    selectedPublisher = tr
    // copy current selected row info into modal
    // author code
    let td = tr.getElementsByTagName('td')
    $('#Modal_Publisher input')[0].value = td[0].textContent.trim()
    // author name
    $('#Modal_Publisher input')[1].value = td[1].getElementsByClassName('detail-wrapper')[0].textContent.trim()
    // show modal
    $('#Modal_Publisher').modal('show')
})

// clear all field content whenever..
$('#AddNewPublisher').click(() => {
    selectedPublisher = null
    $('#Modal_Publisher input').each((index, ele) => {
        ele.value = ''
    })
})

function addNewPublisher(item) {}

function updatePublisherInfo(item) {}

$('#ModalSave_Publisher').click(() => {
    if (!selectedPublisher) {
        addNewPublisher({
            title: $('#Modal_Publisher input')[1].value
        })
    } else {
        updatePublisherInfo({
            title: $('#Modal_Publisher input')[1].value
        })
    }
})

// clear searches & reset appearance
$('#Publishers select').change(() => {
    const container = $('#Publishers tbody')[0]
    $(container).empty()
    // clear search string in input field
    $('#StrToSearchPublishers')[0].value = ''
    itemsList[4].each((index, ele) => {
        container.appendChild(ele)
    })
    updatePagination('Publishers')    
})

$('#StrToSearchPublishers').keyup(() => {
    handleOthersAppreance('Publishers')
    updatePagination('Publishers')
})
/*=============================== Globally used ===============================*/

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

var itemsList = [$('#Products tbody tr'),
    $('#Orders tbody tr'),
    $('#Authors tbody tr'),
    $('#Cats tbody tr'),
    $('#Publishers tbody tr')
]

// Authors, Categories, Publishers whose table has 2 column: id, name
function handleOthersAppreance(sectionId) {
    const strToSearch = $(`#StrToSearch${sectionId}`)[0].value.trim().toLowerCase()

    let typeOfInfoOnCol = 0
    switch ($(`#${sectionId} select`)[0].value) {
        case 'name':
            typeOfInfoOnCol = 1
            break
        default:
            typeOfInfoOnCol = 0
            break
    }

    const container = $(`#${sectionId} tbody`)[0]
    $(container).empty()

    let sectionNumberId = -1
    switch (sectionId) {
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

    let data = itemsList[sectionNumberId]
    $.each(data, (index, ele) => {
        let pattern = ele.getElementsByTagName('td')[typeOfInfoOnCol].textContent.trim().toLowerCase()
        if (!(strToSearch.length > 0 && pattern.indexOf(strToSearch) < 0)) {
            container.appendChild(ele)
        }
    })
}

function updateTable(data, sectionId) {
    // clear search string in input field
    $(`#StrToSearch${sectionId}`).value = ''
    
    let sectionNumberId = -1
    switch (sectionId) {
        case 'Products':
            sectionNumberId = 0
            break
        case 'Orders':
            sectionNumberId = 1
            break
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
    // empty container
    const container = $(`#${sectionId} tbody`)[0]
    $(container).empty()
    // refill the container
    $.each(data, (index, ele) => {
        let newRow
        switch (sectionNumberId) {
            case 0:
                newRow = makeNewBookRow(ele)
                break
            case 1:
                newRow = makeNewOrderRow(ele)
                break
            case 2:
                newRow = makeNewAuthorRow(ele)
                break
            case 3:
                newRow = makeNewCatRow(ele)
                break
            case 4:
                newRow = makeNewPublisherRow(ele)
                break
        }
        container.appendChild(newRow)
    })
    // update global data variable
    itemsList[sectionNumberId] = $(`#${sectionId} tbody tr`)
}

function compareToSort(a, b) {
    const idA = +a.getElementsByTagName('td')[0].textContent.trim(),
        idB = +b.getElementsByTagName('td')[0].textContent.trim()
    if (idA < idB) return -1
    if (idA > idB) return 1
    return 0
}

// Pagination
$('.pagination-ul').each((index, ele) => {
    let sectionId = $(ele).closest('section').attr('id'),
        container = $(`#${sectionId} tbody`)[0],
        data = $(`#${sectionId} tbody tr`)

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
                if (i > data.length - 1) continue // skip some shitty
                container.appendChild(data[i])
            }
        }
    }))
}

$('#logout').click(e => {
    e.preventDefault();
    swal({
        title: "Đăng xuất?",
        text: "Đăng xuất khỏi tài khoản admin",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        })
        .then(yes => { 
            if(!yes) return;
            $.post('/admin/logout', () => location.href = '/admin');
        });
});

$('section').on('click', '.btn-refresh', e => {
    const sectionId = $(e.target).closest('section').attr('id')

    $.get(`/admin/refresh${sectionId}`, (res, stt) => {
        switch (sectionId) {
            case 'Products':
                updateTable(res.data.books, sectionId)
                break
            case 'Orders':
                updateTable(res.data.orders, sectionId)
                break
            case 'Authors':
                updateTable(res.data.authors, sectionId)
                break
            case 'Cats':
                updateTable(res.data.cats, sectionId)
                break
            case 'Publishers':
                updateTable(res.data.publishers, sectionId)
                break
        }

        updatePagination(sectionId)
    })

    // clear seatch field
    $(`#StrToSearch${sectionId}`).val('')
})

/*=============================== Products ===============================*/

$('#StrToSearchProducts').keyup(() => {
    let typeOfInfoOnCol = 0
    switch ($('#Products select')[0].value) {
        case 'product':
            typeOfInfoOnCol = 2
            break
        case 'author':
            typeOfInfoOnCol = 5
            break
        case 'category':
            typeOfInfoOnCol = 6
            break
        case 'publisher':
            typeOfInfoOnCol = 7
            break
        case 'id':
        default:
            typeOfInfoOnCol = 0
            break
    }

    const strToSearch = $('#StrToSearchProducts')[0].value.trim().toLowerCase(),
        productsList = itemsList[0].slice()
    container = $('#Products tbody')[0]
    $(container).empty()

    $.each(productsList, (index, ele) => {
        const pattern = ele.getElementsByTagName('td')[typeOfInfoOnCol].textContent.trim().toLowerCase()
        if (!(strToSearch.length > 0 && pattern.indexOf(strToSearch) < 0)) {
            container.appendChild(ele)
        }
    })

    updatePagination('Products')
})

// clear searches & reset appearance
$('#Products select').change(() => {
    updateTable('Products')
    updatePagination('Products')
})

var selectedProduct // determine whether modal save new product or update existed product
// pop up modal containing infos coresponding with selected row
$('#Products tbody').click((e) => {
    e.preventDefault()
    $('#Modal_Product input')[1].value = ''
    let tr = e.target.closest('tr')
    selectedProduct = tr
    // copy current selected row info into modal
    // product image
    $('#Modal_Product img')[0].src = tr.getElementsByTagName('img')[0].src
    // product price, amount, author, category, publisher
    let tds = tr.getElementsByTagName('td')
    for (let i = 0; i < 5; i++) {
        if (i === 1) continue // skip image input
        // remove ',' in price field
        if (i === 3)
            $('#Modal_Product input')[i].value = tds[i].textContent.replace(',', '').trim()
        else
            $('#Modal_Product input')[i].value = tds[i].textContent.trim()
    }

    const authorId = tr.getElementsByTagName('span')[0].textContent.trim(),
        catId = tr.getElementsByTagName('span')[1].textContent.trim(),
        publisherId = tr.getElementsByTagName('span')[2].textContent.trim()

    const optionsAuthor = $('#Modal_Product .modal-body:first div:nth-of-type(1) select:nth-of-type(1) > option'),
        optionsCat = $('#Modal_Product .modal-body:first div:nth-of-type(2) select:nth-of-type(1) > option'),
        optionsPublisher = $('#Modal_Product .modal-body:first div:nth-of-type(2) select:nth-of-type(2) > option')

    for (let i = 0; i < optionsAuthor.length; i++) {
        const optionId = optionsAuthor[i].value.trim()
        if (optionId === authorId) {
            optionsAuthor[i].setAttribute('selected', true)
        } else {
            optionsAuthor[i].removeAttribute('selected')
        }
    }
    for (let i = 0; i < optionsCat.length; i++) {
        const optionId = optionsCat[i].value.trim()
        if (optionId === catId) {
            optionsCat[i].setAttribute('selected', true)
        } else {
            optionsCat[i].removeAttribute('selected')
        }
    }
    for (let i = 0; i < optionsPublisher.length; i++) {
        const optionId = optionsPublisher[i].value.trim()
        if (optionId === publisherId) {
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

    $.each($('#Modal_Product option'), (index, option) => {
        option.removeAttribute('selected')
    })

    $('#txtEditor').Editor("setText", '')

    $('#Modal_Product input')[1].value = ''
})

function makeNewBookRow(data) {
    const newBookRow = document.createElement('tr')

    newBookRow.innerHTML = `<td>${data.ID}</td>
                        <td class="img-wrapper img-wrapper-sm">
                            <img src="./assets/media/images/${data.IMAGE}" alt="Hình ảnh">
                        </td>
                        <td>
                            <div class="detail-wrapper">
                                ${data.NAME}
                            </div>
                        </td>
                        <td>${data.PRICE}</td>
                        <td>${data.INVENTORY}</td>
                        <td>
                            <div class="detail-wrapper">
                                ${data.AUTHOR_NAME}
                            </div>
                            <span style="display:none">${data.AUTHOR_ID}</span>
                        </td>
                        <td>
                            <div class="detail-wrapper">
                                ${data.CATEGORY_NAME}
                            </div>
                            <span style="display:none">${data.CATEGORY_ID}</span>
                        </td>
                        <td>
                            <div class="detail-wrapper">
                                ${data.PUBLISHER_NAME}
                            </div>
                            <span style="display:none">${data.PUBLISHER_ID}</span>
                        </td>
                        <td>
                            <div class="detail-wrapper">
                                ${data.DESCRIPTION}
                            </div>
                        </td>`

    return newBookRow
}

function addNewProduct(formData) {
    $.ajax({
        url: 'http://localhost:3000/admin/savebook',
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData
    }).then(data => {
        if (!data.success) return swal('UPLOAD FAIL', data.message, 'error');
        swal('UPLOAD SUCCESS', data.filename, 'success');
        $('#Products .btn-refresh').trigger('click')
    });
}

function updateProductInfo(formData) {
    $.ajax({
        url: `http://localhost:3000/admin/updatebook/${formData.get('id')}`,
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData
    }).then(data => {
        if (!data.success) return swal('UPLOAD FAIL', data.message, 'error');
        swal('UPLOAD SUCCESS', data.filename, 'success');
        $('#Products .btn-refresh').trigger('click');
    });
}

$('#ModalSave_Product').click((e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', $('#Modal_Product input')[1].files[0]);
    formData.append('id', $('#Modal_Product input')[0].value);
    formData.append('name', $('#Modal_Product input')[2].value);
    formData.append('price', $('#Modal_Product input')[3].value);
    formData.append('amount', $('#Modal_Product input')[4].value);
    formData.append('author', $('#Modal_Product select')[0].value);
    formData.append('type', $('#Modal_Product select')[1].value);
    formData.append('publisher', $('#Modal_Product select')[2].value);
    formData.append('description', $('#txtEditor').Editor("getText"));

    if (!selectedProduct) {
        addNewProduct(formData);
    } else {
        const path = $('.img-wrapper-md').children(":first")[0].currentSrc;
        const dotIndex = path.lastIndexOf('/');
        const imagePath = path.substring(dotIndex + 1);
        const image = $('#Modal_Product input')[1].files[0] || '';
        formData.set('image', image);
        formData.append('imagePath', imagePath);
        updateProductInfo(formData);
    }
})

// delete selected Products
$('#ModalDelete').click(() => {
    const bookId = $('#Modal_Product input')[0].value || ''
    if (!bookId) return

    $.post('/admin/deletebook', {
        bookId
    }, res => {
        if (!res.success) alert(res.message)
        else {
            $('#Products .btn-refresh').trigger('click')
        }
    })
})

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
            tr.className = ''
            break
    }
}

function handleOrdersAppreance() {
    let filterOrderStt = $('#Orders select')[0].value.trim().toLowerCase(),
        strToSearch = $('#StrToSearchOrders')[0].value.trim(),
        ordersList = itemsList[1].slice()
    container = $('#Orders tbody')[0]
    $(container).empty()

    $.each(ordersList, (index, ele) => {
        let rowOrderStt = ele.getElementsByTagName('select')[0].value.trim().toLowerCase(),
            orderId = ele.getElementsByTagName('td')[0].textContent.trim()

        if (orderId.indexOf(strToSearch) > -1 &&
            (filterOrderStt === 'all' || filterOrderStt === rowOrderStt)) {
            container.appendChild(ele)
        }
    })
}

function makeNewOrderRow(data) {
    const newOrderRow = document.createElement('tr')

    newOrderRow.innerHTML = `
    <td>${data.ID}</td>
    <td>${data.ID_USER}</td>
    <td>${data.DATE_CREATED}</td>
    <td>
        <div class="detail-wrapper">${data.CONTENT}</div>
    </td>
    <td>${data.TOTAL_COST}</td>
    <td>
        <select class="form-control">
            <option value="pending">Chưa giao</option>
            <option value="delivering">Đang giao hàng</option>
            <option value="done">Giao hàng thành công</option>
        </select>
    </td>`

    if (data.STATE == 3) {
        newOrderRow.className = 'success'
        newOrderRow.getElementsByTagName('option')[2].setAttribute('selected', true)
    } else if (data.STATE == 2) {
        newOrderRow.className = 'active'
        newOrderRow.getElementsByTagName('option')[1].setAttribute('selected', true)
    } else {
        newOrderRow.className = 'warning'
        newOrderRow.getElementsByTagName('option')[0].setAttribute('selected', true)
    }

    return newOrderRow
}

function updateOrderInfo(order) {
    const {
        orderId,
        orderStt
    } = order

    $.post('/admin/updateorder', {
        orderId,
        orderStt
    }, res => {
        if (!res.success) alert(res.message)
        else {
            for (let i = 0; i < itemsList[2].length; i++) {
                // find the row with coresponding id
                let rowId = itemsList[2][i].getElementsByTagName('td')[0].textContent.trim()
                if (rowId === orderId) {
                    itemsList[2][i].getElementsByTagName('options').each((index, option) => {
                        if (option.value.trim() === orderStt) {
                            option.setAttribute('selected', true)
                        } else {
                            option.removeAttribute('selected')
                        }
                    })
                    changeOrderRowStatus(itemsList[2][i].getElementsByTagName('select')[0])
                    break
                }
            }
            updatePagination('Orders')
        }
    })
}

// change order row color when its status changed
$('#Orders table').change((e) => {
    e.preventDefault()
    changeOrderRowStatus(e.target)
})

$('#Orders select[name=TypeOfInfo]').change(() => {
    handleOrdersAppreance('Orders')
    updatePagination('Orders')
})

$('#StrToSearchOrders').keyup(() => {
    handleOrdersAppreance('Orders')
    updatePagination('Orders')
})

$('#Orders tbody').on('change', 'select', e => {
    e.preventDefault();
    let tr = $(e.target).closest('tr')[0]
    const orderId = tr.getElementsByTagName('td')[0].textContent.trim(),
        orderStt = tr.getElementsByTagName('select')[0].value.trim()

    updateOrderInfo({
        orderId,
        orderStt
    });
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

function makeNewAuthorRow(data) {
    const newAuthorRow = document.createElement('tr')

    newAuthorRow.innerHTML = `
    <td>${data.ID}</td>
    <td>
        <div class="detail-wrapper">${data.NAME}</div>
    </td>`

    return newAuthorRow
}

function addNewAuthor(author) {
    const {
        authorName
    } = author
    $.post('/admin/saveauthor', {
        authorName
    }, res => {
        if (!res.success) return alert('Failed adding new author!')
        $('#Authors .btn-refresh').trigger('click')
    })
}

function updateAuthorInfo(author) {
    const {
        authorId,
        authorName
    } = author
    $.post('/admin/updateauthor', {
        authorId,
        authorName
    }, res => {
        if (!res.success) return alert(res.message)
        $('#Authors .btn-refresh').trigger('click')
    })
}

$('#ModalSave_Author').click(() => {
    const authorName = $('#Modal_Author input')[1].value || ''
    if (!selectedAuthor) {
        addNewAuthor({
            authorName
        })
    } else {
        const authorId = $('#Modal_Author input')[0].value || ''
        updateAuthorInfo({
            authorId,
            authorName
        })
    }
})

// clear searches & reset appearance
$('#Authors select').change(() => {
    updateTable('Authors')
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

function makeNewCatRow(data) {
    const newCatRow = document.createElement('tr')

    newCatRow.innerHTML = `
    <td>${data.ID}</td>
    <td>
        <div class="detail-wrapper">${data.NAME}</div>
    </td>`

    return newCatRow
}

function addNewCat(cat) {
    const {
        catName
    } = cat
    $.post('/admin/savecat', {
        catName
    }, res => {
        if (!res.success) return alert('Failed adding new category!')
        $('#Cats .btn-refresh').trigger('click')
    })
}

function updateCatInfo(cat) {
    const {
        catId,
        catName
    } = cat
    $.post('/admin/updatecat', {
        catId,
        catName
    }, res => {
        if (!res.success) return alert(res.message)
        $('#Cats .btn-refresh').trigger('click')
    })
}

$('#ModalSave_Cat').click(() => {
    const catName = $('#Modal_Cat input')[1].value || ''
    if (!selectedCat) {
        addNewCat({
            catName
        })
    } else {
        const catId = $('#Modal_Cat input')[0].value || ''
        updateCatInfo({
            catId,
            catName
        })
    }
})

// clear searches & reset appearance
$('#Cats select').change(() => {
    updateTable('Cats')
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

function makeNewPublisherRow(data) {
    const newPublisherRow = document.createElement('tr')

    newPublisherRow.innerHTML = `
    <td>${data.ID}</td>
    <td>
        <div class="detail-wrapper">${data.NAME}</div>
    </td>`

    return newPublisherRow
}

function addNewPublisher(publisher) {
    const {
        publisherName
    } = publisher
    $.post('/admin/savepublisher', {
        publisherName
    }, res => {
        if (!res.success) return alert('Failed adding new publisher!')
        $('#Publishers .btn-refresh').trigger('click')
    })
}

function updatePublisherInfo(publisher) {
    const {
        publisherId,
        publisherName
    } = publisher
    $.post('/admin/updatepublisher', {
        publisherId,
        publisherName
    }, res => {
        if (!res.success) return alert(res.message)
        $('#Publishers .btn-refresh').trigger('click')
    })
}

$('#ModalSave_Publisher').click(() => {
    const publisherName = $('#Modal_Publisher input')[1].value || ''
    if (!selectedPublisher) {
        addNewPublisher({
            publisherName
        })
    } else {
        const publisherId = $('#Modal_Publisher input')[0].value || ''
        updatePublisherInfo({
            publisherId,
            publisherName
        })
    }
})

// clear searches & reset appearance
$('#Publishers select').change(() => {
    updateTable('Publishers')
    updatePagination('Publishers')
})

$('#StrToSearchPublishers').keyup(() => {
    handleOthersAppreance('Publishers')
    updatePagination('Publishers')
})
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

// Authors, Categories, Publishers whose table has 2 column: id, name
function handleOthersAppreance(sectionId) {
    let strToSearch = $(`#StrToSearch${sectionId}`)[0].value.trim().toLowerCase()

    let typeOfInfoOnCol = 0
    switch ($(`#${sectionId} select`)[0].value) {
        case 'name':
            typeOfInfoOnCol = 1
            break
        default:
            typeOfInfoOnCol = 0
            break
    }

    let container = $(`#${sectionId} tbody`)[0]
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

function updateTable(sectionId) {
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

    const container = $(`#${sectionId} tbody`)[0]
    $(container).empty()
    // clear search string in input field
    $(`#StrToSearch${sectionId}`)[0].value = ''
    itemsList[sectionNumberId].each((index, ele) => {
        container.appendChild(ele)
    })
}

function compareToSort(a, b) {
    const idA = +a.getElementsByTagName('td')[0].textContent.trim(),
        idB = +b.getElementsByTagName('td')[0].textContent.trim()
    if (idA < idB) return -1
    if (idA > idB) return 1
    return 0
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
                if (i > data.length - 1) continue // skip some shitty
                container.appendChild(data[i])
            }
        }
    }))
}

$('#logout').click(e => {

});

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

    $.each($('#Modal_Product select'), (index, ele) => {
        [...$(ele.getElementsByTagName('option'))].forEach(option => {
            option.removeAttribute('selected')
        })
    })

    $('#txtEditor').Editor("setText", '')
})

function makeNewBookRow(id, image, name, price, amount, authorId, authorName, catId, catName, publisherId, publisherName, description) {
    const newBookRow = document.createElement('tr')

    newBookRow.innerHTML = `<td>${id}</td>
                        <td class="img-wrapper img-wrapper-sm">
                            <img src="./assets/media/images/${image}" alt="Hình ảnh">
                        </td>
                        <td>
                            <div class="detail-wrapper">
                                ${name}
                            </div>
                        </td>
                        <td>${price}</td>
                        <td>${amount}</td>
                        <td>
                            <div class="detail-wrapper">
                                ${authorName}
                            </div>
                            <span style="display:none">${authorId}</span>
                        </td>
                        <td>
                            <div class="detail-wrapper">
                                ${catName}
                            </div>
                            <span style="display:none">${catId}</span>
                        </td>
                        <td>
                            <div class="detail-wrapper">
                                ${publisherName}
                            </div>
                            <span style="display:none">${publisherId}</span>
                        </td>
                        <td>
                            <div class="detail-wrapper">
                                ${description}
                            </div>
                        </td>`
    
    return newBookRow
}

function addNewBookToTable(formData, fileName) {
    // get new id
    const dotIndex = fileName.lastIndexOf('.')
    const newId = fileName.slice(0, dotIndex)

    // find author name by id
    let authorName = ''
    const authorList = itemsList[2]
    for (let i = 0; i < authorList.length; i++) {
        const author = authorList[i]
        const authorId = author.getElementsByTagName('td')[0].textContent.trim()
        if (formData.get('author') === authorId) {
            authorName = author.getElementsByClassName('detail-wrapper')[0].textContent.trim()
            break
        }

    }

    // find type name by id
    let typeName = ''
    const typeList = itemsList[3]
    for (let i = 0; i < typeList.length; i++) {
        const type = typeList[i]
        const typeId = type.getElementsByTagName('td')[0].textContent.trim()
        if (formData.get('type') === typeId) {
            typeName = type.getElementsByClassName('detail-wrapper')[0].textContent.trim()
            break
        }

    }

    // find publisher name by id
    let publisherName = ''
    const publisherList = itemsList[4]
    for (let i = 0; i < publisherList.length; i++) {
        const publisher = publisherList[i]
        const publisherId = publisher.getElementsByTagName('td')[0].textContent.trim()
        if (formData.get('publisher') === publisherId) {
            publisherName = publisher.getElementsByClassName('detail-wrapper')[0].textContent.trim()
            break
        }

    }

    // make new book row
    const newBookRow = makeNewBookRow(newId, fileName, formData.get('name'), 
                                    formData.get('price'), formData.get('amount'), 
                                    formData.get('author'), authorName,
                                    formData.get('type'), typeName,
                                    formData.get('publisher'), publisherName,
                                    formData.get('description'))

    itemsList[0].push(newBookRow)
    itemsList[0].sort(compareToSort)
}

function addNewProduct(formData) {
    $.ajax({
        url: 'http://localhost:3000/admin/savebook',
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData
    }).then(data => {
        if (!data.success) return alert('UPLOAD FAIL - ' + data.message);
        alert('UPLOAD SUCCESS - ' + data.filename);
        addNewBookToTable(formData, data.filename)
        updateTable('Products')
        updatePagination('Products')
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
        if (!data.success) return alert('UPLOAD FAIL - ' + data.message);
        alert('UPDATE SUCCESS - ' + data.filename);
        // get updated id
        const dotIndex = data.filename.lastIndexOf('.')
        const updatedBookId = data.filename.slice(0, dotIndex)
        // find coresponding row in table and delete it
        const books = itemsList[0]
        for (let i = 0; i < books.length; i++) {
            bookId = books[i].getElementsByTagName('td')[0].textContent.trim()
            if(bookId === updatedBookId) {
                itemsList[0].splice(i, 1)
                break
            }
        }
        // re-add row with updated info to table
        addNewBookToTable(formData, data.filename)
        updateTable('Products')
        updatePagination('Products')
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
            // find the row with coresponding id
            const bookList = itemsList[0]
            for (let i = 0; i < bookList.length; i++) {
                const rowId = bookList[i].getElementsByTagName('td')[0].textContent.trim()
                if (rowId === bookId) {
                    itemsList[0].splice(i, 1)
                    break
                }
            }
            updateTable('Products')
            updatePagination('Products')
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

function addNewAuthor(author) {
    const {
        authorName
    } = author
    $.post('/admin/saveauthor', {
        authorName
    }, res => {
        if (!res.success) alert('Failed adding new author!')
        else {
            const {
                newId
            } = res,
            tr = document.createElement('tr')
            tr.innerHTML = `<td>${newId}</td><td><div class="detail-wrapper">${authorName}</div></td>`
            itemsList[2].push(tr)
            itemsList[2].sort(compareToSort)
        }
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
        if (!res.success) alert(res.message)
        else {
            for (let i = 0; i < itemsList[2].length; i++) {
                // find the row with coresponding id
                if (itemsList[2][i]
                    .getElementsByTagName('td')[0]
                    .textContent.trim() === authorId) {
                    itemsList[2][i].getElementsByClassName('detail-wrapper')[0].textContent = authorName
                    break
                }
            }
        }
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
    updateTable('Authors')
    updatePagination('Authors')
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

function addNewCat(cat) {
    const {
        catName
    } = cat
    $.post('/admin/savecat', {
        catName
    }, res => {
        if (!res.success) alert('Failed adding new category!')
        else {
            const {
                newId
            } = res,
            tr = document.createElement('tr')
            tr.innerHTML = `<td>${newId}</td><td><div class="detail-wrapper">${catName}</div></td>`
            itemsList[3].push(tr)
            itemsList[3].sort(compareToSort)
        }
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
        if (!res.success) alert(res.message)
        else {
            for (let i = 0; i < itemsList[3].length; i++) {
                // find the row with coresponding id
                if (itemsList[3][i]
                    .getElementsByTagName('td')[0]
                    .textContent.trim() === catId) {
                    itemsList[3][i].getElementsByClassName('detail-wrapper')[0].textContent = catName
                    break
                }
            }
        }
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
    updateTable('Cats')
    updatePagination('Cats')
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

function addNewPublisher(publisher) {
    const {
        publisherName
    } = publisher
    $.post('/admin/savepublisher', {
        publisherName
    }, res => {
        if (!res.success) alert('Failed adding new publisher!')
        else {
            const {
                newId
            } = res,
            tr = document.createElement('tr')
            tr.innerHTML = `<td>${newId}</td><td><div class="detail-wrapper">${publisherName}</div></td>`
            itemsList[4].push(tr)
            itemsList[4].sort(compareToSort)
        }
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
        if (!res.success) alert(res.message)
        else {
            for (let i = 0; i < itemsList[4].length; i++) {
                // find the row with coresponding id
                if (itemsList[4][i]
                    .getElementsByTagName('td')[0]
                    .textContent.trim() === publisherId) {
                    itemsList[4][i].getElementsByClassName('detail-wrapper')[0].textContent = publisherName
                    break
                }
            }
        }
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
    updateTable('Publishers')
    updatePagination('Publishers')
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
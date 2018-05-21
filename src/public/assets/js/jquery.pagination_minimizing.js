const page = parseInt(location.href.substr(location.href.indexOf('page=') + 5))
if (page !== -1) { // pagination exists
    var navList = $('.pagination > li')
    // deactivate remaining pages
    for (let i = 0; i < navList.length; i++) {
        $(navList[i]).className = ''
    }
    // activate the currect selected page
    $(navList[page - 1]).className = 'active'

    // ====================================================================
    // selected page is in first 5 pages OR/AND there are less than 5 pages
    if (navList.length < 6 || page < 4) {
        for (let i = 0; i < (navList.length < 5 ? navList.length : 5); i++) {
            $(navList[i]).show()
        }
        // hide remaining
        for (let i = 5; i < navList.length; i++) {
            $(navList[i]).hide()
        }
    }

    // ====================================================================
    // selected page is in last 5 pages AND there are equal or more than 5 pages
    else if (navList.length > 5 && page > navList.length - 3) {
        for (let i = navList.length - 1; i > navList.length - 4; i--) {
            $(navList[i]).show()
        }
        // hide remaining
        for (let i = navList.length - 6; i >= 0; i--) {
            $(navList[i]).hide()
        }
    }

    // ====================================================================
    // selected page is in middle AND there are equal or more than 5 pages
    if (navList.length > 3 && page > 3 && page < navList.length - 2) {
        // so show 2 li before & 2 li after the current seleected page
        $(navList[page - 2]).show()
        $(navList[page - 3]).show()
        $(navList[page]).show()
        $(navList[page + 1]).show()
        // hide remaining pages
        // left 
        for (let i = 0; i < page - 3; i++) {
            $(navList[i]).hide()
        }
        // right
        for (let i = navList.length - 1; i > page + 1; i--) {
            $(navList[i]).hide()
        }
    }
}
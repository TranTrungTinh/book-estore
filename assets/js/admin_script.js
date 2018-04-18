window.onload = () => {
    $('#Navigator > .nav > li > a').trigger('click');
}

$('#Navigator > .nav > li').on('click', () => {
    if (event.target.tagName === 'A') {
        let sections = $('#Content > section');
        for (let i = 0; i < sections.length; i++) {
            if(('#' + sections[i].getAttribute('id')) === event.target.getAttribute('href')) {
                sections[i].style.display = 'block';
                if(window.innerWidth < 761) {
                    sections[i].style.top = '100px';
                }
                else {
                    sections[i].style.top = '0';
                }
            }
            else {
                sections[i].style.display = 'none';
            }
        }
    }
    
    return false;
})
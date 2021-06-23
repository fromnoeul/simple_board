const parseQuery = () => {
    const queryObj = {};
    const queryRaw = window.location.search.slice(1);
    const querySplit = queryRaw.split('&');
    querySplit.forEach( item => {
        const temp = item.split('=');
        queryObj[temp[0]] = parseInt(temp[1]);
    })
    return queryObj;
}

const optionSelected = (n_posts) => {
    //  what this 'select' event handler do
    //  1.  set 'limit' value of the query string to selected value
    //  2.  Refresh
    const selectedValue = n_posts[n_posts.selectedIndex].value;

    //  currQuery[0] => limit=n
    //  currQuery[1] => page=n
    const currQuery = window.location.search.slice(1).split("&");
    location.href = window.location.href.replace(currQuery[0], `limit=${selectedValue}`);
}

const main = () => {
    //  DOM operation 'document.~'
    const pages = document.querySelector('.pages');
    const posts = document.querySelector('.posts');
    const n_posts = document.getElementById('n_posts');

    //  DOM operation '~.querySelector'
    const tbody = posts.querySelector("tbody");
    const previous = pages.querySelector('.previous_page');
    const next = pages.querySelector('.next_page');
    
    //  Object in need
    const parsedObj = parseQuery();
    const limitObj = {
        //  to convert limit number to index of <select>
        "5" : 0,
        "10" : 1,
        "15" : 2
    }
    //  change color of selected page label
    document.getElementById(`${parsedObj.page}`).classList.add("this_page");

    //  add "change" event listener for <select>
    //  then set <option selected> to item that matches with limit value of current page
    n_posts.addEventListener('change', event => optionSelected(n_posts));
    n_posts[limitObj[String(parsedObj.limit)]].selected = true;
}

main();
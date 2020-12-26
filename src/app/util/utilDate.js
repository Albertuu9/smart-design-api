function getCurrentDate() {
    let date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); 
    let yyyy = date.getFullYear();

    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hour = date.getHours();

    date = mm + '/' + dd + '/' + yyyy + ' ' + hour + ':' + minutes + ':' + seconds;
    return date
}

module.exports = { getCurrentDate }
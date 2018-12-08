function storeData(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

function getData(name) {
    var dataString = localStorage.getItem(name);

    if (!dataString) {
        return null;
    }

    return JSON.parse(dataString);
}

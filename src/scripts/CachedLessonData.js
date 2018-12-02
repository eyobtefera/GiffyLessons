function storeData(name, data){
    localStorage.setItem(name, JSON.stringify(data));
}

function getData(name){
    localStorage.getItem(JSON.parse(name));
}

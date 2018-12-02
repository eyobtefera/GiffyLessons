function storeData(name, data){
    localStorage.setItem("lesson", JSON.stringify(gifs));
}

function getData(name){
    localStorage.getItem("lesson");
}

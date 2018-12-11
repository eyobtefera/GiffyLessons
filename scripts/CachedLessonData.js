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

function deleteLesson(name){
    localStorage.removeItem(name);
}

function clearLessons(){
    localStorage.clear();
}
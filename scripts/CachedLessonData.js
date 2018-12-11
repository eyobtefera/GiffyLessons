/**
 * Store a given object in the cache
 * @param {*} name key at which to store object
 * @param {*} data data object to be stored
 */
function storeData(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

/**
 * Get an object stored at a given key
 * @param {*} name key at which object is stored
 */
function getData(name) {
    var dataString = localStorage.getItem(name);

    if (!dataString) {
        return null;
    }

    return JSON.parse(dataString);
}

/**
 * Deletes an object from the cache
 * @param {*} name key at which object is stored
 */
function deleteLesson(name) {
    localStorage.removeItem(name);
}

/**
 * Clear the local storage
 */
function clearLessons() {
    localStorage.clear();
}

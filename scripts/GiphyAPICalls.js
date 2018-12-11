/**
 * Class to wrap a gif result
 */
class gif {
    constructor(url, title, images) {
        this.title = title;
        this.url = url;
        this.images = images;
    }

    getTitle() {
        return this.title;
    }

    getUrl() {
        return this.url;
    }

    getImages() {
        return this.images;
    }
}

/**
 * Search and return gif in from the Giphy API
 * @param {*} search search query
 * @param {*} rating ratings to limit results
 */
function gifSearch(search, rating) {
    var gifs = [];
    var i = 0;
    var found = client
        .search("gifs", { q: search, rating: rating, limit: 100 })
        .then(response => {
            response.data.forEach(gifObject => {
                title = gifObject.title;
                id = gifObject.id;
                url = gifObject.images.original.url;
                gifs[i] = new gif(url, title, gifObject.images);
                i = i + 1;
            });
            return gifs;
        })
        .then(response => {
            return gifs;
        })
        .catch(err => {
            throw "API did not send a response";
        });
    return found;
}

//var GphApiClient = require("giphy-js-sdk-core");
//client = GphApiClient("KKE5dxXzOHTY1cqjgcsDGkxXY44AeF6V");

class gif {
    constructor(url, title) {
        this.title = title;
        this.url = url;
    }
}

function gifSearch(search, rating) {
    var gifs = [];
    client.search('gifs', { "q": search, "rating": rating })
        .then((response) => {
            response.data.forEach((gifObject) => {
                title = gifObject.title;
                id = gifObject.id;
                url = gifObject.embed_url; 
                gifs.push(new gif(url, title));
            })
        })
        .catch((err) => {
            throw "API did not send a response";
        })
    return gifs;
}
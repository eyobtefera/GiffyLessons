var GphApiClient = require("giphy-js-sdk-core");
client = GphApiClient("KKE5dxXzOHTY1cqjgcsDGkxXY44AeF6V");

function gif(title, id, url){
    this.title = title;
    this.id = id;
    this.url = url;
}

function gifSearch(search, rating) {
    var gifs = [];
    client.search('gifs', { "q": search, "rating": rating })
        .then((response) => {
            response.data.forEach((gifObject) => {
                gifs.push(new gif(gifObject.data.title, gifObject.data.id, gifObject.data.embed_url))
            })
            console.log(gifs);
            return gifs;
        })
        .catch((err) => {
            throw "API did not send a response";
        })
}
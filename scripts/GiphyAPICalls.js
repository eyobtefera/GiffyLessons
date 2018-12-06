//var GphApiClient = require("giphy-js-sdk-core");
//client = GphApiClient("KKE5dxXzOHTY1cqjgcsDGkxXY44AeF6V");

class gif {
    constructor(url, title) {
        this.title = title;
        this.url = url;
    }

    getTitle() {
        return this.title;
    }

    getUrl() {
        return this.url;
    }
}

async function getGifs(search, rating){
    try{
        let response = await gifSearch(search, rating);
        let processed_response = await processGifs(response);
        
        console.log(processed_response);
        return processed_response;
    }
    catch(e){
        console.log(e);
        throw e;
    }
}

function gifSearch(search, rating) {
    var gifs = [];
    var i = 0;
    var found = client.search('gifs', { "q": search, "rating": rating })
        .then((response) => {
            response.data.forEach((gifObject) => {
                title = gifObject.title;
                id = gifObject.id;
                url = gifObject.embed_url;
                gifs[i] = (new gif(url, title));
                i = i + 1;
            })
            return gifs;
        }).then((response) => {
            return gifs;
        })
        .catch((err) => {
            throw "API did not send a response";
        })
    return found;
}


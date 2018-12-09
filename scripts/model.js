class Model {
    constructor() {
        this.data = {
            lessons: [
                {
                    name: "Lesson 1",
                    description: "Description of lesson",
                    gifs: [
                        {
                            url:
                                "https://media1.giphy.com/media/cZ7rmKfFYOvYI/200.gif",
                            description: "Test Description 1"
                        },
                        {
                            url:
                                "https://media1.giphy.com/media/cZ7rmKfFYOvYI/200.gif",
                            description: "Test Description 2"
                        },
                        {
                            url:
                                "https://media1.giphy.com/media/cZ7rmKfFYOvYI/200.gif",
                            description: "Test Description 3"
                        },
                        {
                            url:
                                "https://media1.giphy.com/media/cZ7rmKfFYOvYI/200.gif",
                            description: "Test Description 4"
                        },
                        {
                            url:
                                "https://media1.giphy.com/media/cZ7rmKfFYOvYI/200.gif",
                            description: "Test Description 5"
                        },
                        {
                            url:
                                "https://media1.giphy.com/media/cZ7rmKfFYOvYI/200.gif",
                            description: "Test Description 6"
                        }
                    ]
                },
                {
                    name: "",
                    description: "Description of lesson",
                    gifs: []
                }
            ]
        };
    }

    getLesson(i) {
        return this.data.lessons[i];
    }

    getLessons() {
        return this.data.lessons;
    }

    createLesson() {
        var index = this.data.lessons.length;
        this.data.lessons.push({
            name: "Lesson " + index,
            description: "",
            gifs: []
        });
        this.save();
        return index;
    }

    reorderGifs(i, newIndex, oldIndex) {
        const movedItem = this.data.lessons[i].gifs.splice(oldIndex, 1)[0];
        this.data.lessons[i].gifs.splice(newIndex, 0, movedItem);
        this.save();
    }

    removeGif(i, index) {
        this.data.lessons[i].gifs.splice(index, 1)[0];
        this.save();
    }

    addGif(i, gif) {
        var item = {
            url: gif.url,
            description: "",
            images: gif.images
        };
        this.data.lessons[i].gifs.push(item);
        this.save();
    }

    setLessonName(i, name) {
        this.data.lessons[i].name = name;
        this.save();
    }

    setLessonDescription(i, desc) {
        this.data.lessons[i].description = desc;
        this.save();
    }

    setGifDescription(lessonIndex, gifIndex, desc) {
        this.data.lessons[lessonIndex].gifs[gifIndex].description = desc;
        this.save();
    }

    save() {
        storeData("lessonData", this.data);
    }

    load() {
        var temp = getData("lessonData");
        if (temp) {
            this.data = temp;
        } else {
            this.data = {
                lessons: []
            };
        }
    }
}

var Data = (function() {
    var instance;

    function createInstance() {
        var object = new Model();
        return object;
    }

    return {
        getModel: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
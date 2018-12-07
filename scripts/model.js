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
                }
            ]
        };
    }

    getLesson(i) {
        return this.data.lessons[i];
    }

    reorderGifs(i, newIndex, oldIndex) {
        const movedItem = this.data.lessons[i].gifs.splice(oldIndex, 1)[0];
        this.data.lessons[i].gifs.splice(newIndex, 0, movedItem);
    }

    removeGif(i, index) {
        this.data.lessons[i].gifs.splice(index, 1)[0];
    }

    setLessonName(i, name) {
        this.data.lessons[i].name = name;
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

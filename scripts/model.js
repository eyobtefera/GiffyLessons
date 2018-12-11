/**
 * This class implements the model that wraps our underlying data structure
 */

class Model {
    constructor() {
        this.data = {
            lessons: []
        };
    }

    /**
     * Get a lesson at a given index
     * @param {*} i index of lesson
     */
    getLesson(i) {
        return this.data.lessons[i];
    }

    /**
     * Delete a lesson at a given index
     * @param {*} i index of lesson to delete
     */
    deleteLesson(i) {
        this.data.lessons.splice(i, 1);
        this.save();
    }

    /**
     * Get an array of all the lessons
     */
    getLessons() {
        return this.data.lessons;
    }

    /**
     * Create a new lesson, that is placed at the end of the list of lessons
     */
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

    /**
     * Reorder a gif in a lesson at a given index
     * @param {*} i index of the lesson
     * @param {*} newIndex index to place the gif at
     * @param {*} oldIndex index of the gif to move
     */
    reorderGifs(i, newIndex, oldIndex) {
        const movedItem = this.data.lessons[i].gifs.splice(oldIndex, 1)[0];
        this.data.lessons[i].gifs.splice(newIndex, 0, movedItem);
        this.save();
    }

    /**
     * Remove a gif from a lesson at a given index
     * @param {*} i index of lesson
     * @param {*} index index of gif to move
     */
    removeGif(i, index) {
        this.data.lessons[i].gifs.splice(index, 1)[0];
        this.save();
    }

    /**
     * Add a gif to a lesson at a given index
     * @param {*} i
     * @param {*} gif
     */
    addGif(i, gif) {
        var item = {
            url: gif.url,
            description: "",
            images: gif.images
        };
        this.data.lessons[i].gifs.push(item);
        this.save();
    }

    /**
     * Set the name of a lesson at a given index
     * @param {*} i index of the lesson
     * @param {*} name new name of the lesson
     */
    setLessonName(i, name) {
        this.data.lessons[i].name = name;
        this.save();
    }

    /**
     * Set the description of a lesson at a given index
     * @param {*} i index of the lesson
     * @param {*} desc new description of the lesson
     */
    setLessonDescription(i, desc) {
        this.data.lessons[i].description = desc;
        this.save();
    }

    /**
     * Set the description of a gif of a lesson at a given index
     * @param {*} i index of the lesson
     * @param {*} gifIndex index of the gif in the lesson
     * @param {*} desc new description
     */
    setGifDescription(i, gifIndex, desc) {
        this.data.lessons[i].gifs[gifIndex].description = desc.trim();
        this.save();
    }

    /**
     * Save the data to the browser cache
     */
    save() {
        storeData("lessonData", this.data);
    }

    /**
     * Load the data from the browser cache. If no data is found, a new data strucutre with an example lesson is set up.
     */
    load() {
        var temp = getData("lessonData");
        if (temp) {
            this.data = temp;
        } else {
            this.data = {
                lessons: [exampleLesson]
            };
        }
    }
}

/**
 * Sets up and gives access to the data singleton which is used throughout the application
 */
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

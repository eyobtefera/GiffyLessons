var LessonDataPlugin = function(){
    var lessonStore = this.namespace('lesson');
    return{
        set: function(super_fn, key, value){
            var lesson = lessonStore.get(key) || []
            lesson.push(value);
            lessonStore.set(key, lesson);
            return super_fn();
        },
        getGifs: function(key){
            return lessonStore.get(key);
        }
    }
}
store.addPlugin(LessonDataPlugin);

function storeLesson(lessonName, gif){
    store.set(lessonName, gif);
}

function getLesson(lessonName){
    return store.get(lessonName);
}

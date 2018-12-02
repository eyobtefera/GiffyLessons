var LessonDataPlugin = function(){
    var lessonStore = this.namespace('lesson');
    return{
        set: function(super_fn, lesson, gif){
            var lesson = lessonStore.get(key) || []
            lesson.push(gif);
            lessonStore.set(lesson, gif);
            return super_fn();
        },
        getGifs: function(lesson){
            return lessonStore.get(lesson);
        }
    }
}
store.addPlugin(LessonDataPlugin);

function storeLesson(lessonName, gif){
    store.set(lessonName, gif);
}

function getLesson(lessonName){
    store.getLesson("lesson");
}

window.onload = loadPage();

/**
 * Load the index page
 */
function loadPage() {
    Data.getModel().load();

    $("#newLessonButton").click(function(e) {
        var index = Data.getModel().createLesson();
        window.location.href = `edit.html?lessonIndex=${index}`;
    });

    loadLessons();
}

/**
 * Load the lessons
 */
function loadLessons() {
    $("#lessons").empty();
    var lessons = Data.getModel().getLessons();

    // display a message if there are no lessons.
    if (lessons.length === 0) {
        var html = `
            <div class="col-12">
                <div class="alert alert-secondary" role="alert">
                You don't have any created lessons. Click "New Lesson" to create one.
                </div>
            </div>
        `;
        var message = $.parseHTML(html);
        $("#lessons").append(message);
        return;
    }
    var i = 0;
    for (let lesson of lessons) {
        var lessonObj = createLesson(i, lesson);
        $("#lessons").append(lessonObj);
        i++;
    }
}

/**
 * Create the html card element of a lesson at an index
 * @param {*} i index of the lesson
 * @param {*} lesson the lesson object itself
 */
function createLesson(i, lesson) {
    var firstGif;
    if (lesson.gifs.length === 0) {
        firstGif = "img/defualt.png";
    } else {
        firstGif = lesson.gifs[0].url;
    }
    var name = lesson.name;
    var description = lesson.description;
    var html = `<div class="col-lg-4 col-sm-6 portfolio-item">
        <div class="card">
            <a href="view.html?lessonIndex=${i}"
                ><img class="card-img-top" src="${firstGif}" alt=""
            /></a>
            <div class="card-body">
                <h4 class="card-title">
                    <a href="view.html?lessonIndex=${i}">${name}</a>
                </h4>
                <p class="card-text">${description}</p>
            </div>
        </div>
    </div>`;

    return $.parseHTML(html);
}

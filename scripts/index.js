window.onload = loadPage();

function loadPage() {
    Data.getModel().load();

    $("#newLessonButton").click(function(e) {
        var index = Data.getModel().createLesson();
        window.location.href = `edit.html?lessonIndex=${index}`;
    });
    // .parent()
    // .prop("href", `edit.html?lessonIndex=${lessonIndex()}`);
    loadLessons();
}

// loads view
function loadLessons() {
    $("#lessons").empty();
    var lessons = Data.getModel().getLessons();
    if (lessons.length === 0) {
        var html = `
            <div class="col-12">
                <div class="alert alert-secondary" role="alert">
                You don't have any created lessons. Click  <a href="#" class="alert-link">here</a> to create one.
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

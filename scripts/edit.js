window.onload = loadPage();

function lessonIndex() {
    var vars = {};
    var parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
            vars[key] = value;
        }
    );
    return vars["lessonIndex"];
}

function loadPage() {
    $(function() {
        $("#includedLessons").sortable({
            cursur: "crosshair",
            revert: true,
            start: function(event, ui) {
                $(ui.item).data("startindex", ui.item.index());
            },
            stop: function(event, ui) {
                var startIndex = ui.item.data("startindex");
                var newIndex = ui.item.index();
                if (newIndex != startIndex) {
                    Data.getModel().reorderGifs(
                        lessonIndex(),
                        newIndex,
                        startIndex
                    );
                }
            }
        });
    });

    $("#lessonNameInput").val(Data.getModel().getLesson(lessonIndex()).name);

    $("#lessonNameInput").change(function() {
        Data.getModel().setLessonName(
            lessonIndex(),
            $("#lessonNameInput").val()
        );
    });

    $("#includedLessons").empty();
    var lesson = Data.getModel().getLesson(lessonIndex());
    loadLesson(lesson);
    refreshCallbacks();
}

function refreshFromData() {
    $("#includedLessons").empty();
    var lesson = Data.getModel().getLesson(lessonIndex());
    loadLesson(lesson);
    refreshCallbacks();
}

function loadLesson(lesson) {
    for (let gif of lesson.gifs) {
        var gifObj = createAddedGif(gif);
        $("#includedLessons").append(gifObj);
    }
}

function createAddedGif(gif) {
    var description = gif.description;
    var gifUrl = gif.url;
    var html =
        `<div class="col-lg-3 col-md-3 col-sm-4 col-xs-4 portfolio-item">
                    <div class="card h-100">
                        <img
                            class="card-img-top"
                            src="` +
        gifUrl +
        `"
                            alt=""
                        />
                        <div class="card-body">
                            <div class="form-group">
                                <label for="descriptionTextArea">
                                    Description:
                                </label>
                                <textarea
                                    class="form-control rounded-0"
                                    id="descriptionTextArea"
                                    rows="3"
                                >` +
        description +
        `</textarea>
                                <div class="text-center" style="width:100%">
                                    <button
                                        type="button"
                                        class="btn btn-danger btn-sm delete-gif-button"
                                        
                                    >
                                        <span
                                            class="glyphicon glyphicon-trash"
                                            aria-hidden="true"
                                        ></span>
                                        Delete Gif
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

    return $.parseHTML(html);
}

function refreshCallbacks() {
    var deleteButtons = $(".delete-gif-button");
    deleteButtons.click(function(e) {
        var index = $(this)
            .closest(".portfolio-item")
            .index();
        deleteGif(index);
    });
}

// Actions:

function deleteGif(index) {
    Data.getModel().removeGif(lessonIndex(), index);
    refreshFromData();
}

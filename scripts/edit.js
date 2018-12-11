window.onload = loadPage();

var searchResults;

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
    Data.getModel().load();

    $(function() {
        $("#includedLessons").sortable({
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

    $("#doneButton")
        .parent()
        .prop("href", `view.html?lessonIndex=${lessonIndex()}`);

    var confirmDeleteButton = $("#confirmDeleteButton");
    confirmDeleteButton.click(function(e) {
        Data.getModel().deleteLesson(lessonIndex());
        window.location.href = "index.html";
    });

    // search button callback
    var searchButton = $("#searchGifs");
    searchButton.click(function(e) {
        var text = $("#searchInput").val();
        searchGifs(text);
    });

    // set name of lesson from data structure
    if (Data.getModel().getLesson(lessonIndex())) {
        $("#lessonNameInput").val(
            Data.getModel().getLesson(lessonIndex()).name
        );
    } else {
        $("#lessonNameInput").val("");
    }

    // callback for changing name text
    $("#lessonNameInput").change(function() {
        Data.getModel().setLessonName(
            lessonIndex(),
            $("#lessonNameInput").val()
        );
    });

    // set name of lesson from data structure
    if (Data.getModel().getLesson(lessonIndex())) {
        $("#lessonDescriptionInput").val(
            Data.getModel().getLesson(lessonIndex()).description
        );
    } else {
        $("#lessonDescriptionInput").val("");
    }

    // callback for changing name text
    $("#lessonDescriptionInput").change(function() {
        Data.getModel().setLessonDescription(
            lessonIndex(),
            $("#lessonDescriptionInput").val()
        );
    });

    // clear then load gifs from lesson
    $("#includedLessons").empty();
    var lesson = Data.getModel().getLesson(lessonIndex());
    loadLesson(lesson);
    refreshCallbacks();
}

// empty and refresh view that shows gifs in lesson
function refreshFromData() {
    $("#includedLessons").empty();
    var lesson = Data.getModel().getLesson(lessonIndex());
    loadLesson(lesson);
    refreshCallbacks();
}

// loads view
function loadLesson(lesson) {
    if (lesson.gifs.length === 0) {
        var html = `
            <div class="col-12">
                <div class="alert alert-light" role="alert">
                    You don't have any gifs in this lesson yet. Add some below!
                </div>
            </div>
        `;
        var message = $.parseHTML(html);
        $("#includedLessons").append(message);
        return;
    }
    for (let gif of lesson.gifs) {
        var gifObj = createAddedGif(gif);
        $("#includedLessons").append(gifObj);
    }
}

function createAddedGif(gif) {
    var description = gif.description;
    var gifUrl = gif.images.fixed_height.url;
    var html = `<div class="col-lg-3 col-sm-4 col-xs-6 portfolio-item">
                    <div class="card h-100">

                    <div class="card-img-container">
                            <img
                                class="card-img-top"
                                src="${gifUrl}"
                                alt=""
                            />
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="descriptionTextArea">
                                    Description:
                                </label>
                                <textarea
                                    class="form-control rounded-0 gifDescription"
                                    id="descriptionTextArea"
                                    rows="3"
                                >${description}
                                 </textarea>
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
    deleteButtons.off();
    deleteButtons.click(function(e) {
        var index = $(this)
            .closest(".portfolio-item")
            .index();
        deleteGif(index);
    });

    var gifDescriptions = $(".gifDescription");
    gifDescriptions.off();
    gifDescriptions.change(function(e) {
        var index = $(this)
            .closest(".portfolio-item")
            .index();
        Data.getModel().setGifDescription(lessonIndex(), index, $(this).val());
    });

    var addButtons = $(".add-gif-button");
    addButtons.off();
    addButtons.click(function(e) {
        var index = $(this)
            .closest(".gif-container")
            .index();
        addGif(index);
        $("#includedLessons").scrollLeft($(document).outerWidth());
    });
}

function deleteGif(index) {
    Data.getModel().removeGif(lessonIndex(), index);
    refreshFromData();
}

function searchGifs(text) {
    $("#searchBarRow")
        .nextAll("div")
        .remove();
    if (!text || text === "") {
        var html = `<div class="row" id="searchAlert">
                <div class="col-12">
                    <div class="alert alert-warning" role="alert">
                        Please input a search query!
                    </div>
                </div>
            </div>`;
        var message = $.parseHTML(html);
        $("#searchBarRow").after(message);
        return;
    }

    var html = `<div class="loader"></div>`;
    var loader = $.parseHTML(html);
    $("#searchGifs").attr("disabled", "disabled");
    $("#searchGifs").html(loader);

    var searched = gifSearch(text, "pg").then(function(result) {
        console.log(result);
        searchResults = result;
        $("#searchGifs").html("Search");
        $("#searchGifs").removeAttr("disabled");
        var html = `<div class="row" id="gifs-output"></div>`;

        $("#searchBarRow").after($.parseHTML(html));

        for (let gif of result) {
            var gifObj = createSearchedGif(gif);
            $("#gifs-output").append(gifObj);
        }
        refreshCallbacks();
    });
}
function createSearchedGif(gif) {
    var gifUrl = gif.url;
    var html = `<div class="gif-container">
                <img src="${gif.url}" class="gif loadingImage">
                <div class="middle">
                    <button type="button" class="btn btn-success add-gif-button">Add</button>
                </div>
            </div>`;

    return $.parseHTML(html);
}

function addGif(index) {
    var selectedGif = searchResults[index];
    Data.getModel().addGif(lessonIndex(), selectedGif);
    refreshFromData();
}

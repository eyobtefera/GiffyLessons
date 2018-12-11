window.onload = loadPage();

var searchResults;

/**
 * Get the lesson index of the lesson being edited from the URL
 */
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

/**
 * Load the page. This function loads in the appropriate lesson from the cache.
 */
function loadPage() {
    Data.getModel().load();

    // set up sortable for the gifs to enable drag and drop
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

    // set link of the done button to the view page
    $("#doneButton")
        .parent()
        .prop("href", `view.html?lessonIndex=${lessonIndex()}`);

    // callback for the delete confirmed button
    var confirmDeleteButton = $("#confirmDeleteButton");
    confirmDeleteButton.click(function(e) {
        Data.getModel().deleteLesson(lessonIndex());
        window.location.href = "index.html";
    });

    // search button callback
    var searchButton = $("#searchGifs");
    var searchInput = $("#searchInput");
    searchButton.click(function(e) {
        var text = $("#searchInput").val();
        searchGifs(text);
    });

    // search when enter is pressed
    searchInput.keypress(function(e) {
        if (e.keyCode === 13) {
            var text = $("#searchInput").val();
            searchGifs(text);
        }
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

// loads view for this lesson
function loadLesson(lesson) {
    // if no gifs in lesson yet, display a message
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
    // load each gif in lesson into a card and display it
    for (let gif of lesson.gifs) {
        var gifObj = createAddedGif(gif);
        $("#includedLessons").append(gifObj);
    }
}

/**
 * Generate the element for a given gif
 * @param {*} gif gif object to add
 */
function createAddedGif(gif) {
    var description = gif.description;
    var gifUrl = gif.images.fixed_height.url;
    var html = `<div class="col-lg-3 col-sm-4 col-xs-6 portfolio-item">
                    <div class="card h-100">

                    <div class="card-img-container">
                            <img
                                class="card-img-top loadingImage"
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
                                >${description}</textarea>
                                <div class="text-center" style="width:100%">
                                    <button
                                        type="button"
                                        class="btn btn-danger btn-sm delete-gif-button"
                                        
                                    >
                                    <i class="fas fa-trash-alt"></i>
                                        
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

    return $.parseHTML(html);
}

/**
 * Refresh the callback methods on all the variable buttons.
 * This must be called for instance when a new gif is added to the lesson to set up the Delete Gif button
 */
function refreshCallbacks() {
    // Delete button callback
    var deleteButtons = $(".delete-gif-button");
    deleteButtons.off();
    deleteButtons.click(function(e) {
        var index = $(this)
            .closest(".portfolio-item")
            .index();
        deleteGif(index);
    });

    // Change gif description callback
    var gifDescriptions = $(".gifDescription");
    gifDescriptions.off();
    gifDescriptions.change(function(e) {
        var index = $(this)
            .closest(".portfolio-item")
            .index();
        Data.getModel().setGifDescription(lessonIndex(), index, $(this).val());
    });

    // Add button callback
    var addButtons = $(".add-gif-button");
    addButtons.off();
    addButtons.click(function(e) {
        var index = $(this)
            .closest(".gif-container")
            .index();
        addGif(index);
        $("#includedLessons").scrollLeft(100000);
        $(".add-gif-button")
            .eq(index)
            .html(`<i class="fas fa-check"></i>`);

        setTimeout(function() {
            $(".add-gif-button")
                .eq(index)
                .html(`<i class="fas fa-plus"></i>`);
        }, 5000);
    });
}

/**
 *  Delete a gif at a given index
 * @param {*} index index of gif to delete
 */
function deleteGif(index) {
    Data.getModel().removeGif(lessonIndex(), index);
    refreshFromData();
}

var previousQuery = "";
var page = 0;

/**
 * Searches and loads the results of the API call
 * @param {*} text search query
 */
function searchGifs(text) {
    page = 0;
    // Clear previous results
    $("#searchBarRow")
        .nextAll("div")
        .remove();

    // Display message if no text is entered
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

    // Start loader and disable search button
    var html = `<div class="loader"></div>`;
    var loader = $.parseHTML(html);
    $("#searchGifs").attr("disabled", "disabled");
    $("#searchGifs").html(loader);

    // Make query and set up callback
    previousQuery = text;
    var searched = gifSearch(text, "pg").then(function(result) {
        page = 1;
        searchResults = result;
        $("#searchGifs").html(`<i class="fas fa-search"></i>`);
        $("#searchGifs").removeAttr("disabled");
        var html = `<div class="row" id="gifs-output"></div>`;

        $("#searchBarRow").after($.parseHTML(html));

        // Append each result
        for (let gif of result) {
            var gifObj = createSearchedGif(gif);
            $("#gifs-output").append(gifObj);
        }
        refreshCallbacks();
    });
}

/**
 * Create card element for a given gif result
 * @param {*} gif object returned by the api
 */
function createSearchedGif(gif) {
    var gifUrl = gif.url;
    var html = `<div class="gif-container">
                <img src="${gif.url}" class="gif loadingImage">
                <div class="middle">
                    <button type="button" class="btn btn-outline-success add-gif-button"><i class="fas fa-plus"></i></button>
                </div>
            </div>`;

    return $.parseHTML(html);
}

/**
 * Add Gif from the search results to the lesson
 * @param {*} index
 */
function addGif(index) {
    var selectedGif = searchResults[index];
    Data.getModel().addGif(lessonIndex(), selectedGif);
    refreshFromData();
}

$(window).scroll(function() {
    if (page === 0) {
        return;
    }
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        queryMoreSearchedGifs(previousQuery, page * 25);
    }

    // handle scroll to top
    var height = $(window).scrollTop();
    if (height > 100) {
        $("#scrollToTopButton").fadeIn();
    } else {
        $("#scrollToTopButton").fadeOut();
    }
});

/*Scroll to top when arrow up clicked BEGIN*/

$(document).ready(function() {
    $("#scrollToTopButton").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
});

function queryMoreSearchedGifs(text, offset) {
    if (!text || text === "") {
        return;
    }

    // Make query and set up callback
    var searched = gifSearch(text, "pg", offset).then(function(result) {
        console.log(result);
        page++;
        console.log(page);
        searchResults = searchResults.concat(result);

        // Append each result
        for (let gif of result) {
            var gifObj = createSearchedGif(gif);
            $("#gifs-output").append(gifObj);
        }
        refreshCallbacks();
    });
}

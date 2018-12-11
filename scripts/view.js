window.onload = loadPage();

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
 * Loads the view of the page, setting up elements based on the selected lesson.
 */
function loadPage() {
    Data.getModel().load();

    $(".carousel").carousel();

    $("#gifCarousel").empty();
    $("#gifCarousel").append(createCarousel());

    $("#lessonName").text(Data.getModel().getLesson(lessonIndex()).name);
    $("#lessonDescription").html(
        `<span style="font-family: 'rubikmedium'">Description: </span> ${
            Data.getModel().getLesson(lessonIndex()).description
        }`
    );

    $("#editLessonButton")
        .parent()
        .prop("href", `edit.html?lessonIndex=${lessonIndex()}`);
}

/**
 * Create the image carousel for displaying the gifs in the lesson.
 */
function createCarousel() {
    var gifs = Data.getModel().getLesson(lessonIndex()).gifs;

    // Display a message if there are no gifs
    if (gifs.length === 0) {
        var html = `
            <div class="alert alert-secondary" role="alert">
            This lesson doesn't have any gifs yet. Edit the lesson to add some!
            </div>
        `;
        var message = $.parseHTML(html);

        return message;
    }

    // Build the carousel
    var indicators = ``;

    for (var i = 0; i < gifs.length; i++) {
        var activeString = "";
        if (i === 0) {
            activeString = `class="active"`;
        }
        indicators += `<li
            data-target="#carouselExampleIndicators"
            data-slide-to="${i}"
            ${activeString}
        ></li>`;
    }

    var gifStrings = ``;

    for (var i = 0; i < gifs.length; i++) {
        var activeString = "";
        if (i === 0) {
            activeString = `active`;
        }
        gifStrings += createGifString(i, gifs[i], activeString);
    }

    var html = `<div
        id="carouselExampleIndicators"
        class="carousel"
        data-interval="false"
        data-ride="carousel"
    >
        <ol class="carousel-indicators">
            ${indicators}
        </ol>
        <div class="carousel-inner">
            ${gifStrings}
        </div>
        <a
            class="carousel-control-prev"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="prev"
        >
            <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
            ></span>
            <span class="sr-only">Previous</span>
        </a>
        <a
            class="carousel-control-next"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="next"
        >
            <span
                class="carousel-control-next-icon"
                aria-hidden="true"
            ></span>
            <span class="sr-only">Next</span>
        </a>
    </div>`;
    return $.parseHTML(html);
}

/**
 * Create the html in the carousel to contain the actual image
 * @param {*} index index of the gif
 * @param {*} gif the gif object
 * @param {*} activeString whether or not the gif is active
 */
function createGifString(index, gif, activeString) {
    return `<div class="carousel-item  ${activeString}">
        <img
            class="d-block loadingImage"
            src="${gif.images.fixed_height.url}"
            alt="Step ${index + 1}"
        />
        <div class="carousel-caption d-none d-md-block">
            <h5 class="stepHeader">Step ${index + 1}</h5>
            <p class="stepDescription">${gif.description}</p>
        </div>
    </div>`;
}

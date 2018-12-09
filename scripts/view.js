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
    Data.getModel().load();

    $(".carousel").carousel();

    $("#gifCarousel").empty();
    $("#gifCarousel").append(createCarousel());

    $("#lessonName").text(Data.getModel().getLesson(lessonIndex()).name);

    $("#editLessonButton")
        .parent()
        .prop("href", `edit.html?lessonIndex=${lessonIndex()}`);
}

function createCarousel() {
    var gifs = Data.getModel().getLesson(lessonIndex()).gifs;

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
        class="carousel slide"
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

function createGifString(index, gif, activeString) {
    return `<div class="carousel-item  ${activeString}">
        <img
            class="d-block w-100"
            src="${gif.url}"
            alt="Step ${index + 1}"
        />
        <div class="carousel-caption d-none d-md-block">
            <h5>Step ${index + 1}</h5>
            <p>${gif.description}</p>
        </div>
    </div>`;
}

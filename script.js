var episodesArr = [];

function showOptions(show) {
    var queryURL = "https://www.episodate.com/api/search?q=" + show + "&page=1";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var all = response.tv_shows;
        all.forEach(function(show) {
            var optionDiv = $("<div>");
            optionDiv.attr("data-id", show.id);
            optionDiv.addClass("option-div");
            var name = $("<h3>");
            name.text(show.name);
            var image = $("<img>");
            image.attr("src", show.image_thumbnail_path);
            image.addClass("option-img");
            optionDiv.attr("data-src", show.image_thumbnail_path);
            optionDiv.append(name, "<br>", image);
            $("#search-options").append(optionDiv, "<hr>");
        })
    })
}

function getEpisodes(show) {
    var queryURL = "https://www.episodate.com/api/show-details?q=";
    $.ajax({
        url: queryURL + show,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var episodes = response.tvShow.episodes;
        episodes.forEach(function(episode) {
            episode = {show: response.tvShow.name, ...episode};
            episode.air_date = moment(episode.air_date).format("LL");
            episodesArr.push(episode);
        });
    })
}

function sortShows() {
    episodesArr.sort((a,b)=>moment(a.air_date)-moment(b.air_date));
    episodesArr.forEach(function(episode) {
        var show = episode.show;
        var season = episode.season;
        var episodeNum = episode.episode;
        var name = episode.name;
        var date = episode.air_date;
        var element = $("<div>");
        element.addClass("ml-3");
        var showDisplay = $("<h3>");
        showDisplay.addClass("mt-2");
        showDisplay.text(show + ": Season " + season + " Episode " + episodeNum);
        var nameDate = $("<h5>");
        nameDate.addClass("mt-n2");
        nameDate.text(name + " (" + date + ")");
        element.append(showDisplay, nameDate, "<hr>");
        $("#episode-list").append(element);
    })
}

$("#add").on("click", function(event) {
    event.preventDefault();
    var show = $("#show-name").val().split(" ").join("-");
    showOptions(show);
    $("#show-name").val("");
    $("#search").css("display", "block");
});

$("#search-options").on("click", "div.option-div", function() {
    var id = $(this).data("id");
    var imageSrc = $(this).data("src");
    var image = $("<img>");
    image.attr("src", imageSrc);
    image.addClass("selected mr-1");
    $("#chosen").append(image);
    getEpisodes(id);
    $("#search").css("display", "none");
    $("#search-options").empty();
})

$("#sort").on("click", function(event) {
    event.preventDefault();
    $("#episode-list").empty();
    sortShows();
})

$("#clear").on("click", function() {
    $("#episode-list").empty();
    $("#chosen").empty();
    episodesArr.splice(0);
})

//tvmaze.com
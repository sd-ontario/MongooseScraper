


require("../controllers/scraper")(app);

$.getJSON("/articles", function(data) {

    for(let i = 0; i < data.length; i++) {

        $("#articles").append("<h1>" + data[i].title + "</h1>");
    }

});


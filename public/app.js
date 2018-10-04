$(document).ready(function() {

    $("#scrape").on("click", function(event){
        event.preventDefault();

        $.ajax({
            method: "GET",
            url: "/articles"
        }).then(function(data){

            let source = $("#article-list").html();
            let template = Handlebars.compile(source);
            let data = data;

            $("body").append(template(data));
        });
    });
});
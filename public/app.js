$(document).ready(function() {

    $.getJSON("/articles", function(data){
        for(let i = 0; i < data.length; i++)
        console.log(data[i]);
        let hbsObject = data[i];
        res.render("home", hbsObject);
    });
});
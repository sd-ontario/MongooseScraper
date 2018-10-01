const path = require("path");
const router = require('express');





module.exports = function(app){
    app.get("/", function(req, res) {
        res.render("index");
    });
}
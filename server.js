var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


const logger = require("morgan");

var PORT = process.env.PORT || 8080;

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Import routes and give the server access to them.
require("./routes/html")(app);


//THE SCRAPER STARTS HERE
//****************************************************************** */
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");




console.log("\n******************************************\n" +
            "Look at the image of every award winner in \n" +
            "one of the pages of `nytimes.com`. Then,\n" +
            "grab the image's source URL." +
            "\n******************************************\n");

// Make request via axios to grab the HTML from `awwards's` clean website section
axios.get("https://www.nytimes.com/").then(function(response) {

  // Load the HTML into cheerio
  var $ = cheerio.load(response.data);

  // Make an empty array for saving our scraped info
  var results = [];

  // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
  $("article").each(function(i, element) {

    /* Cheerio's find method will "find" the first matching child element in a parent.
     *    We start at the current element, then "find" its first child a-tag.
     *    Then, we "find" the lone child img-tag in that a-tag.
     *    Then, .attr grabs the imgs srcset value.
     *    The srcset value is used instead of src in this case because of how they're displaying the images
     *    Visit the website and inspect the DOM if there's any confusion
    */

    
    var div = $(element).find("a").attr("href");
    var title = $(element).find("h2").text();
    let placeholder = $(element).find("p").text();

    function fillSubText(text) {

        if(text == ''){
            let subTitle = $(element).find("li").text();
            return subTitle;
        } else {
            let subTitle = $(element).find("p").text();
            return subTitle;
        }
    };

    var subTitle = fillSubText(placeholder);

    function noSubText(text) {

      if(text == ''){
        let subTitle = "No subtitle available, click the link to explore article"
        return subTitle;
      } else {
        return text;
      }
    };

    var finalSub = noSubText(subTitle);

    // Push the image's URL (saved to the div var) into the results array
    results.push({ link: div }, {text: title}, {subText: finalSub});

    var entry = {}
    entry.link = div;
    entry.title = title;
    entry.subTitle = finalSub;

    db.article.create(entry).then(function(dbArticle){
      console.log(dbArticle);
    }).catch(function(err) {
      return res.json(err);
    })
  });
});

app.get("/articles", function(req, res) {

  db.article.find({}).then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});

app.get("/articles/:id", function(req, res) {

  db.article.findOne({_id: req.params.id})
    .populate("note").then(function(dbArticle) {
      res.json(dbArticle);
    }).catch(function(err) {
      res.json(err);
    });
  });

app.post("/articles/:id", function(req, res) {

  db.note.create(req.body).then(function(dbNote) {

    return db.article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
  }).then(function(dbArticle){
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});




//SCRAPER ENDS HERE
//***********************************************************************8 */


 







// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});

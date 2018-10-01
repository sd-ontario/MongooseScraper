const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {

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
  });

  // After looping through each element found, log the results to the console
  console.log(results);
});
}



 




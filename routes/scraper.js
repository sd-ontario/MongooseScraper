const path = require("path");
const router = require('express');



    app.get("/scrape", function(req, res){

        axios.get("https://www.nytimes.com/").then(function(response){

            const $ = cheerio.load(response.data);

            //Grab every a within an article tag
            $("article a").each(function(i, element){

                let result = {};

                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");
            
                    db.Article.create(result)
                        .then(function(dbArticle) {
                            console.log(dbArticle);
                        })
                        .catch(function(err){
                            return res.json(err);
                        });

            });
        });
        
    });

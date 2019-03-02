var app = require("express").Router();
var db = require("../models");

// Routes
// A GET route for scraping the Free Beacon website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  request("http://freebeacon.com/columns/", function (error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("header").children("h2").text();
      result.link = $(this).children("header").children("h2").children("a").attr("href");
      result.condensed = $(this).children(".subheadline").children("a").text();
      
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log("db article = " + dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

//GET requests to render home.handlebars pages
app.get("/", function (req, res) {
  db.Article.find({
    "saved": false
  }, function (error, data) {
    var hbsObject = {
      article: data
    };
    // console.log(hbsObject);
    res.render("home", hbsObject);
  });
});

// POST request to save an article
app.post("/articles/saved/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({
      "_id": req.params.id
    }, {
      "saved": true
    })
    // Execute the above query
    .exec(function (err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      } else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

// Post request to delete an saved status on article
app.post("/articles/delete/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({
      "_id": req.params.id
    }, {
      "saved": false,
      "notes": []
    })
    // Execute the above query
    .exec(function (err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      } else {
        // Or send the document to the browser
        
      }
    });
});

//GET request to go to savedArticles.handlebars and render saved articles
app.get("/saved", function (req, res) {
  db.Article.find({
    "saved": true
  }).populate("notes").exec(function (error, articles) {
    var hbsObject = {
      article: articles
    };
    res.render("savedArticles", hbsObject);
  });
});

// POST request for attaching note to its' corresping article id.
app.post("/notes/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    console.log("this is posted");
});


// Route for getting all Articles from the db
// output is JSON plain text
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
module.exports = app;

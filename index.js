let express = require("express");
let PORT = process.env.PORT || 4000;
let app = express();
let path = require('path');
let http = require('http');

var axios = require('axios');
var cheerio = require('cheerio');
var mongoose = require("mongoose"); // Require Mongoose to store idioms in database

var Idiom = require("./models/idioms.js");//Requiring the `Idioms` model for accessing the `idioms` collection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/idioms_db";
mongoose.connect(MONGODB_URI);

// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + "./public/index.html"));
})

var scrape = function(searchTerm) {
    var idioms = [];
    return axios.get("https://idioms.thefreedictionary.com/" + searchTerm).then(function(response) {
   
        var $ = cheerio.load(response.data);
       
          var listItems = $("ul.idiKw li a").each(function(i, elem) {
            let obj = {
                idiom: $(elem).text(),
                link: "https://thefreedictionary.com/" + $(elem).attr("href")
            };
            idioms.push(obj);
        });
  
        return idioms;
    });
     console.log(idioms);
  }
app.post('/idioms/scrape/:searchTerm', function(req, res) {
scrape(req.params.searchTerm)
.then(function(foundIdioms) {
    console.log("scraped:");
    console.log(foundIdioms);
    // Save scraped Idioms
    foundIdioms.forEach(function(eachIdiom) {
        Idiom.create(eachIdiom)
        .then(function(savedIdiom) {
            // If saved successfully, print the new Idiom document to the console
            console.log(savedIdiom);
        })
        .catch(function(err) {
            // If an error occurs, log the error message
            console.log(err.message);
        });
    });
   

    res.json(foundIdioms);
})
.catch(function(err) {
    res.json(err);
});

});


  
app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});

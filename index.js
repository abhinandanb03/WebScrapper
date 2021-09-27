let express = require("express");
let PORT = process.env.PORT || 4000;
let app = express();
let path = require('path');

var axios = require('axios');
var cheerio = require('cheerio');

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

app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});
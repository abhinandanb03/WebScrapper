let express = require("express");
let PORT = process.env.PORT || 4000;
let app = express();
let path = require('path');
// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + "./public/index.html"));
})

app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});
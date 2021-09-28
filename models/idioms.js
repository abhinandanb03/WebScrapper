var mongoose = require("mongoose");

// Get the schema constructor
var Schema = mongoose.Schema;

// Use the Schema constructor to create a new IdiomSchema object
var IdiomSchema = new Schema({
  idiom: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: false
  }
});

// Create model from schema using model method
var Idiom = mongoose.model("Idiom", IdiomSchema);

// Export the Idiom model
module.exports = Idiom;
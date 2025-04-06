const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    
  },
  location: {
    type: String,
    
  },
  description: {
    type: String,
    
  },
  image: {
    filename: String,
    url: String,
    
  },
  country :{
    type : String,
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

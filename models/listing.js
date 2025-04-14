const mongoose = require("mongoose");
const Review = require("./review");
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
  },
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner :{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
  //  console.log("Deleting Reviews for listing:", listing._id);
    const deleted = await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log("Deleted Reviews:", deleted.deletedCount);

    console.log("Listing deleted:", listing._id);
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

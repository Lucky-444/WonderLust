const express = require("express");
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLost";
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");

const app = express();

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

async function main() {
  // Connect to MongoDB
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings: allListings });
});

//New Route
app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

//show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing: listing });
});

// Crete Route
app.post("/listings", async (req, res) => {
  //let {title, description ,image, price, location, country} = req.body;
  let listing = req.body.listing;
  let newListing = new Listing(listing);
  await newListing.save();
  // console.log(listing);
  res.redirect("/listings");
});


//Update Route
app.put("/listings/:id", async (req, res) =>{
  let { id } = req.params;
  
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing: listing });
});

//Delete Route
app.delete("/listings/:id", async (req, res) =>{
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

























// app.get("/testlisting", async(req, res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "This is a beautiful villa in the heart of London. It has everything you need for a luxurious stay.",
//         price : 10000 ,
//         location : "London, United Kingdom",
//         country : "United Kingdom"
//     })

//     await sampleListing.save();

//     console.log("Saved sample list");
//     res.send("Sample listing saved to database!");
// });

app.listen(8080, () => {
  console.log(`Server running on port ${port}`);
});

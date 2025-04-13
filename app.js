const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLost";
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");

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
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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
  const listing = await Listing.findById(id).populate('reviews');
  res.render('listings/show.ejs', { listing });
});

// Crete Route
app.post("/listings", async (req, res, next) => {
  //let {title, description ,image, price, location, country} = req.body;
  try {
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    await newListing.save();
    // console.log(listing);
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing: listing });
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const result = await Listing.findByIdAndDelete(id);
  console.log("deleted listing :", result);


  res.redirect("/listings");
});

//reviews Route
app.post(
  "/listings/:id/reviews",
  wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("saved Review :", newReview);

    res.redirect(`/listings/${req.params.id}`);
  })
);




//delete reviews Route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);



//custom 404 page
app.use((err, req, res, next) => {
  // console.error(err);
  // res.status(500).send("Something broke!");
  // res.render("error.ejs", { error: err });
  let { message = "page not Found ", status } = err;

  res.status(status || 500).send(message);
});

app.listen(3000, () => {
  console.log(`Server running on port ${port}`);
});

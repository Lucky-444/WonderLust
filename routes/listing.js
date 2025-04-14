const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const { isLoggedInUser, isOwner } = require("../middleware");
const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLost";
const Listing = require("../models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const { console } = require("inspector/promises");

//index Route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings: allListings });
});

//New Route
router.get("/new", isLoggedInUser, (req, res) => {
  res.render("listings/new.ejs");
});

//show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    console.log(listing);

    res.render("listings/show.ejs", { listing });
  })
);

// Crete Route
router.post("/", isLoggedInUser, async (req, res, next) => {
  //let {title, description ,image, price, location, country} = req.body;
  try {
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    await newListing.save();
    // console.log(listing);
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

//Update Route
router.put("/:id", isLoggedInUser, isOwner, async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//edit route
router.get("/:id/edit", isLoggedInUser, isOwner, async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing: listing });
});

//Delete Route
router.delete("/:id", isLoggedInUser, isOwner, async (req, res) => {
  let { id } = req.params;
  const result = await Listing.findByIdAndDelete(id);
  console.log("deleted listing :", result);

  res.redirect("/listings");
});

module.exports = router;

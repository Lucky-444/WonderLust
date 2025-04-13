const express = require("express");
const router = express.Router();

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


//index Route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings: allListings });
});

//New Route
router.get("/new", async (req, res) => {
  res.render("listings/new.ejs");
});

//show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  res.render('listings/show.ejs', { listing });
});

// Crete Route
router.post("/", async (req, res, next) => {
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
router.put("/:id", async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//edit route
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing: listing });
});

//Delete Route
router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  const result = await Listing.findByIdAndDelete(id);
  console.log("deleted listing :", result);


  res.redirect("/listings");
});

module.exports = router;

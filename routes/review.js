const express = require("express");
const router = express.Router({mergeParams: true});

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



//post Review Route
//reviews Route
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    console.log(req.params.id);//read About merge params

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
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;




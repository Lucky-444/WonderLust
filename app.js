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
const listings = require("./routes/listing");
const reviews = require("./routes/review");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews);


app.get("/", (req, res) => {
  res.send("Hello, World!");
});


//custom 404 page
app.use((err, req, res, next) => {
  let { message = "page not Found ", status } = err;
  res.status(status || 500).send(message);
});

app.listen(3000, () => {
  console.log(`Server running on port ${port}`);
});



require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const MONGO_URL = process.env.CONNECTION_STRING;

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
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routes/user");



const session = require("express-session");

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


app.use(express.json());
app.use(cookieParser());



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const sessionOption = {
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
    
  },
};



app.get("/", (req, res) => {
  res.send("Hello, World!");
});


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/demo", async(req, res) => {
  let fakeUser = new User({email : "user@getMaxListeners.com", username: "testuser" });
  let userreg = await User.register(fakeUser, "password");
  console.log(userreg);
  res.send("User registered successfully!");
  });





app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews);
app.use("/", userRouter);


//custom 404 page
app.use((err, req, res, next) => {
  let { message = "page not Found ", status } = err;
  res.status(status || 500).send(message);
});

app.listen(3000, () => {
  console.log(`Server running on port ${port}`);
});



const mongoose = require("mongoose");
const data = require("./data");

const Listing = require("../models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLost";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  data.data = data.data.map((obj) => ({
    ...obj,
    owner: "67fd2f73d64f1882ab648706",
  }));
  await Listing.insertMany(data.data);
  console.log("Database initialized with sample data");
};

initDB();

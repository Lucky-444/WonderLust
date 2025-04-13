const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  // you can add custom fields here
  email: String,
  // username and password will be handled by passport-local-mongoose
  // password will be handled by passport-local-mongoose
});

// Apply plugin to schema, not to model
userSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model('User', userSchema);

// This will create a new collection in the database called 'users' and will use the userSchema to define the structure of the documents in that collection.
// The passport-local-mongoose plugin will add the following fields to the userSchema:
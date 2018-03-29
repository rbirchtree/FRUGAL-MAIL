const mongoose = require('mongoose');

//set up schema for a blog post
const mailSchema = mongoose.Schema({
  description: String,
  to: String,
  from: String,
  ship_date: Date,
  recieve_date: Date,
  shipped: Boolean,
  courier: String
});

//create the model for the database
const Post = mongoose.model('Post', postSchema);

//export the model
module.exports = {Post};

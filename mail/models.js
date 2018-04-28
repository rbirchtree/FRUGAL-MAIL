'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mailSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  toWhere: {
    type: String,
    required: true,
  },
  fromWhere:{
    type: String,
    required: true,
  },
  tripDate: {
    type: String,
    required: true
  },
  mailingTravelingStatus: {
    type: String,
    required: true
  },
  mailingAddress: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});
 
 const Mail = mongoose.model('Mail',mailSchema);

//export the model
module.exports = {Mail};

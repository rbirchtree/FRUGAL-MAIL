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
/*  shipped: {
    type: Boolean,
    required: true
    refactor later
  },*/
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
  // return options of delete update only to matching userNames refactor later
});
 
 const Mail = mongoose.model('Mail',mailSchema);

//export the model
module.exports = {Mail};

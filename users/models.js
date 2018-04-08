'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

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
    type: Date,
    required: true
  },
  shipped: {
    type: Boolean,
    //expires on tripdate and deletes
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
  // return options of delete update only to matching userNames
});
 
 const Mail = mongoose.model('Mail',mailSchema);

module.exports = {User, Mail};

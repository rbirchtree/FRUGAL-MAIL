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
  to: {
    type: String,
    required: true,
  },
  from:{
    type: String,
    required: true,
  },
  shipDate: {
    type: Date,
    required: true
  },
  received: {
    type: Date,
    required: true
  },
  shipped: {
    type: Boolean,
    required: true
  },
  courier: {
    type: String,
    required: true
  }
});
 
 const Mail = mongoose.model('Mail',mailSchema);

module.exports = {User, Mail};

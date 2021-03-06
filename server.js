'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const app = express();
const { router: usersRouter } = require('./users');

const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const { router: mailRouter } = require('./mail');
mongoose.Promise = global.Promise;
// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use(morgan('common'));

const { PORT, DATABASE_URL } = require('./config');
console.log('DATABASE_URL',DATABASE_URL);
app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname +'/images'));
app.use('/api/users/',usersRouter);

app.use('/api/auth/', authRouter);
app.use('/newmail/', mailRouter);
//auto redirect for next?



app.get('/',(req,res) => {  
  res.sendFile(__dirname +'/public/index.html');
  return res.sendStatus(200);
  
});


app.get('/about',(req,res) => {
  return res.sendFile(__dirname +'/public/about.html');
});

app.get('/demo',(req,res)=> {
  return res.sendStatus(200);
});

app.get('/logout', function(req,res){
  res.redirect('/');
  req.logout();
});

app.use('*', (req, res) => {
  return res.sendStatus(404)
});


let server;

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

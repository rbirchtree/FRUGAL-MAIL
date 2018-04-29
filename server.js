'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const app = express();
const { router: usersRouter } = require('./users');
//what is userRouter?
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
/*router is renamed locally*/
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

app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname +'/images'));
app.use('/api/users/',usersRouter);
//set link to html how?
app.use('/api/auth/', authRouter);
app.use('/newmail/', mailRouter);
//auto redirect for next?



app.get('/',(req,res) => {
  //how to redirect any url
  res.sendFile(__dirname +`/public/index.html`);
  return res.status(200);
  //add user
});


app.get('/about',(req,res) => {
  res.sendFile(__dirname +`/public/about.html`);
  return res.status(203);
});

app.get('/logout', function(req,res){
  req.logout();
  res.sendFile(__dirname + '/public/index.html');
  return res.status(200);
});

app.use('*', (req, res) => {
  return res.status(404)//.json({ message: '404 Not Found' });
});



// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object

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

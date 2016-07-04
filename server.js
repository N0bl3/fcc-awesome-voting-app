/* eslint-disable no-unused-vars */
const async = require('async');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debugServer = require('debug')('server');
const debugDB = require('debug')('database');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const request = require('request');
const routes = require('./routes/all');
/* eslint-enable no-unused-vars */

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

app.post('/login', routes.authenticate);

// Create
app.post('/poll/:pollID', routes.createPoll);
app.post('/poll/:pollID/option/:option', routes.createPollOption);

//  Read
app.get('/poll/:pollID', routes.getPoll);
app.get('/user/:userID/polls', routes.listUserPolls);

//  Update
app.get('/poll/:pollID', routes.sharePoll);
app.get('/poll/:pollID/vote/:vote', routes.votePoll);

// Delete
app.delete('/poll/:pollID', routes.deletePoll);
app.delete('/poll/:pollID/option/:option', routes.deletePollOption);

// Server operations
app.listen(app.get('port'), () => {
  debugServer(`App starting on port ${app.get('port')}`);
});
if (process.env.MONGO_URI) {
  MongoClient.connect(process.env.MONGO_URI, (err, db) => {
    if (err) {
      debugDB(`Unable to connect to the mongoDB server. Error: ${err}`);
    } else {
      debugDB('Connection established to MongoDB');
      db.close();
    }
  });
}

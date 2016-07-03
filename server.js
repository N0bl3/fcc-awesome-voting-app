/* eslint-disable no-unused-vars */
const async = require('async');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debugServer = require('debug')('server');
const express = require('express');
const path = require('path');
const request = require('request');
const routes = require('./routes/all');
/* eslint-enable no-unused-vars */

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

app.listen(app.get('port'), () => {
  debugServer(`App starting on port ${app.get('port')}`);
});

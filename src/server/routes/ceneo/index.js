const ceneo = require('express').Router();
const extract = require('./extract');


ceneo.get('/extractPhrase', extract);


module.exports = ceneo;
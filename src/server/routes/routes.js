const routes = require('express').Router();
const ceneo = require('./ceneo');

routes.use('/', ceneo);

routes.get('/', function (req, res) {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;



var express = require('express'),
    app = express(),
    geocoder = require('../app/api/geocoder_wrapper');

geocoder.computeLocation('2160 rue de rouen, Montreal');

module.exports = app;

var
    express = require('express'),
    app = express(),
    Geocoder = require('../app/api/geocoder_wrapper');


var geocoder = new Geocoder();
address = geocoder.computeLocationFromAddress('2160 rue de rouen, Montreal');

module.exports = app;

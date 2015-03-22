(function () {
    "use strict";

    var http = require('http');

    module.exports = function Geocoder() {

        // Public methods
        this.computeLocationFromAddress = function (address) {
            var body = '',
                result = {};
            http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + address, function (response) {
                var request = response.on('data', function (chuck) {
                    body += chuck;
                });
                response.on('end', function () {
                    if (response.statusCode === 200) {
                        var parsedBody = JSON.parse(body);
                        if (parsedBody) {
                            result = getLocationFrom(parsedBody);
                        } else {
                            throw {
                                name: 'JsonParsingError',
                                message: 'The json was not correctly parsed'
                            };
                        }
                    }
                    else {
                        throw {
                            message: 'Error: status code <> 200 on request: ' + request
                        };
                    }
                });
            });
            //Because google api response is asynchronous
            setTimeout(function () {
                console.log('Address: ' + result.formattedAddress);
                console.log("Latitude: " + getLatitudeFrom(result.geometry.location));
                console.log("Longitude: " + getLongitudeFrom(result.geometry.location));
            }, 2000);
            //TODO: find a way to return the value
            return result;
        };

        // Private methods
        var getLocationFrom = function (parsedBody) {
            var result = {},
                index = 0;
            if (parsedBody.hasOwnProperty('results')) {
                var results = parsedBody.results;
                for (; index < results.length; index++) {
                    var indexedResult = results[index];
                    if (indexedResult.hasOwnProperty('geometry')) {
                        result.geometry = indexedResult.geometry;
                    }
                    if (indexedResult.hasOwnProperty('formatted_address')) {
                        result.formattedAddress = indexedResult.formatted_address;
                    }
                }
            } else {
                throw  {
                    name: 'PropertyNotFound',
                    message: 'Unable t process the location provided ' + error
                };
            }
            return result;
        };

        var getLongitudeFrom = function (location) {
            var longitude = '';
            if (location && location.hasOwnProperty('lng')) {
                longitude = location.lng;
            } else {
                throw {
                    name: 'PropertyNotFound',
                    message: 'Invalid location provided' + location
                };
            }
            return longitude;
        };

        var getLatitudeFrom = function (location) {
            var latitude = '';
            if (location && location.hasOwnProperty('lat')) {
                latitude = location.lat
            } else {
                throw {
                    name: 'InvalidLocation',
                    message: 'Invalid location provided' + location
                };
            }
            return latitude;
        };
    };
})
();
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
                        result = getLocationFrom(body);
                    } else {
                        new Error('Error: status code <> 200 on request: ' + request);
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
        var getLocationFrom = function (address) {
            var result = {};
            try {
                var index = 0;
                var parsedBody = JSON.parse(address);
                for (; index < parsedBody.results.length; index++) {
                    result.geometry = parsedBody.results[index].geometry;
                    result.formattedAddress = parsedBody.results[index].formatted_address
                }
            } catch (error) {
                new Error('Unable t process the location provided ' + error);
            }
            return result;
        };

        var getLongitudeFrom = function (location) {
            var longitude = '';
            if (location && location.hasOwnProperty('lng')) {
                longitude = location.lng;
            } else {
                new Error('Invalid location provided' + location);
            }
            return longitude;
        };

        var getLatitudeFrom = function (location) {
            var latitude = '';
            if (location && location.hasOwnProperty('lat')) {
                latitude = location.lat
            } else {
                new Error('Invalid location provided' + location);
            }
            return latitude;
        };
    };
})();
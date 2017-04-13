/*global $*/
'use strict';


// External libraries
var AJAX_SPINNER, DATA_DISPLAY,

    // The global variables for this applicaiton
    SERVER_COMMUNICATION =
    {
        // h5serv has an issue with full hostnames - dumb fix here
        hdf5DataServer: window.location.protocol + '//' +
                        window.location.hostname.replace('.maxiv.lu.se',
                        '') + ':6050',
                        // '') + ':5000',

        // Send a request to the HDF5 REST server
        ajaxRequest : function (url, debug) {

            // Send an ajax request to the server - the return value is the
            // response
            return $.ajax({

                url: url,

                success: function (response) {

                    var key = '';

                    if (debug) {
                        console.log("AJAX " + url + " request success");
                        console.log(response);

                        for (key in response) {
                            if (response.hasOwnProperty(key)) {
                                console.log(key + " -> " + response[key]);
                            }
                        }
                    }

                },


                error: function (x, status, error) {
                    if (x.status === 403) {
                        DATA_DISPLAY.enableImagePlotControls(false, false);
                        DATA_DISPLAY.drawText(
                            'Sorry, I can\'t let you look at that',
                            'You need to get permission first',
                            '#ad3a74'
                        );
                        console.log(
                            'HTTP 403: Forbidden (Access is not permitted)'
                        );
                    } else {
                        console.log("An error occurred: " + status +
                            "nError: " + error);
                    }
                },

                // Settings used in all ajax requests
                type: 'GET',
                dataType: 'json',
                xhrFields: { withCredentials: true },
                async: true,
                cache: false,
                timeout: 20000
            });

        },

    };


// This function fires when the page is loaded
$(document).ready(function () {

    var debug = false;

    if (debug) {
        console.log('document is ready');
    }

});

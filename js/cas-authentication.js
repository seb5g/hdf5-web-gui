/*global $*/
'use strict';

// External libraries
var SERVER_COMMUNICATION, FILE_NAV, DATA_DISPLAY, PAGE_LOAD, Cookies,

    // The gloabl variables for this applicaiton
    CAS_AUTH =
    {
        displayName : null,
        isLoggedIn : false,
        casServer : 'https://cas.maxiv.lu.se/cas',
        serviceUrl : window.location.protocol + '//' + window.location.hostname
            + '/hdf5-web-gui/html/app.html',

        executeServerFunction : function (serverUrl) {

            return $.when(SERVER_COMMUNICATION.ajaxRequest(serverUrl)).then(
                function (response) {

                    var debug = false, key = '';

                    if (debug) {
                        for (key in response) {
                            if (response.hasOwnProperty(key)) {
                                console.log(key + " -> ");
                                console.log(response[key]);
                            }
                        }
                    }

                    if (response.hasOwnProperty('displayName')) {
                        CAS_AUTH.displayName = response.displayName;
                        if (debug) {
                            console.log('First name: ' + CAS_AUTH.displayName);
                        }
                    }

                    return response.message;
                }
            );
        },

        // Check if there is a cookie created by the HDF5 server that contains
        // CAS information. If so, this should mean that the user has logged
        // in.  Return true or false.
        cookieCheckServer : function () {

            var debug = true, cookieCheckUrl =
                SERVER_COMMUNICATION.hdf5DataServer + '/cookiecheck';

            if (debug) {
                console.log('cookieCheckUrl: ' + cookieCheckUrl);
            }

            return CAS_AUTH.executeServerFunction(cookieCheckUrl);
        },


        // Send a CAS server ticket to the HDF5 server, which will then
        // verify the ticket and create a cookie containing CAS information
        ticketCheckServer : function (casTicket) {

            var debug = false, ticketCheckUrl =
                SERVER_COMMUNICATION.hdf5DataServer + '/ticketcheck' +
                '?ticket=' + casTicket;

            if (debug) {
                console.log('ticketCheckUrl: ' + ticketCheckUrl);
            }

            return CAS_AUTH.executeServerFunction(ticketCheckUrl);
        },


        // Removes the cookie created by the HDF5 server
        logoutServer : function () {

            var debug = false, logoutUrl =
                SERVER_COMMUNICATION.hdf5DataServer + '/logout';

            if (debug) {
                console.log('logoutUrl: ' + logoutUrl);
            }

            return CAS_AUTH.executeServerFunction(logoutUrl);
        },


        // Log into the CAS server
        loginCAS : function () {

            var loginUrl;

            console.log('Redirecting to CAS server');

            // Construct the login url which contains the service url to which
            // the browser will be redirected after successfully logging in
            loginUrl = CAS_AUTH.casServer + '/login?service=' +
                encodeURIComponent(CAS_AUTH.serviceUrl);

            console.log('loginUrl: ' + loginUrl);

            // Redirect to the CAS server
            window.location = loginUrl;
        },


        // Log out of CAS session
        logoutCAS : function () {

            var logoutUrl;

            // Logout from CAS
            logoutUrl = CAS_AUTH.casServer + '/logout?service=' +
                encodeURIComponent(CAS_AUTH.serviceUrl);

            console.log('logoutUrl: ' + logoutUrl);

            window.location = logoutUrl;

        },


        // The function called by the Login button, checks if a cookie created
        // by the HDF5 server exists, and if not, redirects to the CAS login
        // page
        login : function () {

            // Check if a CAS cookie created by the HDF5 server exists
            $.when(CAS_AUTH.cookieCheckServer()).then(
                function (isLoggedIn) {

                    if (!isLoggedIn) {

                        console.log('No CAS cookie from HDF5 server');

                        // Redirect to CAS server and log in
                        CAS_AUTH.loginCAS();
                    } else {
                        console.log('Found CAS cookie from HDF5 server');
                    }
                }
            );

        },


        // The function called by the Logout button, logs out from the CAS
        // server and removes the cookie created by the HDF5 server
        logout : function () {

            // Remove the cookie created by the HDF5 server
            $.when(CAS_AUTH.logoutServer()).then(
                function (response) {

                    console.log('logout:  ' + response);

                    // Logout of CAS
                    CAS_AUTH.logoutCAS();
                }
            );
        },


        // Check the current url for ticket information and save it, then
        // remove that information from the url
        checkUrlForTicket : function () {

            var debug = false, url, queryString, queryParams = {}, param,
                params, i, ticketFound = false, casTicket;

            // Get the full url
            url = window.location.href;

            if (debug) {
                console.log('url: ' + url);
            }

            // Check if it contains CAS ticket information
            // if (url.indexOf("?ticket=ST") > -1) {
            if (url.indexOf("ticket=ST") > -1) {

                if (debug) {
                    console.log('CAS ticket found?');
                }

                // Get the ticket information
                queryString = window.location.search.substring(1);
                if (debug) {
                    console.log('queryString: ' + queryString);
                }

                // Look for any parameters, save them
                params = queryString.split("&");
                for (i = 0; i < params.length; i += 1) {
                    param = params[i].split('=');
                    queryParams[param[0]] = param[1];
                }
                if (debug) {
                    console.log(queryParams);
                }

                // Create a cookie containing the ticket value
                if (queryParams.hasOwnProperty('ticket')) {
                    casTicket = queryParams.ticket;
                    ticketFound = true;
                }

                // Clean the url - get rid of eveything after the last /
                window.history.pushState({}, document.title,
                    '/hdf5-web-gui/html/');
                // window.history.pushState({}, document.title,
                //     window.location.pathname);
            }

            if (ticketFound) {

                // Send the ticket to the HDF5 server
                // The ticket check is slow (~ 200 to 1000 ms), so get some
                // other things at the same time
                return $.when(CAS_AUTH.ticketCheckServer(casTicket)).then(
                    function (isLoggedIn) {

                        if (debug) {
                            console.log('isLoggedIn:  ' + isLoggedIn);
                        }
                        return isLoggedIn;
                    }
                );

            }

            if (debug) {
                console.log('No CAS ticket found in url');
            }
            return undefined;
        },


        // Depending on login status, show the login or logout buttons and
        // the file browsing menu
        toggleLoginButton : function () {

            var i, debug = false, whenLoggedInShow = ['#logoutButton',
                '#logoutButtonMobile', '#treeSectionDiv'],
                whenLoggedOutShow = ['#loginButton', '#loginButtonMobile'];

            if (debug) {
                console.log('CAS_AUTH.isLoggedIn: ' + CAS_AUTH.isLoggedIn);
            }


            // Show or hide the login & logout related items
            if (CAS_AUTH.isLoggedIn) {
                for (i = 0; i < whenLoggedInShow.length; i += 1) {
                    $(whenLoggedInShow[i]).show();
                }
                for (i = 0; i < whenLoggedOutShow.length; i += 1) {
                    $(whenLoggedOutShow[i]).hide();
                }
            } else {
                for (i = 0; i < whenLoggedInShow.length; i += 1) {
                    $(whenLoggedInShow[i]).hide();
                }
                for (i = 0; i < whenLoggedOutShow.length; i += 1) {
                    $(whenLoggedOutShow[i]).show();
                }
            }

        },
    };

#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var requestify = require("requestify");
var express = require('express');
var monk = require('monk');
var config = require('./config/config');
var db = monk(config.connection_string);
var checkInModel = require('./model/checkIn');
var indegoController = require('./controller/IndegoController');

/**
 *  Define the sample application.
 */
var PingingApp = function() {

    //  Scope.
    var self = this;
    self.previousPingData = ({});

    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8082;

      if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
        self.startPingingIndego();
    };

    self.insertData = function(data) {
      var collection = db.get('features');
      collection.insert(data, function(err, doc){
        if (err) {
          console.error("Error occured during inserting the data : " + err);
        }
      });
    }

    self.addTimeStamp = function (data) {
      data.forEach(function (elem) {
        elem.properties['timeStamp'] = Date();
      });
      return data;
    }

    self.isDataChanged = function (data) {
        var hasChanged = false;
        if (typeof previousPingData === 'undefined') {
          console.info("previousPingData is not recorded");
          return true;
        }
        previousPingData.forEach(function (elem) {
          if (elem.properties['kioskId'] === data.properties['kioskId']
        && elem.properties['bikesAvailable'] !== data.properties['bikesAvailable']){
            console.log(elem.properties['timeStamp'] + " number of Available bikes changed for " + elem.properties['kioskId'] + ": ");
            console.log("Was Available" + elem.properties['bikesAvailable']);
            console.log("Now Available" + data.properties['bikesAvailable']);
            hasChanged = true;
          }
        })
        return hasChanged;
    }

    self.startPingingIndego = function () {
      var ic;

      if (db !== NaN) {
        console.log("Connected to database");
      }
      console.info(config.indegoRESTUrl);
      setInterval(function () {
      requestify.get(config.indegoRESTUrl)
        .then(function(response) {
            // Get the response body
            data = response.getBody();
            var modifiedData = self.addTimeStamp(data.features);
            console.info("Checking for previous changes ...");
            modifiedData.forEach(function (elemData) {
              ic = new checkInModel(elemData);
              if (self.isDataChanged(elemData)) {
                self.insertData(ic.getData());
                console.info("Data recorded");
              } else {
                //SKip
              }
            });
            previousPingData = modifiedData;
        }
      );
    }, config.intervalTime);
    }
};

var indegoPing = new PingingApp();
indegoPing.initialize();
indegoPing.start();

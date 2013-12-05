/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on logout endpoint.
 * - Tests valid request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var constants = require('../../config/constants.js');
var testConfig = require('../../config/testConfig.js');
var winston = require("winston");

var MODULE_NAME = " - Logout Test - ";

// Construct an empty authentication request format object.
var authReq =
{
  "request":
  {
    "header":
    {
      "appType": ""
    },
    "payload":
    {
      "login":
      {
        "userName": "",
        "password": ""
      }
    }
  }
};

// Construct an empty logout request format object.
var logoutReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
    }
  }
};


/**
 * Function which tests valid logout request.
 */
exports.test_LogoutValidTest = function(test, assert)
{
  var METHOD_NAME = "LogoutValidTest :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add valid authentication request parameters.
  authReq.request.header.appType = "Portal";
  authReq.request.payload.login.userName = "Janine";
  authReq.request.payload.login.password = "Firehouse";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    // Invoke authentication endpoint.
    fh.act([testConfig.appId, 'authenticateAction', JSON.stringify(authReq)], function(error, data)
    {
      // Error object?
      assert.ifError(err);

      var now = new Date();
      var datePrefix = now.toJSON();
      //var Error = JSON.parse(error);
      winston.info("Authentication response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

      // Response object?
      assert.ok(data.hasOwnProperty('response'));

      // Did we get a sessionId and status as expected?
      assert.isDefined(data.response);
      assert.isDefined(data.response.header);
      assert.isDefined(data.response.header.sessionId);
      assert.isDefined(data.response.payload);
      assert.isDefined(data.response.payload.login);
      assert.isDefined(data.response.payload.login.status);
      assert.equal(data.response.payload.login.status.code, constants.RESP_SUCCESS);

      // Now, invoke logout endpoint.
      logoutReq.request.header.sessionId = data.response.header.sessionId;

      var logoutStart = new Date();
      var datePrefix = logoutStart.toJSON();
      winston.info("Logout request - " + datePrefix + " : " + JSON.stringify(logoutReq, null, '\t'));

      fh.act([testConfig.appId, 'logoutAction', JSON.stringify(logoutReq)], function(err, data)
      {
        // Error object?
        assert.ifError(err);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Logout response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

        assert.ok(data.hasOwnProperty("response"));
        assert.equal(data.response.payload.logout.status.code, constants.RESP_SUCCESS);

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Logout test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
}; 
/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on fetch TODO details endpoint.
 * - Tests valid request parameters.
 * - Tests empty session id in request parameters.
 * - Tests invalid session id in request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var constants = require('../../config/constants.js');
var testConfig = require('../../config/testConfig.js');
var winston = require("winston");

var MODULE_NAME = " - Fetch fetchToDos Test - ";

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

// Construct an empty fetch todo request format object.
var fetchToDoReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
      "fetchToDo":
      {
      }
    }
  }
};


/**
 * Function which tests valid fetch todos request.
 */
exports.test_FetchToDosValidTest = function(test, assert)
{
  var METHOD_NAME = "FetchToDoValidTest :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add valid authentication request parameters.
  authReq.request.header.appType = "Client";
  authReq.request.payload.login.userName = "Spengler";
  authReq.request.payload.login.password = "TheKeymaster";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    // Invoke authentication endpoint 
    fh.act([testConfig.appId, 'authenticateAction', JSON.stringify(authReq)], function(error, data)
    {
      // Error object?
      assert.ifError(err);

      var now = new Date();
      var datePrefix = now.toJSON();
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

      // Now, invoke fetch Todos endpoint.
      fetchToDoReq.request.header.sessionId = data.response.header.sessionId;

      var fetchToDosStart = new Date();
      var datePrefix = fetchToDosStart.toJSON();
      winston.info("Fetch TODOs request - " + datePrefix + " : " + JSON.stringify(fetchToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'fetchToDoAction', JSON.stringify(fetchToDoReq)], function(err, data)
      {
        // Error object?
        assert.ifError(err);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Fetch TODOs response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

        //response objects?
        assert.ok(data.hasOwnProperty("response"));
        assert.isDefined(data.response);
        assert.isDefined(data.response.payload);
        assert.isDefined(data.response.payload.fetchToDos);
        assert.isDefined(data.response.payload.fetchToDos.status);
        assert.equal(data.response.payload.fetchToDos.status.code, constants.RESP_SUCCESS);

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Fetch TODOs test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
};


/**
 * Function which tests invalid fetch todos request (Missing session id).
 */
exports.test_FetchToDoBlankSessionId = function(test, assert)
{
  var METHOD_NAME = "FetchToDoInvalidTest (Missing session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear session id from request parameters.
  fetchToDoReq.request.header.sessionId = "";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Fetch TODOs request - " + datePrefix + " : " + JSON.stringify(fetchToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'fetchToDoAction', JSON.stringify(fetchToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Fetch TODOs response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      //Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_AUTH_FAILED);
      assert.equal(Error.response.payload.error.category, "Authorization failure. sessionId not specified.");

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Fetch TODOs test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};

/**
 * Function which tests invalid fetch todos request (Invalid session id).
 */
exports.test_FetchToDoInvalidSessionId = function(test, assert)
{
  var METHOD_NAME = "FetchToDoInvalidTest (Invalid session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add invalid session id in request parameters.
  sessionId = "vsvycsgyugegew";
  fetchToDoReq.request.header.sessionId = sessionId

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();

    winston.info("Fetch TODO request - " + datePrefix + " : " + JSON.stringify(fetchToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'fetchToDoAction', JSON.stringify(fetchToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Fetch TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      //Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_AUTH_FAILED);
      assert.equal(Error.response.payload.error.category, "Authorization failure. Session does not exist for sessionId: " + sessionId);

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Fetch TODOs test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
}; 
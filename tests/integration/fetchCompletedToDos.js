/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on fetch completed TODO details endpoint.
 * - Tests valid request parameters.
 * - Tests empty session id in request parameters.
 * - Tests invalid session id in request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var constants = require('../../config/constants.js');
var testConfig = require('../../config/testConfig.js');
var winston = require("winston");

var MODULE_NAME = " - Fetch Completed Todos Test - ";

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

// Construct an empty fetch completed todos request format object.
var fetchCompletedToDosReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
      "fetchCompletedToDo":
      {
      }
    }
  }
};


/**
 * Function which tests valid fetch completed todos request.
 */
exports.test_FetchCompletedToDosValidTest = function(test, assert)
{
  var METHOD_NAME = "FetchCompletedToDosValidTest :";
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

      // Now, invoke fetch completed Todos endpoint.
      fetchCompletedToDosReq.request.header.sessionId = data.response.header.sessionId;

      var fetchCompletedToDosStart = new Date();
      var datePrefix = fetchCompletedToDosStart.toJSON();
      winston.info("Fetch completed TODOs request - " + datePrefix + " : " + JSON.stringify(fetchCompletedToDosReq, null, '\t'));

      fh.act([testConfig.appId, "fetchCompletedToDoAction", JSON.stringify(fetchCompletedToDosReq)], function(err, data)
      {

        // Error object?
        assert.ifError(err);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Fetch completed TODOs response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

        //response objects?
        assert.ok(data.hasOwnProperty("response"));
        assert.isDefined(data.response);
        assert.isDefined(data.response.payload);
        assert.isDefined(data.response.payload.fetchCompletedToDos);
        assert.isDefined(data.response.payload.fetchCompletedToDos.status);
        assert.equal(data.response.payload.fetchCompletedToDos.status.code, constants.RESP_SUCCESS);

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Fetch completed TODOs test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
};


/**
 * Function which tests invalid fetch completed todos request (Missing session id).
 */
exports.test_FetchCompletedToDosBlankSessionId = function(test, assert)
{
  var METHOD_NAME = "FetchCompletedToDosInvalidTest (Missing session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear session id from request parameters.
  fetchCompletedToDosReq.request.header.sessionId = "";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();

    winston.info("Fetch completed TODOs request - " + datePrefix + " : " + JSON.stringify(fetchCompletedToDosReq, null, '\t'));

    //Invoke fetch completed todos endpoint 
    fh.act([testConfig.appId, 'fetchCompletedToDoAction', JSON.stringify(fetchCompletedToDosReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Fetch completed TODOs response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Fetch completed TODOs test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid fetch completed todos request (Invalid session id).
 */
exports.test_FetchCompletedToDosInvalidSessionId = function(test, assert)
{
  var METHOD_NAME = "FetchCompletedToDosInvalidTest (Invalid session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add invalid session id in request parameters.
  sessionId = "vsvycsgyugegew";
  fetchCompletedToDosReq.request.header.sessionId = sessionId

  //Invoke fetch completed todos endpoint
  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();

    winston.info("Fetch completed TODOs request - " + datePrefix + " : " + JSON.stringify(fetchCompletedToDosReq, null, '\t'));

    fh.act([testConfig.appId, 'fetchCompletedToDoAction', JSON.stringify(fetchCompletedToDosReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Fetch completed TODOs response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Fetch completed TODOs test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};   
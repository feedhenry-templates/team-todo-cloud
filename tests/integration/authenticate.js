/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on authentication endpoint.
 * - Tests valid request parameters.
 * - Tests bad user credentials in request parameters.
 * - Tests invalid application type in request parameters.
 * - Tests empty request parameters.
 * - Tests empty application type in request parameters.
 * - Tests empty user name in request parameters.
 * - Tests empty password in request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var winston = require("winston");
var testConfig = require('../../config/testConfig.js');
var constants = require('../../config/constants.js');

var MODULE_NAME = " - Authentication Test - ";

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


/**
 * Function which tests valid authentication request.
 */
exports.test_AuthenticateValidTest = function(test, assert)
{
  var METHOD_NAME = "AuthenticateValidTest :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add valid request parameters.
  authReq.request.header.appType = "Client";
  authReq.request.payload.login.userName = "Spengler";
  authReq.request.payload.login.password = "TheKeymaster";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    // Make a call to authentication endpoint.
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

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Authentication test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid authentication request (Bad user credentials).
 */
exports.test_AuthenticateBadCredential = function(test, assert)
{
  var METHOD_NAME = "AuthenticateInvalidTest (Bad user credentials) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add bad user credentials i.e. wrong password.
  authReq.request.header.appType = "Client";
  authReq.request.payload.login.userName = "Spengler";
  authReq.request.payload.login.password = "TheKey";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    fh.act([testConfig.appId, 'authenticateAction', JSON.stringify(authReq)], function(err, data)
    {
      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);

      var now = new Date();
      var datePrefix = now.toJSON();
      winston.info("Authentication response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      //Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_AUTH_FAILED);
      assert.equal(Error.response.payload.error.description, "Invalid username or password.");

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Authentication test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid authentication request (Invalid application type).
 */
exports.test_AuthenticateInvalidApptype = function(test, assert)
{
  var METHOD_NAME = "AuthenticateInvalidTest (Invalid application type) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add invalid appType in request parameters.
  authReq.request.header.appType = "Portal";
  authReq.request.payload.login.userName = "Spengler";
  authReq.request.payload.login.password = "TheKeymaster";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    fh.act([testConfig.appId, 'authenticateAction', JSON.stringify(authReq)], function(err, data)
    {
      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);

      var now = new Date();
      var datePrefix = now.toJSON();
      winston.info("Authentication response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      //Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_AUTH_FAILED);
      assert.equal(Error.response.payload.error.description, "Authentication Failure.Access is denied.");

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Authentication test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid authentication request (Empty authentication request parameters).
 */
exports.test_AuthenticateBadRequest = function(test, assert)
{
  var METHOD_NAME = "AuthenticateInvalidTest (Empty request parameters) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear all parameters.
  authReq.request.header.appType = "";
  authReq.request.payload.login.userName = "";
  authReq.request.payload.login.password = "";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    fh.act([testConfig.appId, 'authenticateAction', JSON.stringify(authReq)], function(err, data)
    {
      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);

      var now = new Date();
      var datePrefix = now.toJSON();
      winston.info("Authentication response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      //Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
      assert.equal(Error.response.payload.error.description, "Application Type not specified. UserName not specified. Password not specified. ");

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Authentication test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid authentication request (Missing application type).
 */
exports.test_AuthenticateBlankApptype = function(test, assert)
{
  var METHOD_NAME = "AuthenticateInvalidTest (Missing application type) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear appType parameter.
  authReq.request.header.appType = "";
  authReq.request.payload.login.userName = "Spengler";
  authReq.request.payload.login.password = "TheKeymaster";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    fh.act([testConfig.appId, 'authenticateAction', JSON.stringify(authReq)], function(err, data)
    {
      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);

      var now = new Date();
      var datePrefix = now.toJSON();
      winston.info("Authentication response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      //Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
      assert.equal(Error.response.payload.error.description, "Application Type not specified. ");

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Authentication test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid authentication request (Missing user name).
 */
exports.test_AuthenticateBlankUsername = function(test, assert)
{
  var METHOD_NAME = "AuthenticateInvalidTest (Missing user name) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear user name from request parameters.
  authReq.request.header.appType = "Client";
  authReq.request.payload.login.userName = "";
  authReq.request.payload.login.password = "TheKeymaster";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    fh.act([testConfig.appId, 'authenticateAction', JSON.stringify(authReq)], function(err, data)
    {
      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);

      var now = new Date();
      var datePrefix = now.toJSON();
      winston.info("Authentication response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      //Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
      assert.equal(Error.response.payload.error.description, "UserName not specified. ");

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Authentication test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid authentication request (Missing password).
 */
exports.test_AuthenticateBlankPassword = function(test, assert)
{
  var METHOD_NAME = "AuthenticateInvalidTest (Missing password) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear password from request parameters.
  authReq.request.header.appType = "Client";
  authReq.request.payload.login.userName = "Spengler";
  authReq.request.payload.login.password = "";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Authentication request - " + datePrefix + " : " + JSON.stringify(authReq, null, '\t'));

    fh.act([testConfig.appId, 'authenticateAction', JSON.stringify(authReq)], function(err, data)
    {
      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);

      var now = new Date();
      var datePrefix = now.toJSON();
      winston.info("Authentication response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      //Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
      assert.equal(Error.response.payload.error.description, "Password not specified. ");

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Authentication test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};
/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on delete TODO endpoint.
 * - Tests valid request parameters.
 * - Tests empty session id in request parameters.
 * - Tests invalid session id in request parameters.
 * - Tests empty TODO id in request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var constants = require('../../config/constants.js');
var testConfig = require('../../config/testConfig.js');
var winston = require("winston");

var MODULE_NAME = " - delete ToDo Test - ";

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

// Construct an empty fetch completed todo request format object.
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
      "fetchcompletedToDo":
      {
      }
    }
  }
};

// Construct an empty delete request format object.
var deleteToDoReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
      "deleteToDo":
      {
        "toDoId": ""
      }
    }
  }
};


/**
 * Function which tests valid delete todo request.
 */
exports.test_DeleteToDosValidTest = function(test, assert)
{
  var METHOD_NAME = "DeleteToDoValidTest :";
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

      var sessionId = data.response.header.sessionId;

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

        // Response object?
        assert.ok(data.hasOwnProperty("response"));
        assert.isDefined(data.response);
        assert.isDefined(data.response.payload);
        assert.isDefined(data.response.payload.fetchCompletedToDos);
        assert.isDefined(data.response.payload.fetchCompletedToDos.status);
        assert.isDefined(data.response.payload.fetchCompletedToDos.completedToDoList[0].toDoId);
        assert.equal(data.response.payload.fetchCompletedToDos.status.code, constants.RESP_SUCCESS);

        // Now, invoke delete Todo endpoint.
        deleteToDoReq.request.header.sessionId = sessionId;
        deleteToDoReq.request.payload.deleteToDo.toDoId = data.response.payload.fetchCompletedToDos.completedToDoList[0].toDoId;

        var deleteToDoStart = new Date();
        var datePrefix = deleteToDoStart.toJSON();
        winston.info("Complete TODO request - " + datePrefix + " : " + JSON.stringify(deleteToDoReq, null, '\t'));

        fh.act([testConfig.appId, 'deleteToDoAction', JSON.stringify(deleteToDoReq)], function(err, data)
        {
          // Error object?
          assert.ifError(err);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Delete TODO response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

          //response objects?
          assert.ok(data.hasOwnProperty("response"));
          assert.isDefined(data.response);
          assert.isDefined(data.response.payload);
          assert.isDefined(data.response.payload.deleteToDo);
          assert.isDefined(data.response.payload.deleteToDo.status);
          assert.equal(data.response.payload.deleteToDo.status.code, constants.RESP_SUCCESS);

          var end = new Date();
          var diff = end.getTime() - start.getTime();
          winston.info("Delete TODO test latency - " + diff);

          test.finish();
          winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
        });
      });
    });
  });
};


/**
 * Function which tests invalid delete todo request (Missing session id).
 */
exports.test_DeleteToDoBlankSessionId = function(test, assert)
{
  var METHOD_NAME = "DeleteToDoInvalidTest (Missing session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear session id from request parameters.
  deleteToDoReq.request.header.sessionId = "";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();

    winston.info("Delete TODO request - " + datePrefix + " : " + JSON.stringify(deleteToDoReq, null, '\t'));

    // Invoke delete todo endpoint.
    fh.act([testConfig.appId, 'deleteToDoAction', JSON.stringify(deleteToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Delete TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Delete TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};



/**
 * Function which tests invalid delete todo request (Invalid session id).
 */
exports.test_DeleteToDoInvalidSessionId = function(test, assert)
{
  var METHOD_NAME = "DeleteToDoInvalidTest (Invalid session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add invalid session id in request parameters.
  sessionId = "vsvycsgyugegew";
  deleteToDoReq.request.header.sessionId = sessionId

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Delete TODO request - " + datePrefix + " : " + JSON.stringify(deleteToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'deleteToDoAction', JSON.stringify(deleteToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Delete TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Delete TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid delete todo request (Missing todo id).
 */
exports.test_DeleteToDoBlankToDoId = function(test, assert)
{
  var METHOD_NAME = "DeleteToDoInvalidTest (Missing todo id) :";
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

      var sessionId = data.response.header.sessionId;

      // Now, invoke delete Todo endpoint.
      deleteToDoReq.request.header.sessionId = sessionId;
      deleteToDoReq.request.payload.deleteToDo.toDoId = "";

      var deleteToDoStart = new Date();
      var datePrefix = deleteToDoStart.toJSON();
      winston.info("Delete TODO request - " + datePrefix + " : " + JSON.stringify(deleteToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'deleteToDoAction', JSON.stringify(deleteToDoReq)], function(err, data)
      {
        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Delete TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

        // Response object?
        assert.ok(Error.hasOwnProperty('response'));

        //Did we get a error response as expected?
        assert.isDefined(Error.response);
        assert.isDefined(Error.response.payload);
        assert.isDefined(Error.response.payload.error);
        assert.isDefined(Error.response.payload.error.status);
        assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
        assert.equal(Error.response.payload.error.description, "ToDo Id not specified. ");

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Delete TODO test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
};

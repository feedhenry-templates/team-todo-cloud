/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on complete TODO endpoint.
 * - Tests valid request parameters.
 * - Tests empty session id in request parameters.
 * - Tests invalid session id in request parameters.
 * - Tests empty TODO details in request parameters.
 * - Tests empty TODO id in request parameters.
 * - Tests empty photo in request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var constants = require('../../config/constants.js');
var testConfig = require('../../config/testConfig.js');
var winston = require("winston");

var MODULE_NAME = " - Complete ToDo Test - ";

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

// Construct an empty fetch todos request format object.
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

// Construct an empty complete todo request format object.
var completeToDoReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
      "completeToDo":
      {
        "toDoId": "",
        "note": "",
        "completedOn": "",
        "latitude": "",
        "longitude": "",
        "photo": ""
      }
    }
  }
};


/**
 * Function which tests valid complete todo request.
 */
exports.test_CompleteToDoValidTest = function(test, assert)
{
  var METHOD_NAME = "CompleteToDoValidTest :";
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

      var sessionId = data.response.header.sessionId;

      // Now, invoke fetch todo endpoint 
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

        // Response object?
        assert.ok(data.hasOwnProperty("response"));
        assert.isDefined(data.response);
        assert.isDefined(data.response.payload);
        assert.isDefined(data.response.payload.fetchToDos);
        assert.isDefined(data.response.payload.fetchToDos.status);
        assert.isDefined(data.response.payload.fetchToDos.toDoList[0].toDoId);
        assert.equal(data.response.payload.fetchToDos.status.code, constants.RESP_SUCCESS);

        // Now, invoke complete todo endpoint
        completeToDoReq.request.header.sessionId = sessionId;
        completeToDoReq.request.payload.completeToDo.toDoId = data.response.payload.fetchToDos.toDoList[0].toDoId;
        completeToDoReq.request.payload.completeToDo.note = "ToDo Completed"
        completeToDoReq.request.payload.completeToDo.completedOn = "2013-11-24 18:30"
        completeToDoReq.request.payload.completeToDo.latitude = "17.2315"
        completeToDoReq.request.payload.completeToDo.longitude = "21.3241"
        completeToDoReq.request.payload.completeToDo.photo = "sg32tb4iybvrt74bj3vrwbwsvft37"

        var completeToDoStart = new Date();
        var datePrefix = completeToDoStart.toJSON();
        winston.info("Complete TODO request - " + datePrefix + " : " + JSON.stringify(completeToDoReq, null, '\t'));

        fh.act([testConfig.appId, 'completeToDoAction', JSON.stringify(completeToDoReq)], function(err, data)
        {
          // Error object?
          assert.ifError(err);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Complete TODO response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

          // Response object?
          assert.ok(data.hasOwnProperty("response"));
          assert.isDefined(data.response);
          assert.isDefined(data.response.payload);
          assert.isDefined(data.response.payload.completeToDo);
          assert.isDefined(data.response.payload.completeToDo.status);
          assert.equal(data.response.payload.completeToDo.status.code, constants.RESP_SUCCESS);

          var end = new Date();
          var diff = end.getTime() - start.getTime();
          winston.info("Complete TODO test latency - " + diff);

          test.finish();
          winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
        });
      });
    });
  });
};


/**
 * Function which tests invalid complete todo request (Missing session id).
 */
exports.test_CompleteToDoBlankSessionId = function(test, assert)
{
  var METHOD_NAME = "CompleteToDoInvalidTest (Missing session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear session id from request parameters.
  completeToDoReq.request.header.sessionId = "";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Complete TODO request - " + datePrefix + " : " + JSON.stringify(completeToDoReq, null, '\t'));

    // Invoke change todo endpoint.
    fh.act([testConfig.appId, 'completeToDoAction', JSON.stringify(completeToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Complete TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      // Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_AUTH_FAILED);
      assert.equal(Error.response.payload.error.category, "Authorization failure. sessionId not specified.");

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Complete TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid complete todo request (Invalid session id).
 */
exports.test_CompleteToDoInvalidSessionId = function(test, assert)
{
  var METHOD_NAME = "ChangeToDoInvalidTest (Invalid session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add invalid session id in request parameters.
  sessionId = "vsvycsgyugegew";
  completeToDoReq.request.header.sessionId = sessionId

  // Invoke Complete todo endpoint.
  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Complete TODO request - " + datePrefix + " : " + JSON.stringify(completeToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'completeToDoAction', JSON.stringify(completeToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Complete TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

      // Response object?
      assert.ok(Error.hasOwnProperty('response'));

      // Did we get a error response as expected?
      assert.isDefined(Error.response);
      assert.isDefined(Error.response.payload);
      assert.isDefined(Error.response.payload.error);
      assert.isDefined(Error.response.payload.error.status);
      assert.equal(Error.response.payload.error.status, constants.RESP_AUTH_FAILED);
      assert.equal(Error.response.payload.error.category, "Authorization failure. Session does not exist for sessionId: " + sessionId);

      var end = new Date();
      var diff = end.getTime() - start.getTime();
      winston.info("Complete TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid complete todo request (Empty complete todo request parameters).
 */
exports.test_CompleteToDoBadRequest = function(test, assert)
{
  var METHOD_NAME = "ChangeToDoInvalidTest (Empty request parameters) :";
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

      var sessionId = data.response.header.sessionId;

      // Now, invoke complete todo endpoint
      completeToDoReq.request.header.sessionId = sessionId;
      completeToDoReq.request.payload.completeToDo.toDoId = "";
      completeToDoReq.request.payload.completeToDo.note = "";
      completeToDoReq.request.payload.completeToDo.completedOn = "";
      completeToDoReq.request.payload.completeToDo.latitude = "";
      completeToDoReq.request.payload.completeToDo.longitude = "";
      completeToDoReq.request.payload.completeToDo.photo = "";

      var completeToDoStart = new Date();
      var datePrefix = completeToDoStart.toJSON();
      winston.info("Complete TODO request - " + datePrefix + " : " + JSON.stringify(completeToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'completeToDoAction', JSON.stringify(completeToDoReq)], function(err, data)
      {

        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Complete TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

        // Response object?
        assert.ok(Error.hasOwnProperty('response'));

        // Did we get a error response as expected?
        assert.isDefined(Error.response);
        assert.isDefined(Error.response.payload);
        assert.isDefined(Error.response.payload.error);
        assert.isDefined(Error.response.payload.error.status);
        assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
        assert.equal(Error.response.payload.error.description, "ToDo Id not specified. Note not specified. CompletedOn not specified. Latitude not specified. Longitude not specified. Photo not specified. ");

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Complete TODO test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
};


/**
 * Function which tests invalid complete todo request (Missing todo id).
 */
exports.test_CompleteToDosBlankToDoId = function(test, assert)
{
  var METHOD_NAME = "CompleteToDoInvalidTest (Missing todo id) :";
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

      var sessionId = data.response.header.sessionId;

      // Now, invoke complete Todo endpoint.
      completeToDoReq.request.header.sessionId = sessionId;
      completeToDoReq.request.payload.completeToDo.toDoId = "";
      completeToDoReq.request.payload.completeToDo.note = "ToDo Completed"
      completeToDoReq.request.payload.completeToDo.completedOn = "2013-11-24 18:30"
      completeToDoReq.request.payload.completeToDo.latitude = "17.2315"
      completeToDoReq.request.payload.completeToDo.longitude = "21.3241"
      completeToDoReq.request.payload.completeToDo.photo = "sg32tb4iybvrt74bj3vrwbwsvft37"

      var completeToDoStart = new Date();
      var datePrefix = completeToDoStart.toJSON();
      winston.info("Complete TODO request - " + datePrefix + " : " + JSON.stringify(completeToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'completeToDoAction', JSON.stringify(completeToDoReq)], function(err, data)
      {

        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Complete TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
        winston.info("Complete TODO test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
};


/**
 * Function which tests invalid complete todo request (Missing photo).
 */
exports.test_CompleteToDoBlankPhoto = function(test, assert)
{
  var METHOD_NAME = "CompleteToDoInvalidTest (Missing photo) :";
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

      var sessionId = data.response.header.sessionId;

      // Now, invoke fetch Todo endpoint.
      fetchToDoReq.request.header.sessionId = sessionId;

      var fetchToDosStart = new Date();
      var datePrefix = fetchToDosStart.toJSON();
      winston.info("Fetch TODO request - " + datePrefix + " : " + JSON.stringify(fetchToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'fetchToDoAction', JSON.stringify(fetchToDoReq)], function(err, data)
      {
        // Error object?
        assert.ifError(err);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Fetch TODO response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

        // Response objects?
        assert.ok(data.hasOwnProperty("response"));
        assert.isDefined(data.response);
        assert.isDefined(data.response.payload);
        assert.isDefined(data.response.payload.fetchToDos);
        assert.isDefined(data.response.payload.fetchToDos.status);
        assert.isDefined(data.response.payload.fetchToDos.toDoList);
        assert.equal(data.response.payload.fetchToDos.status.code, constants.RESP_SUCCESS);

        // Now, invoke complete Todo endpoint.
        completeToDoReq.request.header.sessionId = sessionId;
        completeToDoReq.request.payload.completeToDo.toDoId = data.response.payload.fetchToDos.toDoList[0].toDoId;
        completeToDoReq.request.payload.completeToDo.note = "ToDo Completed"
        completeToDoReq.request.payload.completeToDo.completedOn = "2013-11-24 18:30"
        completeToDoReq.request.payload.completeToDo.latitude = "17.2315"
        completeToDoReq.request.payload.completeToDo.longitude = "21.3241"
        completeToDoReq.request.payload.completeToDo.photo = ""

        var completeToDoStart = new Date();
        var datePrefix = completeToDoStart.toJSON();
        winston.info("Complete TODO request - " + datePrefix + " : " + JSON.stringify(completeToDoReq, null, '\t'));

        fh.act([testConfig.appId, 'completeToDoAction', JSON.stringify(completeToDoReq)], function(err, data)
        {
          var errorResponse = err.split("error:")[1].split("'")[1];
          var Error = JSON.parse(errorResponse);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Complete TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

          // Response object?
          assert.ok(Error.hasOwnProperty('response'));

          // Did we get a error response as expected?
          assert.isDefined(Error.response);
          assert.isDefined(Error.response.payload);
          assert.isDefined(Error.response.payload.error);
          assert.isDefined(Error.response.payload.error.status);
          assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
          assert.equal(Error.response.payload.error.description, "Photo not specified. ");

          var end = new Date();
          var diff = end.getTime() - start.getTime();
          winston.info("Complete TODO test latency - " + diff);

          test.finish();
          winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
        });
      });
    });
  });
};

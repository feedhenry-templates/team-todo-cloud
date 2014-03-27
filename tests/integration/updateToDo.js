/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on update TODO endpoint.
 * - Tests valid request parameters.
 * - Tests empty session id in request parameters.
 * - Tests invalid session id in request parameters.
 * - Tests empty TODO details in request parameters.
 * - Tests empty TODO id in request parameters.
 * - Tests empty status in request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var constants = require('../../config/constants.js');
var testConfig = require('../../config/testConfig.js');
var winston = require("winston");

var MODULE_NAME = " - Update ToDo Test - ";

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

// Construct an empty update todo request format object.
var updateToDoReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
      "updateToDo":
      {
        "toDoId": "",
        "description": "",
        "deadline": "",
        "latitude": "",
        "longitude": "",
        "status": "",
        "note": ""
      }
    }
  }
};


/**
 * Function which tests valid update todo request.
 */
exports.test_UpdateToDosValidTest = function(test, assert)
{
  var METHOD_NAME = "UpdateToDoValidTest";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add valid authentication request parameters.
  authReq.request.header.appType = "Client";
  authReq.request.payload.login.userName = "Stantz";
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
        assert.isDefined(data.response.payload.fetchToDos.toDoList[0].toDoId);
        assert.equal(data.response.payload.fetchToDos.status.code, constants.RESP_SUCCESS);

        // Now, invoke update Todo endpoint.
        updateToDoReq.request.header.sessionId = sessionId;
        updateToDoReq.request.payload.updateToDo.toDoId = data.response.payload.fetchToDos.toDoList[0].toDoId;
        updateToDoReq.request.payload.updateToDo.description = "Updated Description";
        updateToDoReq.request.payload.updateToDo.deadline = "2013-12-10";
        updateToDoReq.request.payload.updateToDo.latitude = "28.1233";
        updateToDoReq.request.payload.updateToDo.longitude = "24.4321";
        updateToDoReq.request.payload.updateToDo.status = "In progress";
        updateToDoReq.request.payload.updateToDo.note = "30% done";

        var updateToDoStart = new Date();
        var datePrefix = updateToDoStart.toJSON();
        winston.info("Update TODO request - " + datePrefix + " : " + JSON.stringify(updateToDoReq, null, '\t'));

        fh.act([testConfig.appId, 'updateToDoAction', JSON.stringify(updateToDoReq)], function(err, data)
        {
          // Error object?
          assert.ifError(err);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Update TODO response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

          //response objects?
          assert.ok(data.hasOwnProperty("response"));
          assert.isDefined(data.response);
          assert.isDefined(data.response.payload);
          assert.isDefined(data.response.payload.updateToDo);
          assert.isDefined(data.response.payload.updateToDo.status);
          assert.equal(data.response.payload.updateToDo.status.code, constants.RESP_SUCCESS);

          var end = new Date();
          var diff = end.getTime() - start.getTime();
          winston.info("Update TODO test latency - " + diff);

          test.finish();
          winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
        });
      });
    });
  });
};


/**
 * Function which tests invalid update todo request (Missing session id).
 */
exports.test_UpdateToDoBlankSessionId = function(test, assert)
{
  var METHOD_NAME = "UpdateToDoInvalidTest (Missing session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear session id from request parameters.
  updateToDoReq.request.header.sessionId = "";

  // Invoke update todo endpoint.
  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Update TODO request - " + datePrefix + " : " + JSON.stringify(updateToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'updateToDoAction', JSON.stringify(updateToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Update TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Update TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid update todo request (Invalid session id).
 */
exports.test_UpdateToDoInvalidSessionId = function(test, assert)
{
  var METHOD_NAME = "UpdateToDoInvalidTest (Invalid session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add invalid session id in request parameters.
  sessionId = "vsvycsgyugegew";
  updateToDoReq.request.header.sessionId = sessionId

  // Invoke update todo endpoint.
  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Update TODO request - " + datePrefix + " : " + JSON.stringify(updateToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'updateToDoAction', JSON.stringify(updateToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Update TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Update TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid change todo request (Empty change todo request parameters).
 */
exports.test_UpdateToDoBadRequest = function(test, assert)
{
  var METHOD_NAME = "UpdateToDoInvalidTest (Empty request parameters) :";
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

      // Now, invoke update Todo endpoint.
      updateToDoReq.request.header.sessionId = sessionId;
      updateToDoReq.request.payload.updateToDo.toDoId = "";
      updateToDoReq.request.payload.updateToDo.description = "";
      updateToDoReq.request.payload.updateToDo.deadline = "";
      updateToDoReq.request.payload.updateToDo.latitude = "";
      updateToDoReq.request.payload.updateToDo.longitude = "";
      updateToDoReq.request.payload.updateToDo.status = "";
      updateToDoReq.request.payload.updateToDo.note = "";

      var updateToDoStart = new Date();
      var datePrefix = updateToDoStart.toJSON();
      winston.info("Update TODO request - " + datePrefix + " : " + JSON.stringify(updateToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'updateToDoAction', JSON.stringify(updateToDoReq)], function(err, data)
      {
        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Update TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

        // Response object?
        assert.ok(Error.hasOwnProperty('response'));

        //Did we get a error response as expected?
        assert.isDefined(Error.response);
        assert.isDefined(Error.response.payload);
        assert.isDefined(Error.response.payload.error);
        assert.isDefined(Error.response.payload.error.status);
        assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
        assert.equal(Error.response.payload.error.description, "ToDo Id not specified. Description not specified. Deadline not specified. Latitude not specified. Longitude not specified. Status not specified. Note not specified. ");

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Update TODO test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });

    });
  });
};


/**
 * Function which tests invalid change todo request (Missing todo id).
 */
exports.test_UpdateToDosBlankToDoId = function(test, assert)
{
  var METHOD_NAME = "UpdateToDoInvalidTest (Missing todo id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add valid authentication request parameters.
  authReq.request.header.appType = "Client";
  authReq.request.payload.login.userName = "Stantz";
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

      // Now, invoke update Todo endpoint.
      updateToDoReq.request.header.sessionId = sessionId;
      updateToDoReq.request.payload.updateToDo.toDoId = "";
      updateToDoReq.request.payload.updateToDo.description = "Updated Description";
      updateToDoReq.request.payload.updateToDo.deadline = "2013-12-10";
      updateToDoReq.request.payload.updateToDo.latitude = "28.1233";
      updateToDoReq.request.payload.updateToDo.longitude = "24.4321";
      updateToDoReq.request.payload.updateToDo.status = "In progress";
      updateToDoReq.request.payload.updateToDo.note = "30% done";

      var updateToDoStart = new Date();
      var datePrefix = updateToDoStart.toJSON();
      winston.info("Update TODO request - " + datePrefix + " : " + JSON.stringify(updateToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'updateToDoAction', JSON.stringify(updateToDoReq)], function(err, data)
      {

        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);
        winston.info("Update TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
        winston.info("Update TODO test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
};



/**
 * Function which tests invalid change todo request (Missing status).
 */
exports.test_UpdateToDoBlankStatus = function(test, assert)
{
  var METHOD_NAME = "UpdateToDoInvalidTest (Missing status) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add valid authentication request parameters.
  authReq.request.header.appType = "Client";
  authReq.request.payload.login.userName = "Stantz";
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
        assert.isDefined(data.response.payload.fetchToDos.toDoList);
        assert.equal(data.response.payload.fetchToDos.status.code, constants.RESP_SUCCESS);

        // Now, invoke update Todo endpoint.
        updateToDoReq.request.header.sessionId = sessionId;
        updateToDoReq.request.payload.updateToDo.toDoId = data.response.payload.fetchToDos.toDoList[0].toDoId;
        updateToDoReq.request.payload.updateToDo.description = "Updated Description";
        updateToDoReq.request.payload.updateToDo.deadline = "2013-12-10";
        updateToDoReq.request.payload.updateToDo.latitude = "28.1233";
        updateToDoReq.request.payload.updateToDo.longitude = "24.4321";
        updateToDoReq.request.payload.updateToDo.status = "";
        updateToDoReq.request.payload.updateToDo.note = "30% done";

        var updateToDoStart = new Date();
        var datePrefix = updateToDoStart.toJSON();
        winston.info("Update TODO request - " + datePrefix + " : " + JSON.stringify(updateToDoReq, null, '\t'));

        fh.act([testConfig.appId, 'updateToDoAction', JSON.stringify(updateToDoReq)], function(err, data)
        {
          var errorResponse = err.split("error:")[1].split("'")[1];
          var Error = JSON.parse(errorResponse);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Update TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

          // Response object?
          assert.ok(Error.hasOwnProperty('response'));

          //Did we get a error response as expected?
          assert.isDefined(Error.response);
          assert.isDefined(Error.response.payload);
          assert.isDefined(Error.response.payload.error);
          assert.isDefined(Error.response.payload.error.status);
          assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
          assert.equal(Error.response.payload.error.description, "Status not specified. ");

          var end = new Date();
          var diff = end.getTime() - start.getTime();
          winston.info("Update TODO test latency: " + diff);

          test.finish();
          winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
        });
      });
    });
  });
};

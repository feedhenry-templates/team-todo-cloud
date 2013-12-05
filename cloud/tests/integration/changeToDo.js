/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on change TODO details endpoint.
 * - Tests valid request parameters.
 * - Tests empty session id in request parameters.
 * - Tests invalid session id in request parameters.
 * - Tests empty TODO details in request parameters.
 * - Tests empty TODO id in request parameters.
 * - Tests empty user id (assignedTo) in request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var winston = require("winston");
var constants = require('../../config/constants.js');
var testConfig = require('../../config/testConfig.js');

var MODULE_NAME = " - Change ToDo Test - ";

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

// Construct an empty fetch TODOs request format object.
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

// Construct an empty fetch users request format object.
var fetchUsersReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
      "fetchUsers":
      {
      }
    }
  }
};

// Construct an empty change TODO request format object.
var changeToDoReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
      "changeToDo":
      {
        "toDoId": "",
        "title": "",
        "description": "",
        "deadline": "",
        "assignedTo": "",
        "latitude": "",
        "longitude": ""
      }
    }
  }
};


/**
 * Function which tests valid change todo request.
 */
exports.test_ChangeToDoValidTest = function(test, assert)
{
  var METHOD_NAME = "ChangeToDoValidTest";
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

      // Now, invoke fetch todos endpoint.
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

        var toDoId = data.response.payload.fetchToDos.toDoList[0].toDoId;

        // Now, invoke fetch users endpoint.
        fetchUsersReq.request.header.sessionId = sessionId;

        var fetchUsersStart = new Date();
        var datePrefix = fetchToDosStart.toJSON();
        winston.info("Fetch users request - " + datePrefix + " : " + JSON.stringify(fetchUsersReq, null, '\t'));

        fh.act([testConfig.appId, 'fetchUserListAction', JSON.stringify(fetchUsersReq)], function(err, data)
        {

          // Error object?
          assert.ifError(err);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Fetch users response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

          assert.ok(data.hasOwnProperty("response"));
          assert.isDefined(data.response);
          assert.isDefined(data.response.payload);
          assert.isDefined(data.response.payload.fetchUsers);
          assert.isDefined(data.response.payload.fetchUsers.status);
          assert.isDefined(data.response.payload.fetchUsers.userList[0].userId);
          assert.equal(data.response.payload.fetchUsers.status.code, constants.RESP_SUCCESS);

          // Now, invoke change ToDo endpoint.
          changeToDoReq.request.header.sessionId = sessionId;
          changeToDoReq.request.payload.changeToDo.toDoId = toDoId;
          changeToDoReq.request.payload.changeToDo.title = "Change ToDO";
          changeToDoReq.request.payload.changeToDo.description = "ChangeToDO description";
          changeToDoReq.request.payload.changeToDo.deadline = "2013-11-30";
          changeToDoReq.request.payload.changeToDo.assignedTo = data.response.payload.fetchUsers.userList[0].userId;
          changeToDoReq.request.payload.changeToDo.latitude = "23.9876";
          changeToDoReq.request.payload.changeToDo.longitude = "12.7654";

          var changeToDoStart = new Date();
          var datePrefix = changeToDoStart.toJSON();
          winston.info("Change TODO request - " + datePrefix + " : " + JSON.stringify(changeToDoReq, null, '\t'));

          fh.act([testConfig.appId, 'changeToDoAction', JSON.stringify(changeToDoReq)], function(err, data)
          {
            // Error object?
            assert.ifError(err);

            var now = new Date();
            var datePrefix = now.toJSON();
            winston.info("Change TODO response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

            //response objects?
            assert.ok(data.hasOwnProperty("response"));
            assert.isDefined(data.response);
            assert.isDefined(data.response.payload);
            assert.isDefined(data.response.payload.changeToDo);
            assert.isDefined(data.response.payload.changeToDo.status);
            assert.equal(data.response.payload.changeToDo.status.code, constants.RESP_SUCCESS);

            var end = new Date();
            var diff = end.getTime() - start.getTime();
            winston.info("Change TODO test latency - " + diff);

            test.finish();
            winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
          });
        });
      });
    });
  });
};


/**
 * Function which tests invalid change todo request (Missing session id).
 */
exports.test_ChangeToDoBlankSessionId = function(test, assert)
{
  var METHOD_NAME = "ChangeToDoInvalidTest (Missing session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear session id from request parameters.
  changeToDoReq.request.header.sessionId = "";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Change TODO request - " + datePrefix + " : " + JSON.stringify(changeToDoReq, null, '\t'));

    // Invoke change todo endpoint.
    fh.act([testConfig.appId, 'changeToDoAction', JSON.stringify(changeToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Change TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Change TODO test latency - " + diff);
      test.finish();

      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid change todo request (Invalid session id).
 */
exports.test_ChangeToDoInvalidSessionId = function(test, assert)
{
  var METHOD_NAME = "ChangeToDoInvalidTest (Invalid session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add invalid session id in request parameters.
  sessionId = "vsvycsgyugegew";
  changeToDoReq.request.header.sessionId = sessionId

  // Invoke change todo endpoint.
  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Change TODO request - " + datePrefix + " : " + JSON.stringify(changeToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'changeToDoAction', JSON.stringify(changeToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Change TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Change TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid change todo request (Empty change todo request parameters).
 */
exports.test_ChangeToDoBadRequest = function(test, assert)
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

      // Now, invoke change todo endpoint.
      changeToDoReq.request.header.sessionId = sessionId;
      changeToDoReq.request.payload.changeToDo.toDoId = "";
      changeToDoReq.request.payload.changeToDo.title = "";
      changeToDoReq.request.payload.changeToDo.description = "";
      changeToDoReq.request.payload.changeToDo.deadline = "";
      changeToDoReq.request.payload.changeToDo.assignedTo = "";
      changeToDoReq.request.payload.changeToDo.latitude = "";
      changeToDoReq.request.payload.changeToDo.longitude = "";

      var changeToDoStart = new Date();
      var datePrefix = changeToDoStart.toJSON();
      winston.info("Change TODO request - " + datePrefix + " : " + JSON.stringify(changeToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'changeToDoAction', JSON.stringify(changeToDoReq)], function(err, data)
      {

        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Change TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

        // Response object?
        assert.ok(Error.hasOwnProperty('response'));

        // Did we get a error response as expected?
        assert.isDefined(Error.response);
        assert.isDefined(Error.response.payload);
        assert.isDefined(Error.response.payload.error);
        assert.isDefined(Error.response.payload.error.status);
        assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
        assert.equal(Error.response.payload.error.description, "ToDo Id not specified. Title not specified. Description not specified. Deadline not specified. AssignTo not specified. Latitude not specified. Longitude not specified. ");

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Change TODO test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
};


/**
 * Function which tests invalid change todo request (Missing todo id).
 */
exports.test_ChangeToDoBlankToDoId = function(test, assert)
{
  var METHOD_NAME = "ChangeToDoInvalidTest (Missing todo id) :";
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

      // Now, invoke fetch users endpoint.
      fetchUsersReq.request.header.sessionId = sessionId;

      var fetchUsersStart = new Date();
      var datePrefix = fetchUsersStart.toJSON();
      winston.info("Fetch users request - " + datePrefix + " : " + JSON.stringify(fetchUsersReq, null, '\t'));

      fh.act([testConfig.appId, 'fetchUserListAction', JSON.stringify(fetchUsersReq)], function(err, data)
      {
        // Error object?
        assert.ifError(err);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Fetch users response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

        // Response object?
        assert.ok(data.hasOwnProperty("response"));
        assert.isDefined(data.response);
        assert.isDefined(data.response.payload);
        assert.isDefined(data.response.payload.fetchUsers);
        assert.isDefined(data.response.payload.fetchUsers.status);
        assert.isDefined(data.response.payload.fetchUsers.userList[0].userId);
        assert.equal(data.response.payload.fetchUsers.status.code, constants.RESP_SUCCESS);

        // Now, invoke change todo endpoint.
        changeToDoReq.request.header.sessionId = sessionId;
        changeToDoReq.request.payload.changeToDo.title = "Change ToDO";
        changeToDoReq.request.payload.changeToDo.description = "ChangeToDO description";
        changeToDoReq.request.payload.changeToDo.deadline = "2013-11-30";
        changeToDoReq.request.payload.changeToDo.assignedTo = data.response.payload.fetchUsers.userList[0].userId;
        changeToDoReq.request.payload.changeToDo.latitude = "23.9876";
        changeToDoReq.request.payload.changeToDo.longitude = "12.7654";

        var changeToDoStart = new Date();
        var datePrefix = changeToDoStart.toJSON();
        winston.info("Change TODO request - " + datePrefix + " : " + JSON.stringify(changeToDoReq, null, '\t'));

        fh.act([testConfig.appId, 'changeToDoAction', JSON.stringify(changeToDoReq)], function(err, data)
        {

          var errorResponse = err.split("error:")[1].split("'")[1];
          var Error = JSON.parse(errorResponse);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Change TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

          // Response object?
          assert.ok(Error.hasOwnProperty('response'));

          // Did we get a error response as expected?
          assert.isDefined(Error.response);
          assert.isDefined(Error.response.payload);
          assert.isDefined(Error.response.payload.error);
          assert.isDefined(Error.response.payload.error.status);
          assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
          assert.equal(Error.response.payload.error.description, "ToDo Id not specified. ");

          var end = new Date();
          var diff = end.getTime() - start.getTime();
          winston.info("Change TODO test latency - " + diff);

          test.finish();
          winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
        });
      });
    });
  });
};


/**
 * Function which tests invalid change todo request (Missing assignedTo).
 */
exports.test_ChangeToDoBlankAssignedto = function(test, assert)
{
  var METHOD_NAME = "ChangeToDoInvalidTest (Missing assignedTo) :";
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

        var toDoId = data.response.payload.fetchToDos.toDoList[0].toDoId;

        // Now, invoke change todo endpoint
        changeToDoReq.request.header.sessionId = sessionId;
        changeToDoReq.request.payload.changeToDo.toDoId = toDoId;
        changeToDoReq.request.payload.changeToDo.title = "Change ToDo";
        changeToDoReq.request.payload.changeToDo.description = "ChangeToDo description";
        changeToDoReq.request.payload.changeToDo.assignedTo = "";
        changeToDoReq.request.payload.changeToDo.deadline = "2013-11-30";
        changeToDoReq.request.payload.changeToDo.latitude = "23.9876";
        changeToDoReq.request.payload.changeToDo.longitude = "12.7654";

        var changeToDoStart = new Date();
        var datePrefix = changeToDoStart.toJSON();
        winston.info("Change TODO request - " + datePrefix + " : " + JSON.stringify(changeToDoReq, null, '\t'));

        fh.act([testConfig.appId, 'changeToDoAction', JSON.stringify(changeToDoReq)], function(err, data)
        {

          var errorResponse = err.split("error:")[1].split("'")[1];
          var Error = JSON.parse(errorResponse);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Change TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

          // Response object?
          assert.ok(Error.hasOwnProperty('response'));

          //Did we get a error response as expected?
          assert.isDefined(Error.response);
          assert.isDefined(Error.response.payload);
          assert.isDefined(Error.response.payload.error);
          assert.isDefined(Error.response.payload.error.status);
          assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
          assert.equal(Error.response.payload.error.description, "AssignTo not specified. ");

          var end = new Date();
          var diff = end.getTime() - start.getTime();
          winston.info("Change TODO test latency - " + diff);

          test.finish();
          winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
        });
      });
    });
  });
};
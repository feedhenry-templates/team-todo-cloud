/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of functions for performing tests on create TODO endpoint.
 * - Tests valid request parameters.
 * - Tests empty session id in request parameters.
 * - Tests invalid session id in request parameters.
 * - Tests empty TODO details in request parameters.
 * - Tests empty TODO title in request parameters.
 * - Tests empty user id (assignedTo) in request parameters.
 */


// Dependencies.
var fh = require("fh-fhc");
var constants = require('../../config/constants.js');
var testConfig = require('../../config/testConfig.js');
var winston = require("winston");

var MODULE_NAME = " - Create ToDo Test - ";

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

// Construct an empty crette todo request format object.
var createToDoReq =
{
  "request":
  {
    "header":
    {
      "sessionId": ""
    },
    "payload":
    {
      "createToDo":
      {
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


/**
 * Function which tests valid create todo request.
 */
exports.test_CreateToDosValidTest = function(test, assert)
{
  var METHOD_NAME = "CreateToDoValidTest :";
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

      // Now, invoke fetch Users endpoint.
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
        assert.isDefined(data.response.payload.fetchUsers.userList);
        assert.isDefined(data.response.payload.fetchUsers.userList[0].userId);
        assert.equal(data.response.payload.fetchUsers.status.code, constants.RESP_SUCCESS);

        // Now, invoke create Todo endpoint.
        createToDoReq.request.header.sessionId = sessionId;
        createToDoReq.request.payload.createToDo.title = "New ToDo";
        createToDoReq.request.payload.createToDo.description = "New description";
        createToDoReq.request.payload.createToDo.deadline = "2013-11-20";
        createToDoReq.request.payload.createToDo.assignedTo = data.response.payload.fetchUsers.userList[0].userId;
        createToDoReq.request.payload.createToDo.latitude = "20.6373";
        createToDoReq.request.payload.createToDo.longitude = "18.9837";

        var createToDoStart = new Date();
        var datePrefix = createToDoStart.toJSON();
        winston.info("Create TODO request - " + datePrefix + " : " + JSON.stringify(createToDoReq, null, '\t'));

        fh.act([testConfig.appId, 'createToDoAction', JSON.stringify(createToDoReq)], function(err, data)
        {
          // Error object?
          assert.ifError(err);

          var now = new Date();
          var datePrefix = now.toJSON();
          winston.info("Create TODO response - " + datePrefix + " : " + JSON.stringify(data, null, '\t'));

          // Response object?
          assert.ok(data.hasOwnProperty("response"));
          assert.isDefined(data.response);
          assert.isDefined(data.response.payload);
          assert.isDefined(data.response.payload.createToDo);
          assert.isDefined(data.response.payload.createToDo.status);
          assert.equal(data.response.payload.createToDo.status.code, constants.RESP_SUCCESS);

          var end = new Date();
          var diff = end.getTime() - start.getTime();
          winston.info("Create TODO test latency - " + diff);

          test.finish();
          winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
        });
      });
    });
  });
};


/**
 * Function which tests invalid create todo request (Missing session id).
 */
exports.test_CreateToDoBlankSessionId = function(test, assert)
{
  var METHOD_NAME = "CreateToDoInvalidTest (Missing session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Clear session id from request parameters.
  createToDoReq.request.header.sessionId = "";

  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Create TODO request - " + datePrefix + " : " + JSON.stringify(createToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'createToDoAction', JSON.stringify(createToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Create TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Create TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid create todo request (Invalid session id).
 */
exports.test_CreateToDoInvalidSessionId = function(test, assert)
{
  var METHOD_NAME = "CreateToDoInvalidTest (Invalid session id) :";
  winston.info("\n----------: START" + MODULE_NAME + METHOD_NAME + "----------\n");

  // Add invalid session id in request parameters.
  sessionId = "vsvycsgyugegew";
  createToDoReq.request.header.sessionId = sessionId

  // Invoke change todo endpoint.
  fh.fhc.load(function(err)
  {
    var start = new Date();
    var datePrefix = start.toJSON();
    winston.info("Create TODO request - " + datePrefix + " : " + JSON.stringify(createToDoReq, null, '\t'));

    fh.act([testConfig.appId, 'createToDoAction', JSON.stringify(createToDoReq)], function(err, data)
    {
      var now = new Date();
      var datePrefix = now.toJSON();

      var errorResponse = err.split("error:")[1].split("'")[1];
      var Error = JSON.parse(errorResponse);
      winston.info("Create TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
      winston.info("Create TODO test latency - " + diff);

      test.finish();
      winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
    });
  });
};


/**
 * Function which tests invalid create todo request (Empty create todo request parameters).
 */
exports.test_CreateToDoBadRequest = function(test, assert)
{
  var METHOD_NAME = "CreateToDoInvalidTest (Missing request parameters) :";
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

      // Now, invoke create Todo endpoint.
      createToDoReq.request.header.sessionId = sessionId;
      createToDoReq.request.payload.createToDo.title = "";
      createToDoReq.request.payload.createToDo.description = "";
      createToDoReq.request.payload.createToDo.deadline = "";
      createToDoReq.request.payload.createToDo.assignedTo = "";
      createToDoReq.request.payload.createToDo.latitude = "";
      createToDoReq.request.payload.createToDo.longitude = "";

      var createToDoStart = new Date();
      var datePrefix = createToDoStart.toJSON();
      winston.info("Create TODO request - " + datePrefix + " : " + JSON.stringify(createToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'createToDoAction', JSON.stringify(createToDoReq)], function(err, data)
      {

        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);
        winston.info("Create TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

        // Response object?
        assert.ok(Error.hasOwnProperty('response'));

        //Did we get a error response as expected?
        assert.isDefined(Error.response);
        assert.isDefined(Error.response.payload);
        assert.isDefined(Error.response.payload.error);
        assert.isDefined(Error.response.payload.error.status);
        assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
        assert.equal(Error.response.payload.error.description, "Title not specified. Description not specified. Deadline not specified. AssignTo not specified. Latitude not specified. Longitude not specified. ");

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Create TODO test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });

    });
  });
};


/**
 * Function which tests invalid create todo request (Missing title).
 */
exports.test_CreateToDosBlankTitle = function(test, assert)
{
  var METHOD_NAME = "CreateToDoInvalidTest (Missing title) :";
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

      // Now, invoke create Todo endpoint.
      createToDoReq.request.header.sessionId = sessionId;
      createToDoReq.request.payload.createToDo.title = "";
      createToDoReq.request.payload.createToDo.description = "New description";
      createToDoReq.request.payload.createToDo.deadline = "2013-11-20";
      createToDoReq.request.payload.createToDo.assignedTo = "728131276446443421211";
      createToDoReq.request.payload.createToDo.latitude = "20.6373";
      createToDoReq.request.payload.createToDo.longitude = "18.9837";

      var createToDoStart = new Date();
      var datePrefix = createToDoStart.toJSON();
      winston.info("Create TODO request - " + datePrefix + " : " + JSON.stringify(createToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'createToDoAction', JSON.stringify(createToDoReq)], function(err, data)
      {

        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Create TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

        // Response object?
        assert.ok(Error.hasOwnProperty('response'));

        // Did we get a error response as expected?
        assert.isDefined(Error.response);
        assert.isDefined(Error.response.payload);
        assert.isDefined(Error.response.payload.error);
        assert.isDefined(Error.response.payload.error.status);
        assert.equal(Error.response.payload.error.status, constants.RESP_BAD_INPUT);
        assert.equal(Error.response.payload.error.description, "Title not specified. ");

        var end = new Date();
        var diff = end.getTime() - start.getTime();
        winston.info("Create TODO test latency - " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
};


/**
 * Function which tests invalid complete todo request (Missing assignedTo).
 */
exports.test_CreateToDoBlankAssignedTo = function(test, assert)
{
  var METHOD_NAME = "CreateToDoInvalidTest (Missing assignedTo) :";
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

      // Now, invoke create Todo endpoint.
      createToDoReq.request.header.sessionId = sessionId;
      createToDoReq.request.payload.createToDo.title = "New To Do";
      createToDoReq.request.payload.createToDo.description = "New description";
      createToDoReq.request.payload.createToDo.deadline = "2013-11-20";
      createToDoReq.request.payload.createToDo.assignedTo = "";
      createToDoReq.request.payload.createToDo.latitude = "20.6373";
      createToDoReq.request.payload.createToDo.longitude = "18.9837";

      var createToDoStart = new Date();
      var datePrefix = createToDoStart.toJSON();
      winston.info("Create TODO request - " + datePrefix + " : " + JSON.stringify(createToDoReq, null, '\t'));

      fh.act([testConfig.appId, 'createToDoAction', JSON.stringify(createToDoReq)], function(err, data)
      {

        var errorResponse = err.split("error:")[1].split("'")[1];
        var Error = JSON.parse(errorResponse);

        var now = new Date();
        var datePrefix = now.toJSON();
        winston.info("Create TODO response - " + datePrefix + " : " + JSON.stringify(Error, null, '\t'));

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
        winston.info("Create TODO test latency: " + diff);

        test.finish();
        winston.info("\n----------: END" + MODULE_NAME + METHOD_NAME + "----------\n");
      });
    });
  });
}; 
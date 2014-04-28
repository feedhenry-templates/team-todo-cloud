/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Entry point for cloud endpoints. Client application will communicate with this module via publicly exposed REST API Endpoints.
 * All work will be delegated to respective endpoints then response will be given back to client application.
 * - All input parameters must be passed in a single Json Object.
 * - The return 'callback' method signature is 'callback (error, data)', where 'data' is a Json Object.
 */

// Dependency on DAO classes.
var masterDataDAO = require("./dao/masterData.js");
var fh = require('fh-mbaas-api');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var util = require('util');

// Publicly exposed sync APIs to allow client to interact with the cloud dataset.
var toDo = toDo;

function cloudRoute() {
 var cloud = new express.Router();
  cloud.use(cors());
  cloud.use(bodyParser());

  createEndpoints(cloud);

  return cloud();
};

module.exports = cloudRoute;

// Creates the Public API, all of which delegate to a specific action
function createEndpoints(cloud) {
  createEndpoint('/authenticateAction', require("./endpoints/authentication.js").authenticateUser, cloud);
  createEndpoint('/logoutAction',  require("./endpoints/logout.js").logoutUser, cloud);
  createEndpoint('/createToDoAction', require("./endpoints/createToDo.js").createToDo, cloud);
  createEndpoint('/fetchToDoAction', require("./endpoints/fetchToDo.js").fetchToDos, cloud);
  createEndpoint('/updateToDoAction', require("./endpoints/updateToDo.js").updateToDo, cloud);
  createEndpoint('/fetchUserListAction', require("./endpoints/fetchUsers.js").fetchUsers, cloud);
  createEndpoint('/completeToDoAction', require("./endpoints/completeToDo.js").completeToDo, cloud);
  createEndpoint('/changeToDoAction', require("./endpoints/changeToDo.js").changeToDo, cloud);
  createEndpoint('/deleteToDoAction',  require("./endpoints/deleteToDo.js").deleteToDo, cloud);
  createEndpoint('/fetchCompletedToDoAction', require("./endpoints/fetchCompletedToDos.js").fetchCompletedToDos, cloud);
};

// Utility function for creating the actual endpoint on the /cloud route
function createEndpoint(endpoint, func, cloud) {
  cloud.post(endpoint, function(req, res) {
    func(req.body, function(err, data) {
      if (err) return handleError(err, res);
      res.json(data);
    });
  });
};

function handleError(err, res) {
  res.statusCode = 500;
  return res.end(util.inspect(err));
};

// DATASET_ID = The namespace for the dataset. This allows multiple different datasets to be managed by a single applications.
var TODOS_DATASET_ID = "toDo";

// Dependency on sync modules for different datasets.
var toDoDataHandler = require("./services/sync/toDoDataHandler.js");

// Global module level variables.
var MODULE_NAME = "Main.js: ";


// Execute set of methods to create master data collections.
masterDataDAO.createRoleMasterDataCollection();

// Execute set of methods to delete all data collections.
// masterDataDAO.deleteMasterDataCollection();


/*
 * The Data Sync Framework manages syncing data between the App Cloud and the App Client (i.e. mobile device).
 * The app developer must provide the functions for handling data synchronisation between the back end data
 * store and the App Cloud. The "back end data store" is a simple Cloud Database which is implemented using
 * the $fh.db() API. See toDoDataHandler.js for the implementation of the various functions defined below.
 */
fh.sync.init(TODOS_DATASET_ID, {}, function()
{
    fh.sync.handleCreate(TODOS_DATASET_ID, toDoDataHandler.doCreate);
    fh.sync.handleRead(TODOS_DATASET_ID, toDoDataHandler.doRead);
    fh.sync.handleUpdate(TODOS_DATASET_ID, toDoDataHandler.doUpdate);
    fh.sync.handleDelete(TODOS_DATASET_ID, toDoDataHandler.doDelete);
    fh.sync.handleCollision(TODOS_DATASET_ID, toDoDataHandler.doCollision);
    fh.sync.handleList(TODOS_DATASET_ID, toDoDataHandler.doList);
});


/**
 * To allow the sync client to interact with the cloud dataset, a function is required in main.js who's name is
 * same as the TODOS_DATASET_ID, in this case "toDo". The implmentation for this function is alwyas a call to sync.invoke().
 *
 * @params - Receives request parameters from client.
 */
function toDo(requestParams, callback){
    return fh.sync.invoke(TODOS_DATASET_ID, requestParams, callback);
};
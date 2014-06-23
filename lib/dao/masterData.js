/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility/helper functions to handle operations on master data collection in database.
 * - Create master data collections if not exist.
 * - Delete all collections from system.
 */


// Dependencies.
var winston = require("winston");
var constants = require("../config/constants.js");
var utils = require("../utils/utils.js");
var jsonUtils = require("../utils/jsonUtils.js");
var userDAO = require("../dao/user.js");
var fh = require('fh-mbaas-api');

var MasterDataDAO = function() {
  // Global module level variables.
  var MODULE_NAME = "MasterDataDAO: ",
    ROLE_COLLECTION_NAME = "role",
    TODO_COLLECTION_NAME = "toDo",
    USER_COLLECTION_NAME = "user";

  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.createRoleMasterDataCollection = createRoleMasterDataCollection;
  this.deleteMasterDataCollection = deleteMasterDataCollection;


  /**
   * Public function to create Role master data collection.
   * - Checks whether Role collection exists in the DB.
   * - If does not exist, create Role collection in the DB.
   */
  function createRoleMasterDataCollection() {
    var METHOD_NAME = "createRoleMasterDataCollection(): ";

    // Define an empty array to construct Role collection data.
    var roleCollectionDataObject = [];

    // Set of boolean flags to identify which role is missing in collection.
    var isRoleCollectionEmpty = false,
      isAdminRolePresent = false,
      isUserRolePresent = false;

    // Read all data from Role collection.
    readFromMasterDataCollection(ROLE_COLLECTION_NAME, function handleReadResponse(error, responseData) {
      // If we find any error reading Role collection then assume role collection does not exist in database.
      if (error) {
        isRoleCollectionEmpty = true;
      } else {
        // If response is empty.
        if (responseData == null || responseData == undefined) {
          isRoleCollectionEmpty = true;
        }

        // List exists?
        if (!jsonUtils.isPath(responseData, "list") || utils.isBlank(jsonUtils.getPath(responseData, "list"))) {
          isRoleCollectionEmpty = true;
        }

        // Get list of roles.
        console.log('********* responseData', responseData);
        var rolesList = responseData.list;

        // Iterate through all the roles available in database.
        for (var i = 0; i < rolesList.length; i++) {
          // Get single role data object from collection of roles.
          var roleObject = rolesList[i];

          // Check whether 'type' property of role is exist and not blank.
          if (jsonUtils.isPath(roleObject, "fields.type") && !utils.isBlank(jsonUtils.getPath(roleObject, "fields.type"))) {
            // Get type of role.
            var roleType = jsonUtils.getPath(roleObject, "fields.type");

            // If type of role is Admin then admin role already exist in database.
            if (constants.ROLE_ADMIN == roleType) {
              isAdminRolePresent = true;
            }
            // If type of role is User then user role already exist in database.
            else if (constants.ROLE_USER == roleType) {
              isUserRolePresent = true;
            }
          }
        }
      }

      // Check if Role collection is empty or check if admin role not present in database.
      if (isRoleCollectionEmpty || !isAdminRolePresent) {
        // If Role collection is empty or admin role is not present in database then construct admin role data object.
        roleCollectionDataObject.push({
          "type": constants.ROLE_ADMIN,
          "name": "System Administrator",
          "desc": "Super user of the entire system. He has access to all.",
          "accessDetails": {
            "portal": [],
            "app": []
          }
        });
      }

      // Check if Role collection is empty or check if user role not present in database.
      if (isRoleCollectionEmpty || !isUserRolePresent) {
        // If Role collection is empty or user role is not present in database then construct user role data object.
        roleCollectionDataObject.push({
          "type": constants.ROLE_USER,
          "name": "User",
          "desc": "Performs TODO assigned by Admin or other users.",
          "accessDetails": {
            "portal": [],
            "app": []
          }
        });
      }

      // If data collection to be inserted is not empty then execute insert operation.
      if (roleCollectionDataObject.length != 0) {
        // Insert entire map into Role collection.
        insertIntoMasterDataCollection(ROLE_COLLECTION_NAME, roleCollectionDataObject, function handleInsertResponse(error, responseData) {
          // If failed to insert data into Role collection, log error message.
          if (error) {
            winston.error(MODULE_NAME + METHOD_NAME + "Error inserting data into Role collection - " + JSON.stringify(error));
          } else {
            winston.info(MODULE_NAME + METHOD_NAME + "Data inserted into Role collection - " + JSON.stringify(responseData));

            // After Role collection is created create default users into system.
            userDAO.insertUsersIntoSystem();
          }
        });
      }
    });
  };


  /**
   * Public function to clear data from all collections (Only used to wipe all data from database).
   * - Clears data from Role, User and ToDo collections.
   */
  function deleteMasterDataCollection() {
    var METHOD_NAME = "deleteMasterDataCollection(): ";

    // Delete records from Role collection.
    deleteAllCollection(ROLE_COLLECTION_NAME, function(roleError, roleSuccess) {
      if (roleError) {
        winston.error(MODULE_NAME + METHOD_NAME + "Error deleting data from Role collection - " + JSON.stringify(roleError));
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Data deleted from Role collection - " + JSON.stringify(roleSuccess));
    });

    // Delete records from User collection.
    deleteAllCollection(USER_COLLECTION_NAME, function(userError, userSuccess) {
      if (userError) {
        winston.error(MODULE_NAME + METHOD_NAME + "Error deleting data from User collection - " + JSON.stringify(userError));
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Data deleted from User collection - " + JSON.stringify(userSuccess));
    });

    // Delete records from ToDo collection.
    deleteAllCollection(TODO_COLLECTION_NAME, function(toDoError, toDSuccess) {
      if (toDoError) {
        winston.error(MODULE_NAME + METHOD_NAME + "Error deleting data from ToDo collection - " + JSON.stringify(toDoError));
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Data deleted from ToDo collection - " + JSON.stringify(toDSuccess));
    });
  };


  /**
   * Private function which will insert entire object into collection.
   *
   * @param collectionName - Name of collection in which data to be inserted.
   * @param collectionObject - Object containing data to be inserted.
   * @returns callback - Callback containing error or response data after performing insert operation.
   */
  function insertIntoMasterDataCollection(collectionName, collectionObject, callback) {
    fh.db({
        "act": "create",
        "type": collectionName,
        "fields": collectionObject
      },
      function(error, responseData) {
        if (error) {
          return callback(error, null);
        } else {
          return callback(null, responseData);
        }
      });
  };


  /**
   * Private function which will read entire collection.
   *
   * @param collectionName - Name of collection from which data to be read.
   * @returns callback - Callback containing error or response data after performing read operation.
   */
  function readFromMasterDataCollection(collectionName, callback) {
    fh.db({
        "act": "list",
        "type": collectionName
      },
      function(error, responseData) {
        if (error) {
          return callback(error, null);
        } else {
          return callback(null, responseData);
        }
      });
  };


  /**
   * Private function which will delete entire data from collection.
   *
   * @param collectionName - Name of collection from which data to be deleted.
   * @returns callback - Callback containing error or response data after performing deleteAll operation.
   */
  function deleteAllCollection(collectionName, callback) {
    fh.db({
        "act": "deleteall",
        "type": collectionName
      },
      function(error, responseData) {
        if (error) {
          return callback(error, null);
        } else {
          return callback(null, responseData);
        }
      });
  };
};

// Export module.
module.exports = new MasterDataDAO();
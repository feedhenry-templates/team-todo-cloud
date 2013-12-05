/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility / helper functions to perform operations on User collection.
 * - Insert user into database.
 * - Fetch user details from database.
 */


// Dependencies.
var winston = require("winston");
var utils = require("../utils/utils.js");
var jsonUtils = require("../utils/jsonUtils.js");
var constants = require("../config/constants.js");
var toDoDAO = require("../dao/toDo.js");
var validation = require("../utils/daoValidation.js");


var UserDataDAO = function()
{
  // Global module level variables.
  var MODULE_NAME = "UserDAO.js: ";
  var USER_COLLECTION_NAME = "user";
  var ROLE_COLLECTION_NAME = "role";

  // Public functions.
  this.fetchUser = fetchUser;
  this.fetchUserList = fetchUserList;
  this.insertUsersIntoSystem = insertUsersIntoSystem;
  this.listFromCollection = listFromCollection;

  /**
   * public function to create User collection.
   * - Checks whether User collection exists in the DB.
   * - If does not exist, create User collection in the DB and insert one user of type Admin,User.
   */
  function insertUsersIntoSystem()
  {
    var METHOD_NAME = "insertUsersIntoSystem(): ";

    // Convert passwords into base64 encoded strings.
    var adminEncoder = new Buffer("Firehouse").toString('base64');
    var userEncoder = new Buffer("TheKeymaster").toString('base64');

    var adminRoleId, userRoleId;

    // Construct search criteria object.
    var adminSearchCriteriaEqualObject =
    {
      "type": constants.ROLE_ADMIN
    }

    var adminSearchCriteriaNotEqualObject = null;

    // Get details of admin role from Role collection to get id of admin role.
    listFromCollection(ROLE_COLLECTION_NAME, adminSearchCriteriaEqualObject, adminSearchCriteriaNotEqualObject, function handleUserDataResponse(adminRoleErrorData, adminRoleResponseData)
    {
      if (adminRoleErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Admin role not found in DB - " + JSON.stringify(adminRoleErrorData));
      }
      else
      {
        // Extract admin role id from fetched admin role database response.
        adminRoleId = adminRoleResponseData.list[0].guid;
        winston.info(MODULE_NAME + METHOD_NAME + "Admin role guid - " + adminRoleId);
      }

      // If admin role exists in database, construct admin user data object.
      if (adminRoleId)
      {
        var adminUserDataObject =
        {
          "basicInfo":
          {
            "firstName": constants.DEFAULT_ADMIN_USER_JANINE,
            "lastName": "",
            "gender": "",
            "email": "",
            "phone": ""
          },
          "accountInfo":
          {
            "userName": constants.DEFAULT_ADMIN_USER_JANINE,
            "password": adminEncoder,
            "roleId": adminRoleId
          },
          "address":
          {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zip": ""
          }
        }

        // Insert admin user into User collection.
        insertIntoCollection(USER_COLLECTION_NAME, adminUserDataObject, function handleInsertResponse(error, responseData)
        {
          if (error)
          {
            winston.error(MODULE_NAME + METHOD_NAME + "Error inserting admin user into User collection - " + JSON.stringify(error));
          }
          else
          {
            winston.info(MODULE_NAME + METHOD_NAME + "Admin user inserted into User collection - " + JSON.stringify(responseData));
          }
        });
      }
    });

    // Construct search criteria object.
    var userSearchCriteriaEqualObject =
    {
      "type": constants.ROLE_USER
    }

    var userSearchCriteriaNotEqualObject = null;

    // Get details of user role from Role collection to get id of user role.
    listFromCollection(ROLE_COLLECTION_NAME, userSearchCriteriaEqualObject, userSearchCriteriaNotEqualObject, function handleUserDataResponse(userRoleErrorData, userRoleResponseData)
    {
      if (userRoleErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Admin role not found in DB - " + JSON.stringify(userRoleErrorData));
      }
      else
      {
        // Extract user role id from fetched user role database response.
        userRoleId = userRoleResponseData.list[0].guid;
        winston.info(MODULE_NAME + METHOD_NAME + "User role guid - " + userRoleId);
      }

      // if user role exists in database, construct users data collection object.
      if (userRoleId)
      {
        var UserDataObject =
        [
          {
            "basicInfo":
            {
              "firstName": constants.DEFAULT_USER_SPENGLER,
              "lastName": "",
              "gender": "",
              "email": "",
              "phone": ""
            },
            "accountInfo":
            {
              "userName": constants.DEFAULT_USER_SPENGLER,
              "password": userEncoder,
              "roleId": userRoleId
            },
            "address":
            {
              "line1": "",
              "line2": "",
              "city": "",
              "state": "",
              "country": "",
              "zip": ""
            }
          },
          {
            "basicInfo":
            {
              "firstName": constants.DEFAULT_USER_VENKMAN,
              "lastName": "",
              "gender": "",
              "email": "",
              "phone": ""
            },
            "accountInfo":
            {
              "userName": constants.DEFAULT_USER_VENKMAN,
              "password": userEncoder,
              "roleId": userRoleId
            },
            "address":
            {
              "line1": "",
              "line2": "",
              "city": "",
              "state": "",
              "country": "",
              "zip": ""
            }
          },
          {
            "basicInfo":
            {
              "firstName": constants.DEFAULT_USER_STANTZ,
              "lastName": "",
              "gender": "",
              "email": "",
              "phone": ""
            },
            "accountInfo":
            {
              "userName": constants.DEFAULT_USER_STANTZ,
              "password": userEncoder,
              "roleId": userRoleId
            },
            "address":
            {
              "line1": "",
              "line2": "",
              "city": "",
              "state": "",
              "country": "",
              "zip": ""
            }
          },
          {
            "basicInfo":
            {
              "firstName": constants.DEFAULT_USER_ZEDDEMORE,
              "lastName": "",
              "gender": "",
              "email": "",
              "phone": ""
            },
            "accountInfo":
            {
              "userName": constants.DEFAULT_USER_ZEDDEMORE,
              "password": userEncoder,
              "roleId": userRoleId
            },
            "address":
            {
              "line1": "",
              "line2": "",
              "city": "",
              "state": "",
              "country": "",
              "zip": ""
            }
          }
        ]

        // Insert users into User collection.
        insertIntoCollection(USER_COLLECTION_NAME, UserDataObject, function handleInsertResponse(error, responseData)
        {
          if (error)
          {
            winston.error(MODULE_NAME + METHOD_NAME + "Error inserting admin user into User collection - " + JSON.stringify(error));
          }
          else
          {
            winston.info(MODULE_NAME + METHOD_NAME + "User inserted into User collection - " + JSON.stringify(responseData));

            // After User collection is created create default ToDos into system.
            toDoDAO.insertToDoIntoSystem();
          }
        });
      }
    });
  };


  /**
   * Function to validate user name and password received in request with existing users in Mongo DB.
   * - Receives user name and password as parameters.
   * - Sends status, true if user name and password found in DB, false otherwise. 
   * - Sends message, error message.
   */
  function fetchUser(authenticationParams, callback)
  {
    var METHOD_NAME = "fetchUser(): ";

    // Extract application type from request parameters.
    var appType = authenticationParams.appType;

    winston.info(MODULE_NAME + METHOD_NAME + "Fetching user from DB.");

    // Extract password from request parameters and encode it using base64.
    var password = authenticationParams.password;
    var encoder = new Buffer(password).toString('base64');

    // Construct user search criteria object.
    var userSearchCriteriaEqualObject =
    {
      "accountInfo.userName": authenticationParams.userName,
      "accountInfo.password": encoder
    }

    var userSearchCriteriaNotEqualObject = null;

    // Get details of user.
    listFromCollection(USER_COLLECTION_NAME, userSearchCriteriaEqualObject, userSearchCriteriaNotEqualObject, function handleUserDataResponse(userErrorData, userResponseData)
    {
      // If we find any error reading User collection, return failure callback.
      if (userErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from User collection - " + JSON.stringify(userErrorData));
        return callback(
        {
          message: "Authentication failed."
        }, null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Received data from User collection - " + JSON.stringify(userResponseData));

      // Validate fetched user details.
      var validateResponseData = validation.validateAuthenticateUserResponseData(userResponseData);

      // If fetched user details are invalid, return failure callback.
      if (!validateResponseData.status)
      {
        return callback(
        {
          message: validateResponseData.errorMessage
        }, null);
      }

      // If everything is fine, generate response.
      var userData = userResponseData.list[0];

      // Exract role if from user details.
      var roleId = userData.fields.accountInfo.roleId

      // Get name of role using role id.
      readFromCollection(ROLE_COLLECTION_NAME, roleId, function handleUserDataResponse(roleErrorData, roleResponseData)
      {
        // If we find any error reading Role collection, return failure callback.
        if (roleErrorData)
        {
          winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from Role collection - " + JSON.stringify(roleErrorData));

          return callback(
          {
            message: "Cannot find user role."
          }, null);
        }

        winston.info(MODULE_NAME + METHOD_NAME + "Received data from Role collection - " + JSON.stringify(roleResponseData));

        // Extract name role from fetched role database response.
        var role = roleResponseData.fields.type;

        // If application type is portal then user role must be of type admin.
        // If application type is client then user role must be of type user.
        // If any of the criteria is true, send success response to endpoint.
        if ((appType == constants.APPTYPE_PORTAL && role == constants.ROLE_ADMIN) || (appType == constants.APPTYPE_CLIENT && role == constants.ROLE_USER))
        {
          var response =
          {
            "userId": userData.guid,
            "firstName": userData.fields.basicInfo.firstName,
            "lastName": userData.fields.basicInfo.lastName,
            "email": userData.fields.basicInfo.email,
            "role": role
          }

          winston.info(MODULE_NAME + METHOD_NAME + "Response after authenticating user - " + JSON.stringify(response));
          return callback(null, response);
        }

        // If both the criteria are not satisfied, send failure callback.
        winston.error(MODULE_NAME + METHOD_NAME + "Authentication Failure.Access is denied - ");
        return callback(
        {
          message: "Authentication Failure.Access is denied."
        }, null);
      });
    });
  };


  /**
   * Function to fetch all users list (except admin users).
   * - Sends list of users.
   */
  function fetchUserList(param, callback)
  {
    var METHOD_NAME = "fetchUserList(): ";

    winston.info(MODULE_NAME + METHOD_NAME + "Fetching users from DB.");

    // Construct search criteria object.
    var roleSearchCriteriaEqualObject =
    {
      "type": constants.ROLE_USER
    }

    var roleSearchCriteriaNotEqualObject = null;

    // Fetch id of user role from Role collection.
    listFromCollection(ROLE_COLLECTION_NAME, roleSearchCriteriaEqualObject, roleSearchCriteriaNotEqualObject, function handleUserDataResponse(roleErrorData, roleResponseData)
    {
      // If we find any error reading Role collection, return failure callback.
      if (roleErrorData)
      {
        winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from Role collection - " + JSON.stringify(roleErrorData));
        return callback(
        {
          message: "Error reading data from Role collection."
        }, null);
      }

      winston.info(MODULE_NAME + METHOD_NAME + "Received data from Role collection - " + JSON.stringify(roleResponseData));

      // Validate fetched database response.
      var validateResponseData = validation.validateRoleResponseData(roleResponseData);

      // If fetched database response is invalid, return failure callback.
      if (!validateResponseData.status)
      {
        return callback(
        {
          message: validateResponseData.errorMessage
        }, null);
      }

      // Extract details of role details.
      var roleData = roleResponseData.list[0];

      // Extract role id from role details.
      var roleId = roleData.guid;

      // Construct user search criteria object.
      var userSearchCriteriaEqualObject =
      {
        "accountInfo.roleId": roleId
      };

      var userSearchCriteriaNotEqualObject = null;

      // Fetch list of user from User collection.
      listFromCollection(USER_COLLECTION_NAME, userSearchCriteriaEqualObject, userSearchCriteriaNotEqualObject, function handleUserDataResponse(userErrorData, userResponseData)
      {
        // If we find any error reading User collection, return failure callback.
        if (userErrorData)
        {
          winston.error(MODULE_NAME + METHOD_NAME + "Error reading data from User collection - " + JSON.stringify(userErrorData));
          return callback(
          {
            message: "Error reading data from User collection."
          }, null);
        }

        winston.info(MODULE_NAME + METHOD_NAME + "Received data from ToDo collection - " + JSON.stringify(userResponseData));

        // Validate fetched user collection object.
        var validateResponseData = validation.validateUserResponseData(userResponseData);

        // if fetched user database response is invalid, return failure callback.
        if (!validateResponseData.status)
        {
          return callback(
          {
            message: validateResponseData.errorMessage
          }, null);
        }

        // Get list of users.
        var userData = userResponseData.list;

        var responseTodoList = [];

        // Iterate through each user details.
        for (var i = 0; i < userData.length; i++)
        {
          // Construct final response having required user details.
          var responseTodoObject =
          {
            "userId": userData[i].guid,
            "userName": userData[i].fields.basicInfo.firstName
          };

          // Add user details in final response collection object.
          responseTodoList.push(responseTodoObject);
        }

        return callback(null, responseTodoList);
      });
    });
  };



  /**
   * Function to retreive user's data based on guid.
   * - Receives user name and password as parameters.
   * - Returns error or success response. 
   */
  function readFromCollection(collectionName, guid, callback)
  {
    $fh.db(
    {
      "act": "read",
      "type": collectionName,
      "guid": guid
    },
    function(error, responseData)
    {
      if (error)
      {
        return callback(error, null);
      }
      else
      {
        return callback(null, responseData);
      }
    });
  };


  /**
   * Function to retreive ToDo's data based on search criteria.
   * - Receives search criteria as parameters.
   * - Returns error or success response. 
   */
  function listFromCollection(collectionName, SearchCriteriaEqualObject, SearchCriteriaNotEqualObject, callback)
  {
    $fh.db(
    {
      "act": "list",
      "type": collectionName,
      "eq": SearchCriteriaEqualObject,
      "ne": SearchCriteriaNotEqualObject
    },
    function(error, responseData)
    {
      if (error)
      {
        return callback(error, null);
      }
      else
      {
        return callback(null, responseData);
      }
    });
  };


  /**
   * Private function which will insert entire object into collection.
   *
   * @param collectionName - Name of collection in which data to be inserted.
   * @param collectionObject - Object containing data to be inserted.
   * @returns callback - Callback containing error or response data after performing insert operation.
   */
  function insertIntoCollection(collectionName, collectionObject, callback)
  {
    $fh.db(
    {
      "act": "create",
      "type": collectionName,
      "fields": collectionObject
    },
    function(error, responseData)
    {
      if (error)
      {
        return callback(error, null);
      }
      else
      {
        return callback(null, responseData);
      }
    });
  };
};

// Export module.
module.exports = new UserDataDAO();
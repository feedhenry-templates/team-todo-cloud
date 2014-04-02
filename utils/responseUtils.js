/**
 * Copyright (c) 2013, FeedHenry Ltd. All Rights Reserved.
 *
 * Class which exposes collection of utility / helper functions to construct Json responses to the client.
 * - Constructs a template for response Json message.
 * - Constructs an error response Json message.
 */


// Dependencies.
var constants = require("../config/constants.js");


var ResponseUtils = function()
{
  // Public functions (this.methodName makes a method publicly accessible, otherwise it is accessible only within module).
  this.constructResponseJson = constructResponseJson;
  this.constructStatusResponseJson = constructStatusResponseJson;
  this.constructErrorResponseJson = constructErrorResponseJson;
  this.constructAuthFailureResponseJson = constructAuthFailureResponseJson;


  /**
   * Function to construct a placeholder template for a typical Response Json message.
   * 
   * @return JSON
   */
  function constructResponseJson()
  {
    return response =
    {
      "response":
      {
        "header":
        {
        },
        "payload":
        {
        }
      }
    };
  };


  /**
   * Function to construct a "status" response JSON message.
   * 
   * @param childUnderPayload
   * @param statusCode
   * @param statusMsg
   * @return JSON
   */
  function constructStatusResponseJson(childUnderPayload, statusCode, statusMessage)
  {
    var wrapper = this.constructResponseJson();

    wrapper.response.payload[childUnderPayload] =
    {
      "status":
      {
        "code": statusCode,
        "message": statusMessage
      }
    };

    return wrapper;
  };


  /**
   * Function to construct an error response JSON message.
   * 
   * @param statusCode
   * @param statusMsg
   * @returns
   */
  function constructErrorResponseJson(statusCode, category, title, statusMessage)
  {
    var wrapper = this.constructResponseJson();

    wrapper.response.payload["error"] =
    {
      "status": statusCode,
      "category": category,
      "title": title,
      "description": statusMessage
    };

    return wrapper;
  };


  /**
   * Function to create an authorization failure response JSON message.
   * 
   * @param sessionId
   * @return JSON
   */
  function constructAuthFailureResponseJson(sessionId)
  {
    if (sessionId)
    {
      return this.constructErrorResponseJson(constants.RESP_AUTH_FAILED, "Authorization failure. Session does not exist for sessionId: " + sessionId);
    }

    return this.constructErrorResponseJson(constants.RESP_AUTH_FAILED, "Authorization failure. sessionId not specified.");
  };
};


// Export Module.
module.exports = new ResponseUtils();
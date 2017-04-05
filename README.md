See http://docs.feedhenry.com/ for more information on building node.js services on the FeedHenry platform.

# Cloud: #
[![Dependency Status](https://img.shields.io/david/feedhenry-templates/team-todo-cloud.svg?style=flat-square)](https://david-dm.org/feedhenry-templates/team-todo-cloud)

Cloud application exposes the set of REST endpoint api's for client applications. Whenever request arrives from client application, it communicates with the data layer and sends the generated the response back to the client application.
Cloud app is mainly distributed into endpoints, data layer and service layer. Endpoints are mainly responsible for receiving client requests, validate it and forward it to data layer. Endpoints are also responsible for massaging data returned by data layer.

Data layer is mainly responsible for communicating with database. It performs all CRUD operations. Service layer is mainly responsible for providing ability to Client apps to sync the cloud data periodically.

### main.js ###
 This is the entry point for cloud application. It exposes set of REST endpoint API’s. Client applications communicate with Cloud application through “main.js”. This file is located at the root directory of cloud application.
 
### Package.json ###
 It is used to define various meta-data relevant to the project. It is used to give information to npm that allows it to identify the project as well as handle the project’s dependancies. It can also contain other meta-data such as a project description, version of the project in a particular distribution, license information, even configuration data. The “package.json” file is located at the root directory of cloud application.

## Directory Structure: ##

### config ###
 
It consists of modules defining constants and configuration parameters for cloud app.

### dao
It contains modules which communicates with database and performs basic CRUD operations.
### endpoints ###
It consists of modules which carries out main business operations.
### lib ###
It consists of set of library modules for session management and logger.
services - It contains module to carry out operations of cloud sync service.
### tests ###
It contains modules defining test cases for each endpoint.
### utils ###
It consists of modules defining helper function to validate data, generate response structure, validate json object hierarchy etc.

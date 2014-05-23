var mbaas = require('fh-mbaas-express');
var express = require('express');

var app = express();
var securableEndpoints = [
  'authenticateAction',
  'logoutAction',
  'createToDoAction',
  'fetchToDoAction',
  'updateToDoAction',
  'fetchUserListAction',
  'completeToDoAction',
  'changeToDoAction',
  'deleteToDoAction',
  'fetchCompletedToDoAction'
];

app.use('/sys', mbaas.sys(securableEndpoints));
app.use('/mbaas', mbaas.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaas.fhmiddleware());

app.use('/cloud', require('./lib/cloud.js')());

// You can define custom URL handlers here, like this one:
app.use('/', function(req, res){
  res.end('Your Cloud App is Running');
});

// Important that this is last!
app.use(mbaas.errorHandler());

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8001;
module.exports = app.listen(port, function(){
  console.log("App started at: " + new Date());
});

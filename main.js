var express = require('express');
var app = express();
var monk = require('monk');
var db = monk("localhost/heart");
var collection = db.get("db");

app.get("/",function(req,res){
});
app.get("/post",function(req,res){
  //switch to post request
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


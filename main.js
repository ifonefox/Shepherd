var express = require('express');
var app = express();
var monk = require('monk');
var db = monk("localhost/heart");
var col = db.get("db");

app.get("/",function(req,res){
  var dataPromise = col.find({},{sort:{$natural:1}});
  dataPromise.then(function(data){
    var str = JSON.stringify(data, null, 2);
    res.send(str);
  });
});
app.get("/post",function(req,res){
  var bpm = req.query.bpm
  var user = req.query.user || "test"
  var time = new Date();
  var data = {time:time,bpm:bpm,user:user};
  col.insert(data);
  res.send(data);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


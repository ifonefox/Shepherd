var express = require('express');
var app = express();
var monk = require('monk');
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
  //authentication added here
  var bpm = req.query.bpm
  var user = req.query.user || "test"
  var time = new Date();
  var data = {time:time,bpm:bpm,user:user};
  col.insert(data);
  res.send(data);
});
app.get("/drop",function(req,res){
  db.driver.open(function(_,db2){
    if(db2 === null){
      //sometimes db is null. If it is, wait and try this function again.
      setTimeout(function(){
        drop(done);
      },1000);
    } else {
      db2.dropDatabase(function(ignore,status){
         if(status){
           console.log("Dropped database");
         } else {
            console.log("Error dropping mongod");
            console.log(error);
         }
      });
    }
  });
  res.send("");
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


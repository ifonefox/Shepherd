var express = require('express');
var app = express();
var monk = require('monk');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var events = require('events');

var db = monk("localhost/heart");
var col = db.get("db");

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
function estatic(name){
  app.use('/'+name,express.static(name));
}
estatic('js');
estatic('css');
estatic("bower_components");

var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(100);


app.get("/post",function(req,res){
  //authentication added here
  var bpm = req.query.bpm
  var user = req.query.user || "test"
  var time = new Date();
  var rawdata = {time:time,bpm:bpm,user:user};
  var dataPromise = col.find({user:user});
  dataPromise.then(function(data){
    col.insert(rawdata);
    if(data.length === 0){
      eventEmitter.emit("new_name",user);
    } 
    eventEmitter.emit(user);
  });
  res.send(rawdata);
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


io.on('connection',function(socket){
  function create_name_event(name){
    eventEmitter.on(name,function(){
      var time = new Date(new Date() - (5000 * 60));
      var dataPromise = col.find({user:name,time:{$gt:time}},{sort:{$natural:1}});
      dataPromise.then(function(data){
        for(var i = 0; i < data.length; i++){
          delete data[i]._id;
          delete data[i].user;
        }
        socket.emit(name,data);
      });
    });
    eventEmitter.on("all",function(){
      eventEmitter.emit(name);
    });
    socket.on(name,function(){
      eventEmitter.emit(name);
    });
  }
  eventEmitter.on("new_name",function(name){
    create_name_event(name);
    var dataPromise = col.distinct("user",{});
    dataPromise.then(function(data){
      data = data.sort();
      socket.emit("names",data);
    });
  });
  var dataPromise = col.distinct("user",{});
  dataPromise.then(function(data){
    data = data.sort();
    for(var i = 0; i < data.length; i++){
      create_name_event(data[i]);
    }
    socket.emit("names",data);
  });
  socket.on("disconnect",function(){
    eventEmitter.removeAllListeners();
  });
});

setInterval(function(){
  eventEmitter.emit("all");
},1000)
var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


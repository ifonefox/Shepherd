var exec = require('child_process').exec;
var monk = require('monk');
var readline = require('readline');
var fs = require('fs');
var http = require('http');
var os = require('os');



module.exports = function(grunt){

  function if_mongod_running(running,not_running){
    /*
    This function exists becaue you cannot register a task that does a task, then does a function.
    You must pass an array of tasks or a function to registerTask, not an array of tasks and functions
    This could be avoided in future versions of Grunt, when they impliment private tasks.
    */
    var temp = function(){
      var done = this.async();
      exec("ps -A | grep '[m]ongod'",function(error, stdout, stderr){
        if(error === null){
          //running
          if(running === true){
            done(true);
          } else if(running === false){
            done(false);
          } else {
            running(done);
          }
        } else {
          //not running
          if(not_running === true){
            done(true);
          } else if(not_running === false){
            done(false);
          } else {
            not_running(done);
          }
        }
      });
    };
    return temp;
  }
  function mongorestore(done){
    exec("mongorestore",function(error, stdout, stderr){
      var status = (error === null);
      if(!status){
        console.log("Error: ");
        console.log(error);
      }
      done(status);
    });
  }
  function start_mongod(done){
    exec("mongod --fork --logpath mongo/logs/mongo.log --dbpath mongo/db",function(error, stdout, stderr){
      if(error === null){
        console.log("Mongod is now running");
        done(true);
      } else {
        done(false);
      }
    });
  }
  function stop_mongod(done){
    exec("mongo --eval \"db = db.getSiblingDB('admin');db.shutdownServer()\"",function(error, stdout, stderr){
      if(error === null){
        done(true);
      } else {
        done(false);
      }
    });
  }
  function drop(done){
    var adsb = monk("localhost/heart");
    adsb.driver.open(function(_,db){
      if(db === null){
        //sometimes db is null. If it is, wait and try this function again.
        setTimeout(function(){
          drop(done);
        },1000);
      } else {
        db.dropDatabase(function(ignore,status){
           if(status){
             console.log("Dropped database");
             done(true);
           } else {
              console.log("Error dropping mongod");
              console.log(error);
              done(false);
           }
        });
      }
    });
  }
  grunt.registerTask("mongod_running","Check if mongod is running",if_mongod_running(true,false));
  grunt.registerTask("start_mongod","Starts mongod",if_mongod_running(true,start_mongod));
  grunt.registerTask("stop_mongod","Stops mongod",if_mongod_running(stop_mongod,true));
  //grunt.registerTask("restore","Restores mongodb's data from dump",if_mongod_running(mongorestore,false));
  grunt.registerTask("drop","Removes all captured data",if_mongod_running(drop,false));

}

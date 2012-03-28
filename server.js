var cluster = require('cluster')
  , colors = require('colors')
  , fs = require('fs')
  , app = require('./app')
  , peopleObject
  , workers = []
  
if (cluster.isMaster) {
  console.log("");
  console.log(" --------------  ".blue + "Morning & Evening".rainbow + "  ---------------  ".blue);
  console.log("");
  
  // Fork workers.
  for (var i = 0; i < 4; i++) {
    workers[i] = cluster.fork()
  }
  
  cluster.on('death', function(worker) {
    // We need to spin back up on death.
    cluster.fork()
    console.log(' * Worker '.red + worker.pid + ' died'.red);
  })
  
} else {
  app.listen(process.env.PORT || 8001)
}
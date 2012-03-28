var cluster = require('cluster')
  , colors = require('colors')
  , fs = require('fs')
  , _ = require('underscore')
  , app = require('./app')
  , numCPUs = require('os').cpus().length
  , peopleObject
  , workers = []
  
if (cluster.isMaster) {
  console.log("");
  console.log(" --------------  ".blue + "Morning & Evening".rainbow + "  ---------------  ".blue);
  console.log("");
  
  numWorkers = (numCPUs >= 2)?numCPUs:2;
  
  // Fork workers.
  for (var i = 0; i < numWorkers; i++) {
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
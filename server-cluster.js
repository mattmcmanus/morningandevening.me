var cluster = require('cluster')
  , colors = require('colors')
  , fs = require('fs')
  , app = require('./app')
  , peopleObject
  , workers = []
  , jsdom = require('jsdom')
  , html = require('fs').readFileSync(__dirname+'/morning-and-evening.html')
  , content;

jsdom.env({
  html: html,
  scripts: [
    'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js'
  ],
  done: function(errors, window) {
    content = window
  }
});
  
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
  app.content = content
  app.listen(process.env.PORT || 8001)
}
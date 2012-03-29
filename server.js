
/**
 * Module dependencies.
 */

var express = require('express')
  , colors = require('colors')
  , fs = require('fs')
  , moment = require('moment')
  , jsdom = require('jsdom')
  , content
  , current
  , jquery = fs.readFileSync("./public/js/libs/jquery-1.7.1.min.js");

console.log(" * Process ".green + process.pid+ " started".green)

jsdom.env({
  html: fs.readFileSync(__dirname+'/morning-and-evening.html'),
  src: [
    jquery
  ],
  done: function(errors, window) {
    content = window
  }
});


function loadCurrent() {
  var day = moment().format("MMMMD")
    , hour = moment().format("H")
    , time = (hour > 15)?'evening':'morning';
    
    current = content.$("#"+day+"_"+time).html()
    
    console.log(moment().format("MM-D-HH:MM:ss")+" - Reloading current data".green)
}

var loadCurrentInt = setInterval( loadCurrent , 3600000) //3600000 = 1 hour
setTimeout( loadCurrent , 1000 ) 

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//                        Routes
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.get('/', function(req, res){
  res.render('index', { 
      date: moment().format("MMMM Do")
    , current: current } 
  )  
});

//app.get('/:month/:day', function(req, res){
//  var day = moment(req.param.month+"-"+req.param.month, ["MMMM-D", "MMM-D", "M-D"]).format("MMMMD")
//    , current = content.$("#"+day+"_morning","#"+day+"_evening").html()
//    
//  res.render('index', { 
//      date: moment(day).format("MMMM Do")
//    , current: current } 
//  ) 
//})

//                     Helpers
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
//app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers)

//                     Errors
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
function NotFound(msg){
  this.name = 'NotFound';
  this.status = 404;
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;

//app.get('/*', function(req, res){
//  throw new NotFound
//})

app.error(function(err, req, res, next){
  console.log("ERROR")
	console.log(err);
	res.status(err.status || 500);
	if (err instanceof NotFound) {
	  res.render('errors/404', {error: err} );
	} else {
	  if (err.status == 403)
	    res.render('errors/403', {error: err} );
	  else
		  res.render('errors/500', {error: err} );
	}
});


console.log("");
console.log(" --------------  ".blue + "Morning & Evening".rainbow + "  ---------------  ".blue);
console.log("");
app.listen(process.env.PORT || 8000)
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

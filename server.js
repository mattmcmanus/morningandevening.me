
/**
 * Module dependencies.
 */

var express = require('express')
  , colors = require('colors')
  , fs = require('fs')
  , gzip = require('connect-gzip')
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
    , hour = moment().local().format("H")
    , time = (hour > 17)?'evening':'morning';
    console.log(hour)
    current = content.$("#"+day+"_"+time).html()
    
    console.log(moment().format("MM-D-HH:MM:ss")+" - Reloading current data".green)
}

var loadCurrentInt = setInterval( loadCurrent , 3600000) //3600000 = 1 hour
setTimeout( loadCurrent , 100 ) 

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  
  // Files
  app.use(gzip.staticGzip(__dirname + '/public'), {maxAge: 1000 * 60 * 60 * 24 * 365})
  app.use(gzip.gzip({ flags: '--best' }))
  app.use(express.logger('dev'));
  app.use(app.router);
})

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
})

app.configure('production', function(){
  app.use(express.errorHandler());
})

//                     Helpers
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.helpers(require('./helpers.js').helpers);
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

//                        Routes
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.get('/', function(req, res){
  res.render('index', { 
      date: moment().format("MMMM Do")
    , curMonth: moment().format("MMM")
    , curDay: moment().format("D")
    , current: current } 
  )  
});

app.get('/:date', function(req, res){
  var day = moment(req.params.date).format("MMMMD")
    , current = content.$("#"+day+"_morning,").html()
    current += "<hr />" + content.$("#"+day+"_evening").html()
  
  if (day=="undefinedNaN") throw new NotFound
  
  res.render('day', { 
      date: moment(day).format("MMMM Do")
    , curMonth: moment(day).format("MMM")
    , curDay: moment(day).format("D")
    , current: current } 
  ) 
})

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

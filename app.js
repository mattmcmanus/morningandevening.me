
/**
 * Module dependencies.
 */

var express = require('express')
  , colors = require('colors')
  , moment = require('moment')
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

console.log(" * Worker ".green + process.pid+ " booted".green)
  
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
  var day = moment().format("MMMMD")
    , hour = moment().format("H")
    , time = (hour > 15)?'evening':'morning'
    , current = content.$("article#"+day+"_"+time).html()
  
  res.render('index', { date: moment().format("MMMM Do"), time: time, current: current } )  
});
//app.get('/:month/:day', routes.day)

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



//app.listen(3000);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

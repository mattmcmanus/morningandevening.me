
/**
 * Module dependencies.
 */

var express = require('express'),
    colors = require('colors'),
    fs = require('fs'),
    gzip = require('connect-gzip'),
    moment = require('moment'),
    me = require('./lib/me.js');
    

console.log(" * Process ".green + process.pid+ " started".green);

me.loadData();

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  
  // Files
  app.use(gzip.staticGzip(__dirname + '/public'), {maxAge: 1000 * 60 * 60 * 24 * 365});
  app.use(gzip.gzip({ flags: '--best' }));
  app.use(express.logger('dev'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//                     Helpers
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers);

//                        Routes
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.get('/', me.resToday );
app.get('/:date/:time?', me.resDay );

app.get('/*', function(req, res){
  res.status = 404;
  res.render('errors/404');
});


//                     Errors
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
function NotFound(msg){
  this.name = 'NotFound';
  this.status = 404;
  Error.call(this, msg);
}
NotFound.prototype = Object.getPrototypeOf(Error.prototype);

app.error(function(err, req, res, next){
	console.log(err);
	res.status(err.status || 500);
	if (err instanceof NotFound) {
    res.render('errors/404', {error: err} );
	} else {
    res.render('errors/500', {error: err} );
	}
});


console.log("");
console.log(" --------------  ".blue + "Morning & Evening".rainbow + "  ---------------  ".blue);
console.log("");

app.listen(process.env.PORT || 8000);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

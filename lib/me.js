/*
 * morningandevening.me
 * https://github.com/mattmcmanus/morningandevening.me
 *
 * Copyright (c) 2012 Matt McManus
 * Licensed under the MIT license.
 */

var fs = require('fs'),
    jsdom = require('jsdom'),
    jquery = fs.readFileSync("./public/js/libs/jquery-1.7.1.min.js"),
    moment = require('moment'),
    resRender;
    
var content = exports.content = null;

//            loadData
// - - - - - - - - - - - - - - - - - - - - - - - - - -
exports.loadData = function() {
  jsdom.env({
    html: fs.readFileSync(__dirname+'/../morning-and-evening.html'),
    src: [
      jquery
    ],
    done: function(errors, window) {
      content = window;
    }
  });
};

//            resRender
// - - - - - - - - - - - - - - - - - - - - - - - - - -
function monthDayTime(m, t) {
  return { month: m.format("MMM"), day: m.format("D"), time: t };
}

exports.resRender = resRender = function(res, m, t) {
  if (!t) {
    t = (m.format("H") >= 3 || m.format("H") < 17) ? 'morning':'evening';
  }
  
  var nm = moment(m), // Next Entry
      pm = moment(m), // Previous Entry
      nt = (t === 'morning') ? 'evening' : 'morning'; // Next Time
      
  if (t === 'evening') {
    nm.add('d', 1);
  } else if (t === 'morning') {
    pm.subtract('d', 1);
  }
  
  res.render('index', { 
    date: m.format("MMMM Do"),
    current: monthDayTime(m, t),
    next: monthDayTime(nm, nt),
    prev: monthDayTime(pm, nt),
    entry: content.$( "#" + m.format("MMMMD") + "_" + t ).html()
  });
};

//            resToday
// - - - - - - - - - - - - - - - - - - - - - - - - - -
exports.resToday = function(req, res){
  resRender(res, moment(req._startTime) );
};

//            resDay
// - - - - - - - - - - - - - - - - - - - - - - - - - -
exports.resDay = function(req, res, next){
  var date = moment(req.params.date),
      time = (req.params.time)?req.params.time:'morning';
  
  if ( date === "undefinedNaN" ) { 
    next();
  } else {
    resRender(res, date, time );
  }
};
exports.helpers = {
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
, days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
, month_classes: function(month, curMonth){
    var classes = []
    if (month == curMonth)
      classes.push('current')
    return classes.join(' ');
  }
, day_classes: function(day, curDay){
    var classes = []
    if (day == curDay)
      classes.push('current')

    if (day == '30' || day == '29')
      classes.push('noFeb')
    if (day == '31')
      classes.push('noFeb noApr noJun noSep noNov')

    return classes.join(' ');
  }
}

exports.dynamicHelpers = {
  body_classes: function(req, res) {
    var classes = []
      , path = require('url').parse(req.url).pathname;
    if (path == '/')
      classes.push('front');
    else {
      classes = path.substr(1).split('/');
      classes[0] = 'type-' + classes[0];
      classes.push('action-' + (classes[2] ? classes[2] : 'show'))
      classes.push('page');
    }
    classes.push((req.session && req.user)?'logged-in':'not-logged-in');
    
    return classes.join(' ');
  }
};
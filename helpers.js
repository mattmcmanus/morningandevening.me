exports.helpers = {
  months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  month_classes: function(month, curMonth){
    var classes = [];
    if (month === curMonth) {
      classes.push('current');
    }
    return classes.join(' ');
  },
  
  day_classes: function(day, curDay){
    var classes = [];
    if (day == curDay) {
      classes.push('current');
    }
    return classes.join(' ');
  },

  thisMonth: function(month, days) {
    if (month == 'Feb') {
      return days.slice(0, 27);
    } else if ( month == 'Apr' || month == 'Jun' || month == 'Sep' || month == 'Nov' ) {
      return days.slice(0, 30);
    } else {
      return days;
    }
  }
};

exports.dynamicHelpers = {
  body_classes: function(req, res) {
    var classes = [],
        path = require('url').parse(req.url).pathname;
    
    if (path === '/') {
      classes.push('front');
    }
    
    return classes.join(' ');
  }
};
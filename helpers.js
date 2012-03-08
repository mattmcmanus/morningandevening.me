exports.helpers = {

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
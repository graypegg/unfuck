function wrap (settings, program) {
  if (typeof settings.target === 'string') {
    var target = require('../language/targets/' + settings.target);
  } else {
    var target = settings.target;
  }

  var context = target.context(settings);
  return context.header + program.join((context.lineEnding || '')) + (context.lineEnding || '') + context.footer;
}

module.exports = wrap;

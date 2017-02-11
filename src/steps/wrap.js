function wrap (settings, program) {

  if (settings.type == Array) {
    var type = "Array(" + settings.width + ").fill(0)"
  } else {
    var type = settings.type.name + "(" + settings.width + ")"
  }

  var target = require('../language/targets/' + settings.target);
  var context = target.context(settings);

  var header = "(function(" + context.params.join(',') + "){" + context.header + "var t=new " + type + ";var p=0;";
  var footer = context.footer + "})";
  return header + program.join(';') + ';' + footer;
}

module.exports = wrap;

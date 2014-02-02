var fs = require('fs');
var through = require('through');
var rework = require('rework');

module.exports = function(b, opts) {

  // validate opts
  if (!opts.out) {
    throw new Error(
        "provide --" + opts.__name +
        "-out via command line or 'out' via API");
  }

  // declare state
  var modules;

  // configure browserify
  b.transform(function(filename) {
    if (!/\.css$/.exec(filename)) return through();

    var buffer = '';

    return through(
      function(chunk) { buffer += chunk; },
      function() {

        var exports = {};

        modules[filename] = rework(buffer)
          .use(function(style) {
            style.rules.forEach(function(rule) {
              var selector = rule.selectors[0];
              if (selector.indexOf('@export ') === 0) {
                var name = selector.slice(8);
                exports[classNameToName(name)] = name;
                rule.selectors = [name];
              }
            });
          })
          .toString();

        this.queue('module.exports = ' + JSON.stringify(exports) + ';');
        this.queue(null);
      });
  });

  // "bundle start" hook
  function onBundleStart(bundleOpts) {
    modules = {};
  }

  // "bundle end" hook
  function onBundleEnd() {
    var css = fs.createWriteStream(opts.out);
    for (var name in modules) {
      css.write(modules[name]);
    }
    modules = {};
  }

  // override bundle to enable lifecycle hooks
  var bundle = b.bundle;

  b.bundle = function(bundleOpts) {
    onBundleStart(bundleOpts);
    return bundle.apply(b, arguments).on('end', onBundleEnd);
  }
}

function classNameToName(className) {
  className = className.slice(1);
  return className.replace(/\./, '\\.');
}

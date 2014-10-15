var _ = require('underscore'),
    path = require('path'),
    rox = require('rox-client-node');

function RoxClientGruntJasmineReporter(options) {
  this.options = options || {};
}

module.exports = RoxClientGruntJasmineReporter;

_.extend(RoxClientGruntJasmineReporter.prototype, {

  reportRunnerStarting: function() {
    this.config = rox.client.loadConfig(this.options.config);
    this.testRun = rox.client.startTestRun(this.config);
  },

  reportSpecStarting: function(spec) {
    spec.startTime = new Date().getTime();
  },

  reportSpecResults: function(spec) {

    var results = spec.results();
    if (spec.skipped) {
      return;
    }

    var name = getFullName(spec),
      passed = results.passed(),
      duration = new Date().getTime() - spec.startTime,
      options = {};

    if (!passed) {
      options.message = buildErrorMessage(results);
    }

    this.testRun.add(null, name, passed, duration, options);
  },

  reportRunnerResults: function() {
    this.testRun.end();
    if (process.env.ROX_GRUNT_TMP) {
      rox.client.saveTestRun(path.join(process.env.ROX_GRUNT_TMP, 'data.json'), this.testRun, this.config);
    }
  }
});

function getFullName(spec) {

  var fullName = spec.suite.description;
  for (var parentSuite = spec.suite.parentSuite; parentSuite; parentSuite = parentSuite.parentSuite) {
    fullName = parentSuite.description + ' ' + fullName;
  }

  return fullName + ' ' + spec.description;
}

function buildErrorMessage(results) {
  return _.inject(results.getItems(), function(memo, item) {
    if (!item.passed()) {
      memo.push(item.message);
      if (item.trace && item.trace.stack) {
        memo.push(item.trace.stack);
      }
    }
    return memo;
  }, []).join("\n\n");
}

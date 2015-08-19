var _ = require('underscore'),
    path = require('path'),
    probedock = require('probedock-node');

function ProbeDockGruntJasmineReporter(options) {
  this.options = options || {};
}

module.exports = ProbeDockGruntJasmineReporter;

_.extend(ProbeDockGruntJasmineReporter.prototype, {

  reportRunnerStarting: function() {
    this.config = probedock.client.loadConfig(this.options.config);
    this.testRun = probedock.client.startTestRun(this.config);
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
      options = {
        nameParts: getNameParts(spec)
      };

    if (!passed) {
      options.message = buildErrorMessage(results);
    }

    this.testRun.add(null, name, passed, duration, options);
  },

  reportRunnerResults: function() {
    this.testRun.end();
    if (process.env.PROBEDOCK_GRUNT_TMP) {
      probedock.client.saveTestRun(path.join(process.env.PROBEDOCK_GRUNT_TMP, 'data.json'), this.testRun, this.config);
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

function getNameParts(spec) {

  var parts = [ spec.suite.description ];
  for (var parentSuite = spec.suite.parentSuite; parentSuite; parentSuite = parentSuite.parentSuite) {
    parts.unshift(parentSuite.description);
  }

  parts.push(spec.description);

  return parts;
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

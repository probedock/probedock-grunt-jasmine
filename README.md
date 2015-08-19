# Jasmine (Grunt.js) Probe for Probe Dock

**[Jasmine](http://jasmine.github.io) reporter to publish test results to [Probe Dock](https://github.com/probedock/probedock) with [Grunt.js](http://gruntjs.com).**

[![NPM version](https://badge.fury.io/js/probedock-grunt-jasmine.svg)](http://badge.fury.io/js/probedock-grunt-jasmine)
[![Dependency Status](https://gemnasium.com/probedock/probedock-grunt-jasmine.svg)](https://gemnasium.com/probedock/probedock-grunt-jasmine)
[![License](https://img.shields.io/github/license/probedock/probedock-grunt-jasmine.svg)](LICENSE.txt)

This reporter can be used with Jasmine-based Grunt plugins like [grunt-protractor-runner](https://github.com/teerapap/grunt-protractor-runner). Only Jasmine 1.3 is supported at the moment.

* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)



<a name="requirements"></a>
## Requirements

* Node.js 0.10+
* Jasmine 1.3



<a name="installation"></a>
## Installation

Install it as a development dependency along with [probedock-grunt](https://github.com/probedock/probedock-grunt):

```bash
npm install --save-dev probedock-grunt
npm install --save-dev probedock-grunt-jasmine
```

If you haven't done so already, set up your Probe Dock configuration file(s).
This procedure is described here:

* [Probe Setup Procedure](https://github.com/probedock/probedock-probes#setup)



For [Protractor](http://angular.github.io/protractor/), add the reporter to your Protractor configuration:

```js
// Load the Probe Dock reporter.
var ProbeDockReporter = require('probedock-grunt-jasmine');

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'e2e/**/*.js'
  ],

  capabilities: {
    'browserName': 'firefox'
  },

  baseUrl: 'http://example.com',

  // The jasmine framework is required.
  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  // Add the Probe Dock reporter to the jasmine environment.
  onPrepare: function() {
    jasmine.getEnv().addReporter(new ProbeDockReporter({

      // custom Probe Dock configuration
      config: {
        project: {
          category: 'Protractor'
        }
      }
    }));
  }
};
```



If you are using [grunt-protractor-runner](https://github.com/teerapap/grunt-protractor-runner),
you must also add the Probe Dock grunt tasks around your test task.

For example, in your Gruntfile:

```js
module.exports = function(grunt) {

  grunt.initConfig({

    // Probe Dock grunt task configuration
    probedockSetup: {
      all: {}
    },

    probedockPublish: {
      all: {}
    },

    // your protractor task configuration
    // (note that the keepAlive option is required to use the Probe Dock tasks)
    protractor: {
      options: {
        configFile: 'test/protractor.conf.js',
        keepAlive: true
      },
      all: {}
    }
  });

  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('probedock-grunt');

  // add the Probe Dock grunt tasks around your task
  grunt.registerTask('test-protractor', ['probedockSetup', 'protractor', 'probedockPublish']);
}
```



<a name="usage"><a/>
## Usage

To track a test with a Probe Dock test key, add this annotation to the test name:

```js
describe("something", function() {
  it("should work @probedock(abcd)", function() {
    expect(true).toBe(true);
  });
});
```

You may also define a category, tags and tickets for a test like this:

```js
describe("something", function() {
  it("should work @probedock(key=bcde category=Integration tag=user-registration tag=validation ticket=JIRA-1000 ticket=JIRA-1012)", function() {
    expect(true).not.toBe(false);
  });
});
```



<a name="contributing"></a>
## Contributing

* [Fork](https://help.github.com/articles/fork-a-repo)
* Create a topic branch - `git checkout -b feature`
* Push to your branch - `git push origin feature`
* Create a [pull request](http://help.github.com/pull-requests/) from your branch

Please add a changelog entry with your name for new features and bug fixes.



## License

*probedock-grunt-jasmine* is licensed under the [MIT License](http://opensource.org/licenses/MIT).

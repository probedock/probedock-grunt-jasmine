# rox-client-grunt-jasmine

> Jasmine reporter to send test results to [ROX Center](https://github.com/lotaris/rox-center) from Grunt tasks.

[![NPM version](https://badge.fury.io/js/rox-client-grunt-jasmine.svg)](http://badge.fury.io/js/rox-client-grunt-jasmine)

This reporter can be used with Jasmine-based Grunt plugins like [grunt-protractor-runner](https://github.com/teerapap/grunt-protractor-runner) and [grunt-contrib-jasmine](https://github.com/gruntjs/grunt-contrib-jasmine). Only Jasmine 1.3 is supported at the moment.

## Usage

This reporter must be used in conjunction with [rox-client-grunt](https://github.com/lotaris/rox-client-grunt).

Add both as development dependencies:

```bash
npm install --save-dev rox-client-grunt
npm install --save-dev rox-client-grunt-jasmine
```

If you are using [Protractor](http://angular.github.io/protractor/), add the reporter to your Protractor configuration:

```js
// load the reporter module
var RoxReporter = require('rox-client-grunt-jasmine');

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'e2e/**/*.js'
  ],

  capabilities: {
    'browserName': 'firefox'
  },

  baseUrl: 'http://example.com',

  // the jasmine framework is required
  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  // add the reporter to the jasmine environment
  onPrepare: function() {
    jasmine.getEnv().addReporter(new RoxReporter({

      // custom rox client configuration
      config: {
        project: {
          category: 'Protractor - Jasmine'
        }
      }
    }));
  }
};
```

If you are using [grunt-protractor-runner](https://github.com/teerapap/grunt-protractor-runner),
you must add the ROX grunt tasks around your test task.
For example, in your Gruntfile:

```js
module.exports = function(grunt) {

  grunt.initConfig({

    // rox grunt task configuration
    roxGruntSetup: {
      all: {}
    },

    roxGruntPublish: {
      all: {}
    },

    // your protractor task configuration
    // (note that the keepAlive option is required to work with the rox tasks)
    protractor: {
      options: {
        configFile: 'test/protractor.conf.js',
        keepAlive: true
      },
      all: {}
    }
  });

  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('rox-client-grunt');

  // add the rox grunt tasks around your task
  grunt.registerTask('test-protractor', ['roxGruntSetup', 'protractor', 'roxGruntPublish']);
}
```

### Requirements

* Node.js 0.10
* Jasmine 1.3



## Contributing

* [Fork](https://help.github.com/articles/fork-a-repo)
* Create a topic branch - `git checkout -b feature`
* Push to your branch - `git push origin feature`
* Create a [pull request](http://help.github.com/pull-requests/) from your branch

Please add a changelog entry with your name for new features and bug fixes.



## License

*rox-client-grunt-jasmine* is licensed under the [MIT License](http://opensource.org/licenses/MIT).
See [LICENSE.txt](LICENSE.txt) for the full text.

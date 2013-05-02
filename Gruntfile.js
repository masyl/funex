module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'lib/funex.js',
        dest: 'build/funex.min.js'
      }
    },
	plato: {
		your_task: {
		  files: {
		    'doc/plato': ['lib/funex.js'],
		  }
		}
	},
	jshint: {
	    all: ['lib/funex.js'],
	    jshintrc: '.jshintrc',
	    options: {
        }
	},
	mochacov: {
	    test: {},
	    coverage: {
	      options: {
	        coveralls: {
	          serviceName: 'travis-ci'
	        },
	      }
	    },
	    options: {
			reporter: 'spec',
			ignoreLeaks: false,
			files: 'test/*.js'
	    }
	  },
	  release: {
	    options: {
	      bump: true,
	      file: 'package.json',
	      add: true,
	      commit: true,
	      tag: true,
	      push: true,
	      pushTags: true,
	      npm: true,
	      tagName: '<%= version %>',
	      commitMessage: 'Version bump to <%= version %>',
	      tagMessage: 'Version <%= version %>'
	    }
  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('gzip', 'blah blah blah', function () {
    var done = this.async();
    require('child_process').exec('gzip -c -9 build/funex.min.js > build/funex.min.js.gz', function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });  
  });

  // Default task(s).
  grunt.registerTask('default', ['plato', 'jshint', 'uglify', 'gzip', 'mochacov:test']);
  grunt.registerTask('travis', ['mochacov:coverage']);
  grunt.registerTask('test', ['mochacov:test']);
  // grunt.registerTask('test', ['grunt-mocha-cov']);





};
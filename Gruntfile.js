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
	//mocha --require blanket -R html-cov > coverage.html
	jshint: {
	    all: ['lib/funex.js'],
	    jshintrc: '.jshintrc',
	    options: {
        }
	},
	  mochacov: {
	    coverage: {
	      options: {
	        coveralls: {
	          serviceName: 'travis-pro',
	          repoToken: '3EeXcBem9hMgrM0oG3Gja3xNu2AA9Sj8j'
	        },
	      }
	    },
	    test: {
	      options: {
	        reporter: 'dot'
	      }
	    },
	    options: {
	      files: 'test/suite.js'
	    }
	  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cov');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'plato', 'jshint', 'mochacov']);
  grunt.registerTask('travis', ['mochacov']);

};
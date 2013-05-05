module.exports = function(grunt) {

		// Project configuration.
		grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			browser: {
				src: 'dist/browser/funex.js',
				dest: 'dist/browser/funex.min.js'
			},
			amd: {
				src: 'dist/amd/funex.js',
				dest: 'dist/amd/funex.min.js'
			}
		},
		plato: {
			your_task: {
				files: {
					'doc/plato': ['src/funex.js'],
				}
			}
		},
		jshint: {
			all: ['dist/browser/funex.js'],
			options: {
				jshintrc: '.jshintrc',
				validthis: true
			}
		},
		mochacov: {
			test: {},
			coverage: {
				options: {
					coveralls: {
						serviceName: 'travis-ci'
					}
				}
			},
			all: ['test/*.js'],
			options: {
				reporter: 'spec',
				ignoreLeaks: false,
				files: 'test/*.js'
			}
		},
		bumpup: {
			files: ['package.json', 'bower.json']
		},
		release: {
			options: {
				bump: false,
				file: 'package.json',
				add: true,
				tag: true,
				commit: true,
				push: true,
				pushTags: true,
				npm: true,

				tagName: '<%= version %>',
				commitMessage: 'Version bump to <%= version %>',
				tagMessage: 'Version <%= version %>'
			}
		},
		exec: {
			"add": {
				cmd: "git add ."
			}
		},
		build: {
			source: "src/funex.js",
			builds: [
				{
					name: "for Node.js",
					source: "src/wrapper-node.js",
					target: "dist/node/funex.js"
				},
				{
					name: "for Browsers",
					source: "src/wrapper-browser.js",
					target: "dist/browser/funex.js"
				},
				{
					name: "for AMD loaders",
					source: "src/wrapper-amd.js",
					target: "dist/amd/funex.js"
				}
			]
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-mocha-cov');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-release');
	grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask('gzip', function () {
		var done = this.async();
		require('child_process').exec('gzip -c -9 dist/browser/funex.min.js > dist/funex.min.js.gz', function (err, stdout) {
			grunt.log.write(stdout);
			done(err);
		});
	});

	// Default task(s).
	grunt.registerTask('default', ['plato', 'build', 'jshint', 'uglify', 'gzip', 'mochacov:test']);
	grunt.registerTask('travis', ['mochacov:coverage']);
	grunt.registerTask('test', ['mochacov:test']);
	grunt.registerTask('rel', function (type) {
		type = type ? type : 'patch';
		grunt.task.run('default');
		grunt.task.run('bumpup:' + type); // Bump up the version
		grunt.task.run('exec:add'); // Add all modified files
		grunt.task.run('release');
	});

	grunt.registerTask('build', function () {
		var cfg = grunt.config("build");
		var pkg = grunt.config("pkg");
		var source = grunt.file.read(cfg.source);
		var builds = cfg.builds;
		if (builds) {
			builds.forEach(function (build) {
				output = grunt.file.read(build.source);
				output = output
					.replace("{name}", pkg.name)
					.replace("{version}", pkg.version)
					.replace("{buildName}", build.name)
					.replace("{copyright}", pkg.copyright)
					.replace("{now}", ( new Date() ).toISOString().replace( /T.*/, "" ))
					.replace("{source}", source);
				grunt.file.write(build.target, output);
			});
		}
	});

};

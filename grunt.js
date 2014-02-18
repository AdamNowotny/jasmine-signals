/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-jasmine-runner');

	grunt.registerTask('default', 'lint jasmine');

	grunt.initConfig({
		lint: {
			files: [ '*.js' ]
		},
		jasmine: {
			src: [ 'jasmine-signals.js', 'bower_components/js-signals/dist/signals.js' ],
			specs: 'jasmine-signalsSpec.js',
			phantomjs : {
				'ignore-ssl-errors' : true
			},
			helpers: [ 'bower_components/es5-shim/es5-shim.min.js' ]
		}
	});
};

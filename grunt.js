/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-jsvalidate');
	grunt.loadNpmTasks('grunt-jasmine-runner');

	grunt.registerTask('default', 'jsvalidate lint jasmine');

	grunt.initConfig({
		lint: {
			files: [ '*.js' ]
		},
		jsvalidate: {
			files: ['*.js']
		},
		jasmine: {
			src: [ 'jasmine-signals.js', 'components/js-signals/dist/signals.js' ],
			specs: 'jasmine-signalsSpec.js',
			phantomjs : {
				'ignore-ssl-errors' : true
			}
		}
	});
};

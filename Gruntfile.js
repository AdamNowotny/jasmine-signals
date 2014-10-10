/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.registerTask('default', 'jasmine');

	grunt.initConfig({
		lint: {
			files: [ '*.js' ]
		},
        jasmine: {
            jasmineSignals: {
                src: [ 'jasmine-signals.js', 'bower_components/js-signals/dist/signals.js' ],
                options: {
                    specs: 'jasmine-signalsSpec.js'
                }
            }
        }
	});
};

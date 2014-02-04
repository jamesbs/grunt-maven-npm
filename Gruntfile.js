/*
 * grunt-maven
 * https://github.com/adam/grunt-maven-npm
 *
 * Copyright (c) 2014 Adam Dubiel
 * Licensed under the Apache-2.0 license.
 */

'use strict';

module.exports = function(grunt) {

    var gruntCWD = process.cwd();

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },
        clean: {
            tests: ['tmp'],
        },
        copy: {
            prepareVanilla: {
                expand: true,
                cwd: 'test/fixture/vanilla/',
                src: ['**'],
                dest: 'tmp/vanilla/'
            },
            prepareOverrides: {
                expand: true,
                cwd: 'test/fixture/overrides/',
                src: ['**'],
                dest: 'tmp/overrides/'
            }
        },
        execute: {
            chdirToVanilla: {
                call: function() {
                    process.chdir('tmp/vanilla/target-grunt');
                }
            },
            chdirToOverrides: {
                call: function() {
                    process.chdir('tmp/overrides/target-grunt');
                }
            },
            chdirReset: {
                call: function() {
                    process.chdir(gruntCWD);
                }
            }
        },
        mavenPrepare: {
            should_prepare_grunt_dist_and_copy_to_maven_dist: {
            },
            should_prepare_grunt_dist_and_copy_to_maven_dist_with_overriden_properties: {
            }
        },
        mavenDist: {
            should_prepare_grunt_dist_and_copy_to_maven_dist: {
                options: {
                    warName: 'war',
                    dist: 'dist'
                }
            },
            should_prepare_grunt_dist_and_copy_to_maven_dist_with_overriden_properties: {
                options: {
                    warName: 'war',
                    dist: 'dist'
                }
            }
        },
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('testVanilla', [
        'execute:chdirToVanilla',
        'mavenPrepare:should_prepare_grunt_dist_and_copy_to_maven_dist',
        'mavenDist:should_prepare_grunt_dist_and_copy_to_maven_dist',
        'execute:chdirReset'
    ]);

    grunt.registerTask('testOverrides', [
        'execute:chdirToOverrides',
        'mavenPrepare:should_prepare_grunt_dist_and_copy_to_maven_dist_with_overriden_properties',
        'mavenDist:should_prepare_grunt_dist_and_copy_to_maven_dist_with_overriden_properties',
        'execute:chdirReset'
    ]);

    grunt.registerTask('test', ['clean', 'copy', 'testVanilla', 'testOverrides', 'nodeunit']);

    grunt.registerTask('default', ['jshint', 'test']);

};

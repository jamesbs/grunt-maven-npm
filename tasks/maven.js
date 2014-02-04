/*
 * grunt-maven
 * https://github.com/adam/grunt-maven-npm
 *
 * Copyright (c) 2014 Adam Dubiel
 * Licensed under the Apache-2.0 license.
 */

'use strict';

var path = require('path');
var MAVEN_PROPERTIES = 'maven-inner-properties.json';
var MAVEN_PROPERTIES_OVERRIDES = 'maven-custom-inner-properties.json';

module.exports = function(grunt) {

    function readJSONWithCustomOverride(grunt, path, overridePath) {
        var properties = grunt.file.readJSON(path);

        if (grunt.file.exists(overridePath)) {
            var overridingProperties = grunt.file.readJSON(overridePath);
            for (var attr in overridingProperties) {
                properties[attr] = overridingProperties[attr];
            }
        }

        return properties;
    }

    function readMavenProperties(grunt) {
        var propertiesPath = path.join(path.resolve(process.cwd()), MAVEN_PROPERTIES);
        var overridesPath = path.join(path.resolve(process.cwd()), MAVEN_PROPERTIES_OVERRIDES);
        return readJSONWithCustomOverride(grunt, propertiesPath, overridesPath);
    }

    grunt.registerMultiTask('mavenPrepare', 'Grunt+Maven workflow task - prepare resources before running Grunt.', function() {
        var mavenProperties = readMavenProperties(grunt);

        grunt.verbose.subhead('Directories');

        var sourcePath = path.resolve(path.join(mavenProperties.projectRootPath, mavenProperties.sourceDirectory, mavenProperties.jsSourceDirectory));
        grunt.verbose.writeln('-> source directory: ' + sourcePath);

        var targetPath = path.resolve(process.cwd());
        grunt.verbose.writeln('-> Grunt working directory: ' + targetPath).writeln();

        grunt.file.expand({cwd: sourcePath}, '**').forEach(function(file) {
            var sourceFilePath = path.join(sourcePath, file);

            if (!grunt.file.isDir(sourceFilePath)) {
                var targetFilePath = path.join(targetPath, file);

                grunt.file.copy(sourceFilePath, targetFilePath);
            }
        });
    });

    grunt.registerMultiTask('mavenDist', 'Grunt+Maven workflow task - copy resources to Java dist after running Grunt.', function() {
        var mavenProperties = readMavenProperties(grunt);
        var config = this.options();

        grunt.verbose.subhead('Directories');

        var workPath = path.resolve(process.cwd());
        grunt.verbose.writeln('-> Grunt working directory: ' + workPath);

        var gruntDistPath = path.resolve(config.dist);
        grunt.verbose.writeln('-> Grunt dist directory: ' + gruntDistPath);

        var mavenDistPath = path.resolve(path.join(mavenProperties.targetPath, config.warName, mavenProperties.jsSourceDirectory));
        grunt.verbose.writeln('-> Maven exploded WAR directory: ' + mavenDistPath);

        grunt.verbose.subhead('Copying to Grunt dist');
        grunt.file.expand({cwd: workPath}, ['**', '!' + config.dist, '!maven-*-properties.json']).forEach(function(file) {
            var sourceFilePath = path.join(workPath, file);

            if (!grunt.file.isDir(sourceFilePath)) {
                var targetFilePath = path.join(gruntDistPath, file);

                grunt.file.copy(sourceFilePath, targetFilePath);
            }
        });

        grunt.verbose.subhead('Copying to Maven dist');
        grunt.file.expand({cwd: gruntDistPath}, ['**']).forEach(function(file) {
            var sourceFilePath = path.join(gruntDistPath, file);

            if (!grunt.file.isDir(sourceFilePath)) {
                var targetFilePath = path.join(mavenDistPath, file);

                grunt.file.copy(sourceFilePath, targetFilePath);
            }
        });


    });
};



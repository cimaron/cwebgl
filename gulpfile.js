/*
Copyright (c) 2011 Cimaron Shanahan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var del = require('del'),
	gulp = require('gulp'),
	//browserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	include = require('gulp-include'),
	//jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	wrap = require("gulp-wrap")
	;

gulp.task('clean', function(cb) {
    del(['build/*'], cb);
});

/**
 * Build
 */
gulp.task('driver-cnvgl', function() {
	return gulp.src([
		'drivers/cnvgl/driver.js',
		'drivers/cnvgl/**/*.js'
		])
		.pipe(concat('driver.cnvgl.js'))
		.pipe(wrap('(function(){\n<%= contents %>\n})();\n\n'))
		.pipe(rename('driver.cnvgl.js'))
		.pipe(gulp.dest('build'))
});


gulp.task('drivers', ['driver-cnvgl']);


/**
 * Final processing
 */
gulp.task('default', ['drivers']);

/**
 * Watch
 */
gulp.task('watch', function() {
    gulp.watch([
        '**/*.js',
    ], ['default']);
});


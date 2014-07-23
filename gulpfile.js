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
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	jison = require('gulp-jison'),
	del = require('del'),
	browserify = require('gulp-browserify')
	//jslint = require('gulp-jslint')
	jshint = require('gulp-jshint')
	;

gulp.task('clean', function(cb) {
    del(['build/*'], cb);
});

gulp.task('webgl', function() {
	return gulp.src([
		'WebGL/WebGLObject.js',
		'WebGL/WebGLBuffer.js',
		'WebGL/WebGLContextAttributes.js',
		'WebGL/WebGLFramebuffer.js',
		'WebGL/WebGLProgram.js',
		'WebGL/WebGLShader.js',
		'WebGL/WebGLTexture.js',
		'WebGL/WebGLRenderbuffer.js',
		'WebGL/WebGLRenderingContext.js',
		'WebGL/WebGLUniformLocation.js'
		])
		.pipe(concat('webgl.js'))
		.pipe(gulp.dest('build'))
});

gulp.task('errors', function() {
	return gulp.src([
		'build/webgl.js'
	])
	/*
	.pipe(jslint({
		nomen : true,
		white : true,
		node : true,
		plusplus  : true,
	}));
	*/
	.pipe(jshint())
	;
});


gulp.task('cwebgl', ['clean', 'webgl'], function() {
	return gulp.src([
		'cwebgl.js',
		'library/util.js',
		'build/webgl.js',
		'drivers/driver.js',
		'drivers/cnvGL/cnvGL.js'
		])
		/*.pipe(browserify({
			insertGlobals : true
		}))*/
		.pipe(concat('cwebgl.js'))
		.pipe(gulp.dest('build'))
});

gulp.task('default', ['cwebgl']);


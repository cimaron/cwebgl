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
	jslint = require('gulp-jslint')
	;

gulp.task('clean', function(cb) {
    del(['build/*'], cb);
});

gulp.task('jison', function() {
	return gulp.src('parser/*.jison')
		.pipe(jison({ moduleType: 'commonjs' }))
		//.pipe(rename('grammar.js'))
		.pipe(gulp.dest('build'))
});

gulp.task('parser', ['jison'], function() {
	return gulp.src([
		'parser/type.js',
		'parser/symbol.js',
		'parser/ast.js',
		'ir/builtin.js',
		'build/grammar.js',
		'parser/parser.js'
		])
		.pipe(concat('parser.js'))
		.pipe(gulp.dest('build'))
});

gulp.task('generator', function() {
	return gulp.src([
		'ir/generator.js',	
		'ir/ir.js',
		'ir/operand.js',
		'ir/instruction.js',
		])
		.pipe(concat('ir.js'))
		.pipe(gulp.dest('build'))
});

gulp.task('glsl', ['parser', 'generator'], function() {
	return gulp.src([
		//'util.js',
		'glsl.js',
		'build/parser.js',
		'build/ir.js'
		])
		.pipe(concat('glsl.js'))
		.pipe(gulp.dest('build'))
});

gulp.task('errors', ['glsl'], function() {
	return gulp.src([
		'build/glsl.js'
	])
	.pipe(jslint({
		nomen : true,
		white : true,
		node : true,
		plusplus  : true,
	}));
});

gulp.task('default', ['clean', 'web']);


gulp.task('web', ['glsl'], function() {
	return gulp.src('build/glsl.js')
		.pipe(browserify({
			insertGlobals : true
		}))
		.pipe(rename('glsl.web.js'))
		.pipe(gulp.dest('build'))
});

/*
gulp.task('watch', function () {
	gulp.watch('./parser/*.jison', ['jison']);
});
*/


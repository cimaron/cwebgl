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

var stdin = 0;
var stdout = 1;
var stderr = 2;


var writeEl = function(id, str) {
	var el; 
	 if (el = document.getElementById(id)) {
		el.value += str;
	 }
	 el.scrollTop = el.scrollHeight;
};

var files = [
	null,
	function(str) { writeEl('stdout', str); },
	function(str) { writeEl('stdout', str); }
];

var sprintf = function(str) {
	var i = 1, m, rest = str; str = '';
	while (m = rest.match('%([l]?)([dus%])')) {
		var d = m[0];
		switch (m[2]) {
			case 'u':
			case 'd':
				d = parseInt(arguments[i]);
				break;
			case 's':
				d = arguments[i];
				break;
			case '%':
				d = '%';
				break;
			default:
		}
		i++;
		str += rest.slice(0, m.index) + d;
		rest = rest.slice(m.index + m[0].length);
	}
	str += rest;
	return str;
};

var printf = function() {
	var args = [].splice.call(arguments, 0);
	args.unshift(stdout);
	fprintf.apply(null, args);
}

var fprintf = function(file, str) {
	var args = [].splice.call(arguments, 1);	
	str = sprintf.apply(null, args);
	files[file ? file : 1](str);
};


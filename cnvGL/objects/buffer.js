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

cnvgl_buffer = (function() {

	//Internal Constructor
	function Initializer() {
		//public:
		this.data = null;	
		this.usage = null;
		this.target = null;
		this.access = null;
		this.size = 0;
		this.data_type = null;
	}

	var cnvgl_buffer = jClass('cnvgl_buffer', Initializer);

	//public:
	cnvgl_buffer.cnvgl_buffer = function() {
	};
	
	cnvgl_buffer.getData = function(type) {
		if (!type) {
			type = this.data_type;	
		}
		if (type.native) {
			return type(this.data);	
		}
		return this.data;
	};
	
	return cnvgl_buffer.Constructor;

}());


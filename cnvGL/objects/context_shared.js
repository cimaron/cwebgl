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

var cnvgl_context_shared = (function() {
							  
	function Initializer() {
		//public:
		this.linker = null;
		
		this.program_objects = [];
		this.texture_objects = [];
	}

	var cnvgl_context_shared = jClass('cnvgl_context_shared', Initializer);
	
	//static:
	var instance = null;
	cnvgl_context_shared.Constructor.getInstance = function() {
		if (instance) {
			return instance;	
		}
		return new cnvgl_context_shared.Constructor();
	};

	//public:

	cnvgl_context_shared.cnvgl_context_shared = function() {
		this.linker = new GlslLinker();
		this.texture_objects = [0];
		this.program_objects = [0];
	};

	return cnvgl_context_shared.Constructor;

}());


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


function glBindAttribLocation(program, index, name) {
	var ctx, program_obj, attr_obj;

	ctx = cnvgl_context.getCurrentContext();
	program_obj = ctx.shared.program_objects[program];
	
	//no program exists
	if (!program_obj) {
		cnvgl_throw_error(GL_INVALID_OPERATION);
		return;
	}

	if (program_obj.attributes[name]) {
		attr_obj = program_obj.attributes[name];	
	} else {
		attr_obj = new cnvgl_attribute(name);
	}

	//do check that index is valid
	attr_obj.location = index;

	program_obj.attributes[name] = attr_obj;
}


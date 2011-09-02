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


function glGenTextures(n, textures) {

	var current, list, i, t, texture_obj;

	if (n < 0) {
		cnvgl_throw_error(GL_INVALID_VALUE);
		return;
	}

	current = cnvgl_context.getCurrentContext().shared.texture_objects;

	list = [];
	for (i = 0; i < n; i++) {
		t = current.indexOf(null);
		if (t == -1) {
			t = current.length;
		}
		texture_obj = new cnvgl_texture_object(t, 0);
		current[t] = texture_obj;
		list[i] = t;
	}

	textures[0] = list;
}


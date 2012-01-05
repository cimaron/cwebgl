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

(function(GPU) {

	GPU.memory = {};

	/**
	 * Allocate a block of memory
	 *
	 * @param   integer   size to create
	 * @param   integer   stride
	 */
	GPU.malloc = function(size, stride) {
		var data, i;

		stride = stride || 1;
		size = Math.ceil(size / stride);
		data = {
			size : size * stride,
			stride : stride,
			data : new Array(size)
		};

		//create sub-arrays
		if (stride > 1) {
			for (i = 0; i < size; i++) {
				data.data[i] = new Array(stride);
			}
		}

		//initialize memory to 0
		GPU.memset(data, 0, 0, data.size);

		return data;
	};

	/**
	 * Copies data from source into GPU memory structure specified by dest
	 *
	 * @param   object    GPU dest memory structure
	 * @param   integer   dest start pointer
	 * @param   array     source data
	 * @param   integer   source length to copy
v	 * @param   integer   source start
	 */
	GPU.memcpy = function(dest, di, source, size, si) {
		var srci, dc, stride;

		stride = dest.stride;
		if (!(dest instanceof Array)) {
			dest = dest.data;
		}

		si = si || 0;
		dc = di % stride;
		di = (di - dc) / stride;

		for (srci = si; srci < si + size; srci++) {

			if (stride == 1) {
				dest[di++] = source[srci];
			} else {
				dest[di][dc++] = source[srci];
				if (dc == stride) {
					dc = 0;
					di++;
				}
			}
		}
	};

	/**
	 * Sets data from source into GPU memory structure specified by dest
	 *
	 * @param   object    GPU dest memory structure
	 * @param   integer   dest start pointer
	 * @param   number    value
	 * @param   integer   length
	 */
	GPU.memset = function(dest, di, value, size) {
		var i, dc, stride, mem;

		mem = dest.data;
		stride = dest.stride;

		dc = di % stride;
		di = (di - dc) / stride;

		for (i = 0; i < size; i++) {

			if (stride == 1) {
				mem[di++] = value;
			} else {
				mem[di][dc++] = value;
				if (dc == stride) {
					dc = 0;
					di++;
				}
			}
		}
	};

}(GPU));


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

(function(cnvgl) {

	/**
	 * Allocate a block of memory
	 *
	 * @param   integer   size to create
	 * @param   integer   stride
	 */
	cnvgl.malloc = function(size, stride, format) {
		var block, i;

		format = format.native ? format : Array;
		stride = stride || 1;
		size = Math.ceil(size / stride);

		block = {
			size : size * stride,
			stride : stride
		};

		//create sub-arrays
		if (stride > 1) {
			block.data = new Array(size);
			for (i = 0; i < size; i++) {
				block.data[i] = new format(stride);
			}
		} else {
			block = new format(size);
		}

		//initialize memory to 0
		GPU.memset(block, 0, 0, block.size);

		return block;
	};

	/**
	 * Copies data from source into GPU memory structure specified by dest
	 *
	 * @param   object    GPU dest memory structure
	 * @param   integer   dest start pointer
	 * @param   array     source data
	 * @param   integer   source length to copy
	 * @param   integer   source start
	 */
	cnvgl.memcpy = function(dest, di, source, size, si) {
		var data, srci, dc, stride;

		stride = dest.stride || 1;
		data = dest.data || dest;

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
	cnvgl.memset = function(dest, di, value, size) {
		var i, dc, stride, data;

		data = dest.data || dest;
		stride = dest.stride || 1;

		dc = di % stride;
		di = (di - dc) / stride;

		for (i = 0; i < size; i++) {

			if (stride == 1) {
				data[di++] = value;
			} else {
				data[di][dc++] = value;
				if (dc == stride) {
					dc = 0;
					di++;
				}
			}
		}
	};

}(cnvgl));


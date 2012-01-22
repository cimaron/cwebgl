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

		format = format && format.native ? format : Array;
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

		return block;
	};

	/**
	 * Copies data from source into memory structure specified by dest
	 *
	 * @param   object    Dest memory structure
	 * @param   integer   Dest start pointer
	 * @param   array     Source data
	 * @param   integer   Source length to copy
	 * @param   integer   Source start
	 */
	cnvgl.memcpy = function(dest, di, source, size, si) {
		var data, srci, dc, ds;

		ds = dest.stride || 1;
		data = dest.data || dest;

		si = si || 0;
		dc = di % ds;
		di = (di - dc) / ds;

		if (ds == 1) {
			for (srci = si; srci < si + size; srci++) {
				data[di++] = source[srci];
			}
		} else {
			for (srci = si; srci < si + size; srci++) {
				data[di][dc++] = source[srci];
				if (dc == ds) {
					dc = 0;
					di++;
				}
			}
		}
	};

	/**
	 * Sets data from source into memory structure specified by dest
	 *
	 * @param   object    Dest memory structure
	 * @param   integer   Dest start pointer
	 * @param   number    Value
	 * @param   integer   Length
	 */
	cnvgl.memset = function(dest, di, value, size) {
		var i, dc, stride, data;

		data = dest.data || dest;
		stride = dest.stride || 1;
		size = size || data.length * stride;

		dc = di % stride;
		di = (di - dc) / stride;

		if (stride == 1) {
			for (i = 0; i < size; i++) {
				data[di++] = value;
			}
		} else {
			for (i = 0; i < size; i++) {
				data[di][dc++] = value;
				if (dc == stride) {
					dc = 0;
					di++;
				}
			}
		}
	};

	/**
	 * Sets data from src values into memory structure specified by dest n times
	 *
	 * @param   object    Dest memory structure
	 * @param   integer   Dest start pointer
	 * @param   number    Values
	 * @param   integer   Length
	 */
	cnvgl.memseta = function(dest, di, src, n) {
		var i, dc, si, ss, ds, data;

		data = dest.data || dest;
		ds = dest.stride || 1;
		n = n || data.length;

		dc = di % ds;
		di = (di - dc) / ds;

		si = 0;
		ss = src.length;

		if (ds == 1) {
			for (i = 0; i < n; i++) {
				data[di++] = src[si++];
				if (si == ss) {
					si = 0;
				}
			}
		} else {
			for (i = 0; i < n; i++) {
				data[di][dc++] = src[si++];
				if (dc == ds) {
					dc = 0;
					di++;
				}
				if (si == ss) {
					si = 0;
				}
			}
		}
	};

}(cnvgl));


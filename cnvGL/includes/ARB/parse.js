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

(function(ARB, StdIO) {

	/**
	 * Import into local scope
	 */
	var Instruction = ARB.Instruction;
	var sprintf = StdIO.sprintf;

	/**
	 * Global
	 */
	var irs, symbols, line;

	/**
	 * Symbol Table entry
	 */
	function symbol(name, init, value, size) {
		this.name = name;
		this.init = init;
		this.value = value;
		this.size = size;
		this.read = [];
		this.write = [];
		this.rw = [];
	}

	/**
	 * Parses PARAM initializer
	 *
	 * @param   string    string that represents param
	 * @param   integer   line number
	 *
	 * @return  object    Object containing name and used fields
	 */
	function parseParam(str) {
		var parts, name, size, init, part, i, j, tname;
		parts = str.match(/^PARAM ([a-z]+)\[([0-9]+)\] = \{(.*)\}/);
		name = parts[1];
		size = parseInt(parts[2]);
		init = parts[3];

		init = init.replace(/\s+/g, '');
		i = 0;
		
		symbols[name] = new symbol(name, true, null, size);

		while (init.length > 0) {

			//constant initializer
			if (part = init.match(/^\{[^\}]+\}/)) {
				init = init.substr(part[0].length);
				i++;
				continue;
			}

			//range initializer
			if (part = init.match(/^([^\[]+)\[([^\]]+)\]/)) {
				init = init.substr(part[0].length);
				parts = part[2].split('..');
				for (j = parts[0]; j <= parts[1]; j++) {	
					tname = sprintf("%s[%s]", name, i++);
					symbols[tname] = new symbol(tname, true, sprintf("%s[%s]", part[1], j));
				}
				continue;
			}

			if (init[0] == ',') {
				parts = parts.substr(1);
				continue;
			}
			
			throw new Error('Invalid syntax');
		}
	}

	/**
	 * Parses a line
	 *
	 * @param   string    Source line
	 */
	var buffer = '', temp = 0;
	function parseLine(str) {
		var i, ins;

		//if instruction split into multiple lines
		str = buffer + str;
		buffer = '';

		//set vertex mode
		if (str == '!!ARBvp1.0') {
			ARB.output_target = ARB.mode.vertex;
			return;
		}

		//set fragment mode
		if (str == '!!ARBfp1.0') {
			ARB.output_target = ARB.mode.fragment;
			return;
		}

		//comment
		if (str.match(/^(\/\/|#).*/)) {
			return;
		}

		//shader type
		if (str.match(/^!!.*/)) {
			return;	
		}

		while ((i = str.indexOf(';')) != -1) {
			if (str.match(/^PARAM/)) {
				//param initialization
				parseParam(str);
			} else {
				ins = new Instruction(str.slice(0, i), line);
				ins.parse(symbols);
				if (str.match(/^TEMP/)) {
					symbols[ins.dest] = new symbol(ins.dest, true, sprintf("temp[%s]", temp++));
				} else {
					irs.push(ins);	
				}
			}
			str = str.substr(i + 1);
		}

		buffer = str;
	}

	/**
	 * Parses a source string
	 *
	 * @param   string    Source string
	 * @param   array     Destination for instructions
	 * @param   string    Destination for symbol table
	 */
	function parse(str, new_irs, new_symbols) {

		//set up in local scope
		irs = new_irs;
		symbols = new_symbols;

		symbols['result.position'] = new symbol('result.position', false, 'result[0]');

		str = str.split("\n");
		for (line = 0; line < str.length; line++) {
			try {
				parseLine(str[line]);
			} catch (e) {
				ARB.errors.push(e);
			}
		}
	}

	/**
	 * External interface
	 */
	ARB.parse = parse;

}(ARB, StdIO));


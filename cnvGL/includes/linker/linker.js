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


ShaderLinker = (function() {

	//External Constructor
	function Constructor() {
		linker.apply(this);
		this.linker();
	}

	//Internal Constructor
	function linker() {
		//public:
		this.input = [];
		this.output = [];
		this.status = false;
		this.errors = [];
	}

	//Class Inheritance
	Constructor.prototype = linker;

	//public:

	linker.linker = function() {
	}

	linker.link = function() {

		this.status = false;
		this.errors = [];
		this.output[1] = new GlslExecutable();
		this.output[2] = new GlslExecutable();

		for (var i = 0; i < this.input.length; i++) {
			this.merge(this.input[i]);
		}

		this.replaceSymbols(this.output[1]);
		this.replaceSymbols(this.output[2]);

		this.buildExecutable(this.output[1]);
		this.buildExecutable(this.output[2]);
		
		this.status = 1;
	}

	linker.addObjectCode = function(object) {
		this.input.push(object);
	}

	linker.merge = function(shader) {
		this.output[shader.mode].text += shader.object_code;
		this.addSymbols(shader.symbol_table, shader.mode);
	}

	linker.addSymbols = function(symbols, mode) {
		var data = this.output[mode].data;
		var data_table = this.output[mode].symbols;
		var symbol_table = symbols.table.data;

		for (var name in symbol_table) {
			var entry = symbol_table[name];
			if (entry.typedef != 0) {
				continue;	
			}
			if (!data_table[name]) {
				data_table[name] = { index : data.length, type : null };
				data.push(null);
			}
		}
	}

	linker.replaceSymbols = function(exec) {
		for (var name in exec.symbols) {
			var index = exec.symbols[name].index;
			exec.text = exec.text.replace(new RegExp('@' + name + '@', 'g'), '__data[' + index + ']');
		}
	}

	linker.buildExecutable = function(__exec) {
		var __data = __exec.data;
		eval(__exec.text);
	}

	return Constructor;

})();


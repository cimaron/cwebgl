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

/*
//----------------------------------------------------------------------------------------
//	class ShaderCompilerSymbol
//----------------------------------------------------------------------------------------

function ShaderCompilerSymbol(type, data_type, name, pointer) {
	this.type = type;
	this.data_type = data_type;
	this.name = name;
	this.pointer = pointer ? true : false;
}
*/


glsl.symbol_table_entry = function(name, typedef) {
	this.name = name;
	this.typedef = typedef;
	this.type = null;
	this.definition = null;
	this.uid = "__" + name;
}

glsl.symbol_table_entry.typedef = {
	variable : 0,
	func : 1,
	type : 2
};

glsl.symbol_table = (function() {

	//Internal Constructor
	function symbol_table() {
		this.table = {
			depth : 0,
			parent : null,
			data : {}
		};
	}

	//public:	
	symbol_table.push_scope = function() {
		this.table = {
			depth : this.table.depth + 1,
			parent : this.table,
			data : {}
		};
	}

	symbol_table.pop_scope = function() {
		this.table = this.table.parent;
	}

	symbol_table.name_declared_this_scope = function(name) {
		return (this.table.data[name] ? true : false);
	}

	symbol_table.add_variable = function(name) {
		var entry = new glsl.symbol_table_entry(name, glsl.symbol_table_entry.typedef.variable);
		return this.add_entry(entry);
	}

	symbol_table.add_type = function(name, t) {
		var entry = new symbol_table_entry(name, glsl.symbol_table_entry.typedef.type);
		entry.definition = t;
		return this.add_entry(entry);
	}

	symbol_table.add_function = function(name) {
		var entry = new glsl.symbol_table_entry(name, glsl.symbol_table_entry.typedef.func);
		return this.add_entry(entry);
	}

	/*
	symbol_table.add_global_function = function(f) {
		var entry = new symbol_table_entry(0, f, 0);
		this.table.data[f.name] = entry;
		return true;
	}
	*/
	
	symbol_table.get_variable = function(name) {
		var entry = this.get_entry(name, glsl.symbol_table_entry.typedef.variable);
		return entry;
	}

	symbol_table.get_type = function(name) {
		var entry = this.get_entry(name, glsl.symbol_table_entry.typedef.type);
		return entry;
	}

	symbol_table.get_function = function(name) {
		var entry = this.get_entry(name, glsl.symbol_table_entry.typedef.func);
		return entry;
	}

	//private:
	
	symbol_table.add_entry = function(entry) {
		this.table.data[entry.name] = entry;
		return entry;
	}
	
	symbol_table.get_entry = function(name, typedef) {
		var table = this.table;
		while (table != null) {
			if (table.data[name]) {
				return table.data[name];
			}
			table = table.parent;
		}
		return null;
	}

	//External Constructor
	function Constructor() {
		symbol_table.apply(this);
	}

	//Class Inheritance
	Constructor.prototype = symbol_table;

	return Constructor;	

})();

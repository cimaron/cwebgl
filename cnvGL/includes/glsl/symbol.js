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

(function(glsl) {

	function SymbolTableEntry(name, typedef) {
		this.name = name;
		this.typedef = typedef;
		this.type = null;
		this.definition = null;
		this.depth = null;
		this.qualifier = null;
		this.out = name;
	}

	SymbolTableEntry.typedef = {
		variable : 0,
		func : 1,
		type : 2
	};

	SymbolTable = (function() {

		//Internal Constructor
		function Initializer() {
			this.table = {};
			this.depth = 0;
		}

		var symbol_table = jClass('symbol_table', Initializer);

		//public:
		symbol_table.push_scope = function() {
			this.depth++;
		};

		symbol_table.pop_scope = function() {
			var n, t;
			for (n in this.table) {
				t = this.table[n];
				while (t[0] && t[0].depth == this.depth) {
					t.splice(0, 1);	
				}
				if (t.length == 0) {
					delete this.table[n];	
				}

			}
			this.depth--;
		};
	
		symbol_table.name_declared_this_scope = function(name) {
			var e = this.get_entry(name);
			return e && e.depth == this.depth;
		};

		symbol_table.add_variable = function(name, type) {
			var entry = new SymbolTableEntry(name, SymbolTableEntry.typedef.variable);
			entry.type = type;
			return this.add_entry(entry);
		};
	
		symbol_table.add_type = function(name, t) {
			var entry = new SymbolTableEntry(name, SymbolTableEntry.typedef.type);
			entry.definition = t;
			return this.add_entry(entry);
		};
	
		symbol_table.add_function = function(name, type, def) {
			var entry;

			//don't readd the exact same function definition
			if (entry = this.get_function(name, type, def)) {
				return entry;
			}

			entry = new SymbolTableEntry(name, SymbolTableEntry.typedef.func);
			entry.type = type;
			if (def) {
				entry.definition = def;
			}

			return this.add_entry(entry);
		};

		symbol_table.get_variable = function(name) {
			var entry = this.get_entry(name, SymbolTableEntry.typedef.variable);
			return entry;
		};
	
		symbol_table.get_type = function(name) {
			var entry = this.get_entry(name, SymbolTableEntry.typedef.type);
			return entry;
		};

		symbol_table.get_function = function(name, type, def) {
			var entry = this.get_entry(name, SymbolTableEntry.typedef.func, def);
			return entry;
		};

		//private:

		symbol_table.match_definition = function(def, entry) {
			var i;
			if (!def) {
				return true;	
			}
			if (def.length != entry.length) {
				return false;	
			}
			for (i = 0; i < def.length; i++) {
				if (def[i] != entry[i]) {
					return false;
				}
			}
			return true;
		};

		symbol_table.add_entry = function(entry) {
			if (!this.table[entry.name]) {
				this.table[entry.name] = [];	
			}
			this.table[entry.name].splice(0, 0, entry);
			entry.depth = this.depth;
			return entry;
		};

		symbol_table.get_entry = function(name, typedef, def) {
			var t, i, entry;
			t = this.table[name] || [];
			for (i = 0; i < t.length; i++) {
				entry = t[i];
				if (entry.typedef == typedef && (typedef != SymbolTableEntry.typedef.func || this.match_definition(def, entry.definition))) {
					return entry;
				}
			}
			return null;
		};
	
		return symbol_table.Constructor;	
	
	}());

	//-----------------------------------------------------------
	//External interface

	glsl.symbol_table = SymbolTable;
	glsl.symbol_table_entry = SymbolTableEntry;

}(glsl));

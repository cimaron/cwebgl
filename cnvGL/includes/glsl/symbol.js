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

	SymbolTableEntry = function(name, typedef) {
		this.name = name;
		this.typedef = typedef;
		this.type = null;
		this.definition = null;
		this.depth = null;

		this.object_name = null;
		this.qualifier = null;
		this.next = null;
	};

	SymbolTableEntry.typedef = {
		variable : 0,
		func : 1,
		type : 2
	};

	SymbolTable = (function() {

		//Internal Constructor
		function Initializer() {
			this.table = {
				depth : 0,
				parent : null,
				data : {}
			};
		}
		
		var symbol_table = jClass('symbol_table', Initializer);
	
		//public:	
		symbol_table.push_scope = function() {
			this.table = {
				depth : this.table.depth + 1,
				parent : this.table,
				data : {}
			};
		};

		symbol_table.pop_scope = function() {
			this.table = this.table.parent;
		};
	
		symbol_table.name_declared_this_scope = function(name) {
			return (this.table.data[name] ? true : false);
		};

		symbol_table.add_variable = function(name) {
			var entry = new SymbolTableEntry(name, SymbolTableEntry.typedef.variable);
			entry.object_name = '@' + name + '@';
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
			
			if (name != 'main') {
				entry.object_name = '@' + name + '@';
			} else {
				entry.object_name = (glsl.mode == 1) ? '@fragment.main@' : '@vertex.main@';
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
			var i;
			var entry = this.get_entry(name, SymbolTableEntry.typedef.func);	
			while (def && entry) {
				if (!this.match_definition(def, entry.definition)) {
					entry = entry.next;	
					continue;
				}
				break;
			}
			return entry;
		};

		//private:

		symbol_table.match_definition = function(def, entry) {
			var i;
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
			//insert to head of linked list if same name
			if (this.table.data[entry.name]) {
				entry.next = this.table.data[entry.name];	
			}
			this.table.data[entry.name] = entry;
			entry.depth = this.table.depth;
			return entry;
		};

		symbol_table.get_entry = function(name, typedef) {
			var table = this.table;
			while (table != null) {
				if (table.data[name]) {
					return table.data[name];
				}
				table = table.parent;
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

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

//----------------------------------------------------------------------------------------
//	class ShaderLinker
//----------------------------------------------------------------------------------------

function ShaderLinker() {

	//member variables:

	//Call constructor
	this.construct();
}

//----------------------------------------------------------------------------------------
//	Class Magic
//----------------------------------------------------------------------------------------

__ShaderLinker = new pClass('ShaderLinker');
ShaderLinker.prototype = __ShaderLinker;

//----------------------------------------------------------------------------------------
//	Methods
//----------------------------------------------------------------------------------------

__ShaderLinker.ShaderLinker = function() {
	this.executable = new ShaderLinkerExecutable();
	this.object_code = [];
}

//public:
		
__ShaderLinker.addObjectCode = function(shader_obj) {
	this.object_code.push(shader_obj);
}

__ShaderLinker.link = function() {

	debugger;	
	
	for (var i = 0; i < this.object_code.length; i++) {
		this.executable.object_code += this.object_code[i].object_code;
		this.addSymbols(this.object_code[i].symbol_table);
	}

	var code = this.buildExecutable(this.executable.object_code);
	this.executable.vertex_entry = code.vertex_entry;
	this.executable.fragment_entry = code.fragment_entry;
	this.executable.access = code.access;

	return this.executable;
}

//private:

__ShaderLinker.addSymbols = function(symbols) {
	//@todo: generate errors for surpassing the maximum allowable amount of each type of variable
	for (var i in symbols) {
		this.executable.symbol_table[i] = symbols[i];	
	}
}

__ShaderLinker.buildExecutable = function(__object_code) {

	//special variables and functions form the basic storage and input/output mechanism of
	//the program "executable" (closure)

	eval(__object_code);
	
	return {
		access : {
			getUniform : __getUniform,
			setUniform : __setUniform,
			getAttribute : __getAttribute,
			setAttribute : __setAttribute,
			getOut : __getOut
		},
		vertex_entry : __vertexEntry,
		fragment_entry : __fragmentEntry
	};
}


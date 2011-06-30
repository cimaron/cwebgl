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
//	class ShaderCompiler
//----------------------------------------------------------------------------------------

function ShaderCompiler(type) {

	//member variables:
	this.object = null;
	this.errors = [];

	//call constructor
	this.construct(type);
}

//----------------------------------------------------------------------------------------
//	Class Magic
//----------------------------------------------------------------------------------------

__ShaderCompiler = new pClass;
ShaderCompiler.prototype = __ShaderCompiler;

//----------------------------------------------------------------------------------------
//	Methods
//----------------------------------------------------------------------------------------

__ShaderCompiler.ShaderCompiler = function() {
	this.object = new ShaderCompilerObject();
}

//public:

__ShaderCompiler.compile = function(source) {

	var preprocessor = new ShaderCompilerPreprocessor();
	
	//set up parser and communication
	var parser = GLSLGrammar;
	parser.yy.compiler = this;

	//var generator = new ShaderCompilerGenerator();

	var processed_source = preprocessor.preprocess(source);
	if (!processed_source) {
		//get some error from preprocessor
		return;
	}

	try {
		var parsed = parser.parse(processed_source);
	} catch (err) {
		this.errors.push(err.message);
		return false;
	}
	console.log(parsed);
	
	var symbol_table = parsed.symbol_table;
	var parse_tree = parsed.parse_tree;
	return true;
}

__ShaderCompiler.getErrors = function() {
	return this.errors.join("\n");	
}

//----------------------------------------------------------------------------------------
//	The following are preconstructed sample programs based on the specific test program
//	They will be removed and replaced when the actual compiler is built
//----------------------------------------------------------------------------------------

/*
__ShaderCompiler.compile = function(shader_source) {
	this.defaultSymbols();
	if (shader_source.indexOf('gl_Position') != -1) {
		this.defaultVertex();		
	} else {
		this.defaultFragment();
	}
	return this.object;
}
*/

__ShaderCompiler.defaultSymbols = function() {
	var symbol_table = this.object.symbol_table;
	symbol_table['gl_Position'] = new ShaderCompilerSymbol('attribute', 'vec4', 'gl_Position', false);
	symbol_table['gl_FragColor'] = new ShaderCompilerSymbol('attribute', 'vec4', 'gl_FragColor', false);
}


/*
#ifdef GL_ES
	precision high float;
#endif
 
varying vec4 vColor;

void main(void) {
	gl_FragColor = vColor;
}	
*/
__ShaderCompiler.defaultFragment = function() {
	var symbol_table = this.object.symbol_table;

	//actual program
	var program = 
	"var __fragmentEntry = function() { \n"+
	"	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n"+
	"};\n";
	this.object.object_code = program;
}


/*
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
*/
__ShaderCompiler.defaultVertex = function() {
	var symbol_table = this.object.symbol_table;

	symbol_table['aVertexPosition'] = new ShaderCompilerSymbol('attribute', 'vec3', 'aVertexPosition', false);
	symbol_table['uMVMatrix'] = new ShaderCompilerSymbol('uniform', 'mat4', 'uMVMatrix', false);
	symbol_table['uPMatrix'] = new ShaderCompilerSymbol('uniform', 'mat4', 'uPMatrix', false);

	//program
	var program = 
	"__attributes['aVertexPosition'] = [0,0,0];\n"+
	"__uniforms['uMVMatrix'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];\n"+
	"__uniforms['uPMatrix'] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];\n"+
	"var __vertexEntry = function() { \n"+
	"	gl_Position = mult4x4(mult4x4(__uniforms.uPMatrix, __uniforms.uMVMatrix), [__attributes.aVertexPosition[0], __attributes.aVertexPosition[1], __attributes.aVertexPosition[2], 1.0]);\n"+
	"};\n";

	this.object.object_code = program;
}

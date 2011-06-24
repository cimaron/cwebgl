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
	this.type = null;

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

__ShaderCompiler.ShaderCompiler = function(type) {
	this.type = type;
}

//public:

__ShaderCompiler.compile = function(shader_source, shader_obj) {
	if (this.type == GL_VERTEX_SHADER) {
		this.result = defaultVertex(shader_obj);
	} else {
		this.result = defaultFragment(shader_obj);
	}
	return true;
}

/*

__ShaderCompiler._compile = function() {
	//preprocess
	var pp = new ShaderCompilerPreprocessor();
	processed_source = pp.preprocess(shader_source);
	if (!processed_source) {
		//get some error from preprocessor	
	}

	var lexer = new __glCompileShaderLexer();
	var parser = new __glCompileShaderParser();
	var parsed = parser.parse(lexer, processed_source);

	if (!parsed) {
		//get some error from 
	}

	var symbol_table = parsed.symbol_table;
	var parse_tree = parsed.parse_tree;

	var generator = new __glCompileShaderGenerator(symbol_table, parse_tree);
}

*/

//----------------------------------------------------------------------------------------
//	The following are preconstructed sample programs based on the specific test program
//	They will be removed and replaced when the actual compiler is built
//----------------------------------------------------------------------------------------

/*
#ifdef GL_ES
	precision highp float;
#endif
 
varying vec4 vColor;

void main(void) {
	gl_FragColor = vColor;
}	
*/
function defaultFragment(shader_obj) {

	//actual program
	var program = 
	"var main = function(__initialize) { "+
	"	__data = __initialize;"+
	"	__data.gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);"+
	"};";
	shader_obj.object_code = program;
	shader_obj.compile_status = true;
}



/*
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
*/
function defaultVertex(shader_obj) {

	var aVertexPosition = new cnvgl_shader_symbol('attribute', 'vec3', 'aVertexPosition', false);
	shader_obj.symbol_table.push(aVertexPosition);

	var uMVMatrix = new cnvgl_shader_symbol('uniform', 'mat4', 'uMVMatrix', false);
	shader_obj.symbol_table.push(aVertexPosition);
	
	var uPMatrix = new cnvgl_shader_symbol('uniform', 'mat4', 'uPMatrix', false);
	shader_obj.symbol_table.push(uPMatrix);

	//program
	var program = 
	"var main = function(__initialize) { \n"+
	"	__data = __initialize;\n"+
	"	__data.gl_Position = mult4x4(mult4x4(__data.uPMatrix, __data.uMVMatrix), vec4(__data.aVertexPosition, 1.0));\n"+
	"};\n";

	shader_obj.object_code = program;
	shader_obj.compile_status = true;
}

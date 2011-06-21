

function ShaderCompiler(type) {
	this.type = null;
	this.construct(type);
}

function __ShaderCompiler() {
	this.ShaderCompiler = function(type) {
		this.type = type;
	}

	this.compile = function(shader_source, shader_obj) {
		if (this.type == GL_VERTEX_SHADER) {
			this.result = defaultVertex(shader_obj);
		} else {
			this.result = defaultFragment(shader_obj);
		}
		return true;
	}

	this._compile = function() {
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
}
__ShaderCompiler.prototype = new pClass;
ShaderCompiler.prototype = new __ShaderCompiler;





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
	"function() {"+
	"	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);"+
	"}";
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
	"function() {"+
	"	gl_Position = mult4x4(mult4x4(uPMatrix, uMVMatrix), vec4(aVertexPosition, 1.0));"+
	"}";

	shader_obj.object_code = program;
	shader_obj.compile_status = true;
}

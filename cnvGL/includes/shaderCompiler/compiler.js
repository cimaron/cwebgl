
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

	shader_obj.varying = ['vColor'];

	//actual program
	var program = 
	"function() {"+
	"	gl_FragColor = vColor;"+
	"}";
	shader_obj.object_code = program;
	shader_obj.compile_status = true;
}



/*
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	vColor = aVertexColor;
}
*/
function defaultVertex(shader_obj) {

	shader_obj.attributes = ['aVertexPosition', 'aVertexColor'];
	shader_obj.uniforms = ['uMVMatrix', 'uPMatrix'];
	shader_obj.varying = ['vColor'];

	//program
	var program = 
	"function() {"+
	"	gl_Position = mult4x4(mult4x4(uPMatrix, uMVMatrix), vec4(aVertexPosition, 1.0));"+
	"	vColor = aVertexColor;"+
	"}";

	shader_obj.object_code = program;
	shader_obj.compile_status = true;
}

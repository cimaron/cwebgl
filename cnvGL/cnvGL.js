
include('cnvGL/defines.js');
include('cnvGL/constants.js');

include('cnvGL/objects/cnvgl_attrib_array.js');
include('cnvGL/objects/cnvgl_attribute.js');
include('cnvGL/objects/cnvgl_buffer.js');
include('cnvGL/objects/cnvgl_context.js');
include('cnvGL/objects/cnvgl_program.js');
include('cnvGL/objects/cnvgl_shader.js');
include('cnvGL/objects/cnvgl_texture.js');
include('cnvGL/objects/cnvgl_uniform.js');
include('cnvGL/objects/cnvgl_vertex.js');

//Compiler
include('cnvGL/includes/shaderCompiler/ast.js');
include('cnvGL/includes/shaderCompiler/compiler.js');
include('cnvGL/includes/shaderCompiler/object.js');
include('cnvGL/includes/shaderCompiler/parser.js');
include('cnvGL/includes/shaderCompiler/preprocessor.js');
include('cnvGL/includes/shaderCompiler/symbol.js');

//Linker
include('cnvGL/includes/shaderLinker/linker.js');
include('cnvGL/includes/shaderLinker/executable.js');

include('cnvGL/includes/include.php');

include('cnvGL/includes/vertex_processor.js');

include('cnvGL/functions/glAttachShader.js');
include('cnvGL/functions/glBindBuffer.js');
include('cnvGL/functions/glBindTexture.js');
include('cnvGL/functions/glBufferData.js');
include('cnvGL/functions/glClear.js');
include('cnvGL/functions/glClearColor.js');
include('cnvGL/functions/glClearDepth.js');
include('cnvGL/functions/glCompileShader.js');
include('cnvGL/functions/glCreateProgram.js');
include('cnvGL/functions/glCreateShader.js');
include('cnvGL/functions/glDrawArrays.js');
include('cnvGL/functions/glEnable.js');
include('cnvGL/functions/glEnableVertexAttribArray.js');
include('cnvGL/functions/glGenBuffers.js');
include('cnvGL/functions/glGenTextures.js');
include('cnvGL/functions/glGet.js');
include('cnvGL/functions/glGetAttribLocation.js');
include('cnvGL/functions/glGetProgramiv.js');
include('cnvGL/functions/glGetShaderInfoLog.js');
include('cnvGL/functions/glGetShaderiv.js');
include('cnvGL/functions/glGetUniformLocation.js');
include('cnvGL/functions/glLinkProgram.js');
include('cnvGL/functions/glShaderSource.js');
include('cnvGL/functions/glTexImage2D.js');
include('cnvGL/functions/glUniform.js');
include('cnvGL/functions/glUseProgram.js');
include('cnvGL/functions/glVertexAttribPointer.js');
include('cnvGL/functions/glViewport.js');


//internal functions
function cnvgl_throw_error(error_code) {
	if (!cnvgl_state.current_error_code) {
		cnvgl_state.current_error_code = error_code;
	}
}

cnvgl_objects = [0];



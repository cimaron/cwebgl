
include('cnvGL/defines.js');
include('cnvGL/constants.js');

include('cnvGL/objects/cnvgl_attrib_array.js');
include('cnvGL/objects/cnvgl_attribute.js');
include('cnvGL/objects/cnvgl_buffer.js');
include('cnvGL/objects/cnvgl_context.js');
include('cnvGL/objects/cnvgl_fragment.js');
include('cnvGL/objects/cnvgl_primitive.js');
include('cnvGL/objects/cnvgl_program.js');
include('cnvGL/objects/cnvgl_shader.js');
include('cnvGL/objects/cnvgl_texture.js');
include('cnvGL/objects/cnvgl_uniform.js');
include('cnvGL/objects/cnvgl_vertex.js');

//Compiler
include('cnvGL/includes/glsl/object.js');
include('cnvGL/includes/glsl/compiler.js');
include('cnvGL/includes/glsl/output.js');
include('cnvGL/includes/glsl/symbol.js');
include('cnvGL/includes/glsl/preprocessor.js');
include('cnvGL/includes/glsl/lexer.js');
include('cnvGL/includes/glsl/lexer_extern.js');
include('cnvGL/includes/glsl/parser.js');
include('cnvGL/includes/glsl/ast.js');
include('cnvGL/includes/glsl/generator.js');

//Linker
include('cnvGL/includes/linker/linker.js');
include('cnvGL/includes/linker/symbol.js');

//Rendering Pipeline
include('cnvGL/includes/rendering/renderer.js');
include('cnvGL/includes/rendering/fragment.js');
include('cnvGL/includes/rendering/vertex.js');
include('cnvGL/includes/rendering/data.js');
include('cnvGL/includes/rendering/clipping.js');

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



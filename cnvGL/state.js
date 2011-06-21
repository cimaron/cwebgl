
function cnvGLState() {
	var cnvgl_state = {

		current_error_code : 0,
	
		enabled : {},

		//Frame Buffers
		clear_color : [0,0,0,0],
		clear_depth : 0,	
		color_buffer : null,
		depth_buffer : null,
		
		//Viewport
		viewport_x : 0,
		viewport_y : 0,
		viewport_w : 0,
		viewport_h : 0,

		//Buffers
		bound_buffers : {},

		current_program : null,

		//Shaders
		//device_context : null, //@todo: What is this?
		
		//@todo: should these go in program object?
		vertex_attributes : [],
		vertex_attribute_names : {}
	};

	cnvgl_state.enabled[GL_DEPTH_TEST] = GL_TRUE;

	cnvgl_state.bound_buffers[GL_ARRAY_BUFFER] = 0;
	cnvgl_state.bound_buffers[GL_ELEMENT_ARRAY_BUFFER] = 0;
	
	//Shaders
	
	//gl_Vertex
	var gl_Vertex = new cnvgl_vertex_attribute('gl_Vertex');
	//@todo: initialize gl_Vertex some more
	cnvgl_state.vertex_attributes[0] = gl_Vertex;
	cnvgl_state.vertex_attribute_names['gl_Vertex'] = 0;

	//...

	return cnvgl_state;
};


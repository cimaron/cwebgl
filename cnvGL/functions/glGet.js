
function glGetBooleanv(pname, params) {
	__glGet(pname, params);
	params[0] = (params[0] == 0.0 ? GL_FALSE : GL_TRUE); 
}

function glGetDoublev(pname, params) {
	__glGet(pname, params);
	if (typeof params[0] == 'boolean') {
		params[0] = params[0] ? GL_TRUE : GL_FALSE;	
	}	
}

function glGetFloatv(pname, params) {
	__glGet(pname, params);
	if (typeof params[0] == 'boolean') {
		params[0] = params[0] ? GL_TRUE : GL_FALSE;	
	}	
}

function glGetIntegerv(pname, params) {
	__glGet(pname, params);
	if (typeof params[0] == 'boolean') {
		params[0] = params[0] ? GL_TRUE : GL_FALSE;	
	} else {
		params[0] = Math.round(params[0]);
	}
}


/*void*/
function __glGet(pname, params) {
	switch (pname) {
		case GL_MAX_VERTEX_ATTRIBS:
			params[0] = cnvgl_const.GL_MAX_VERTEX_ATTRIBS;
			return;
		case GL_MAX_FRAGMENT_UNIFORM_COMPONENTS:
			params[0] = cnvgl_const.GL_MAX_FRAGMENT_UNIFORM_COMPONENTS;
			return;
		case GL_MAX_VIEWPORT_DIMS:
			//use width and height of canvas context (possibly initialized in cnvgl_const)

		default:
			console.log('todo: __glGet', pname);
	}
}


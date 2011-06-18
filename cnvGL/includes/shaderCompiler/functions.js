
//ShShaderType
SH_FRAGMENT_SHADER				= 0x8B30;
SH_VERTEX_SHADER				= 0x8B31;

//ShShaderSpec
SH_WEBGL_SPEC					= 0x8B41;

//ShShaderInfo
SH_OBJECT_CODE					= 0x0004;
SH_INFO_LOG_LENGTH				= 0x8B84;
SH_OBJECT_CODE_LENGTH			= 0x8B88;
SH_ACTIVE_UNIFORMS				= 0x8B86;
SH_ACTIVE_UNIFORM_MAX_LENGTH	= 0x8B87;
SH_ACTIVE_ATTRIBUTES			= 0x8B89;
SH_ACTIVE_ATTRIBUTE_MAX_LENGTH	= 0x8B8A;



function ShConstructCompiler(type, spec, resources) {
	return new ShaderCompiler(type);
}

function ShDestruct(compiler) {
	//maybe we'll need this in the future?
	if (compiler.destruct) {
		compiler.destruct();	
	}
}

function ShCompile(compiler, shaderSourceStrings, numStrings, compileOptions) {
	var success = compiler.compile(shaderSourceStrings, numStrings, compileOptions);
	return success;
}

function ShGetInfo(compiler, pname, params) {
    if (!compiler || !params) {
        return;
	}
	
    switch (pname) {
		case SH_INFO_LOG_LENGTH:
			//params[0] = compiler.getInfoSink().info.size() + 1;
			break;
		case SH_OBJECT_CODE_LENGTH:
			params[0] = compiler.result.program.length;
			//params[0] = compiler.getInfoSink().obj.size() + 1;
			break;
		case SH_ACTIVE_UNIFORMS:
			//params[0] = compiler.getUniforms().size();
			break;
		case SH_ACTIVE_UNIFORM_MAX_LENGTH:
			//params[0] = getVariableMaxLength(compiler.getUniforms());
			break;
		case SH_ACTIVE_ATTRIBUTES:
			//params[0] = compiler.getAttribs().size();
			break;
		case SH_ACTIVE_ATTRIBUTE_MAX_LENGTH:
			//params = getVariableMaxLength(compiler.getAttribs());
			break;
	    default:
			//do something here
	}
}

function ShGetObjectCode(compiler, objCode) {
	if (!compiler || !objCode) {
		return;	
	}
	
	objCode[0] = compiler.result.program;
}




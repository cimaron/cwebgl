WebGLInclude(_base+'/graphics/shaderCompiler/compiler.js');

SH_VERTEX_SHADER = 1;
SH_FRAGMENT_SHADER = 2;


function ShaderCompilerBridge() {
	this.buildCompilers = false;
	this._fragmentCompiler = null;
	this._vertexCompiler = null;
	this._resources = null;
	this.construct();
}

function __ShaderCompilerBridge() {
	
	this.ShaderCompilerBridge = function() {
	}

	this.cleanupCompilers = function() {
		if (this._fragmentCompiler) {
			ShDestruct(this._fragmentCompiler);
		}
		this._fragmentCompiler = null;
	    if (this._vertexCompiler) {
			ShDestruct(this._vertexCompiler);
		}
		this._vertexCompiler = null;

		this.builtCompilers = false;
	}

	this.validateShaderSource = function(shaderSource, shaderType, translatedShaderSource, shaderValidationLog) {

		if (!this.builtCompilers) {
        	this._fragmentCompiler = ShConstructCompiler(SH_FRAGMENT_SHADER, SH_WEBGL_SPEC, this._resources);
        	this._vertexCompiler = ShConstructCompiler(SH_VERTEX_SHADER, SH_WEBGL_SPEC, this._resources);
			if (!this._fragmentCompiler || !this._vertexCompiler) {
				this.cleanupCompilers();
				return false;
			}
			builtCompilers = true;
		}
		
		var compiler;
		
		if (shaderType == ShaderCompilerBridge.SHADER_TYPE_VERTEX) {
			compiler = this._vertexCompiler;
		} else {
			compiler = this._fragmentCompiler;	
		}

		var shaderSourceStrings = [shaderSource];
		var validateSuccess = ShCompile(compiler, shaderSourceStrings, 1, SH_OBJECT_CODE);

		if (!validateSuccess) {
			var logSize = [0];
			ShGetInfo(compiler, SH_INFO_LOG_LENGTH, logSize);
			logSize = logSize[0];
			if (logSize > 1) {
				var logBuffer = [null];
				ShGetInfoLog(compiler, logBuffer);
				logBuffer = logBuffer[0];
                shaderValidationLog[0] = logBuffer;
	        }
	        return false;
	    }

		var translationLength = [null];
		ShGetInfo(compiler, SH_OBJECT_CODE_LENGTH, translationLength);
		translationLength = translationLength[0];

		if (translationLength > 1) {
			var translationBuffer = [null];
			ShGetObjectCode(compiler, translationBuffer);
			translationBuffer = translationBuffer[0];
			translatedShaderSource[0] = translationBuffer;
	    }

		return true;
	}
	
	this.enum = {
		SHADER_TYPE_VERTEX : SH_VERTEX_SHADER,
		SHADER_TYPE_FRAGMENT : SH_FRAGMENT_SHADER,	
	}

	this.enumerate();
}

__ShaderCompilerBridge.prototype = new pClass;
ShaderCompilerBridge.prototype = new __ShaderCompilerBridge;



function ShaderCompilerPreprocessor() {
	
}

function __ShaderCompilerPreprocessor() {
	this.preprocess = function(source) {
		//pretty dumb, just want to make it work for right now
		source = source.replace(/\#[^\n]+/, '');
		return source;
	}
}
__ShaderCompilerPreprocessor.prototype = new pClass;
ShaderCompilerPreprocessor.prototype = new __ShaderCompilerPreprocessor;
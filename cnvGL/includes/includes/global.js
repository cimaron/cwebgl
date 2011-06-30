

var __uniforms = {};
var __getUniform = function(i) {
	return __uniforms[i];
};
var __setUniform = function(i, v) {
	__uniforms[i] = v;
};

var __attributes = {};
var __getAttribute = function(i) {
	return __attributes[i];
};
var __setAttribute = function(i, v) {
	__attributes[i] = v;
};


var __out = {};
var __getOut = function(i) {
	return __out[i];
};

__out.gl_PerVertex = {
	gl_Position : [0, 0, 0, 0],
	gl_PointSize : 0,
	gl_ClipDistance : []
};
var gl_Position = __out.gl_PerVertex.gl_Position;

var mult4x4 = function(a, b) {
	return mat4.multiply(a, b, []);
};


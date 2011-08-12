
__ShaderLinker.addObjectCode(
	(function() {
		var sco = new ShaderCompilerObject();
		sco.symbol_table = new glsl.symbol_table();

		sco.object_code = [

			"gl_PerVertex = {",
			"	gl_Position : [0, 0, 0, 0],",
			"	gl_PointSize : 0,",
			"	gl_ClipDistance : []",
			"};",
			
			"gl_FragColor = [0, 0, 0, 0];",

			"var mat4_multiplyVec4 = function(a, b) {",
			"	return mat4.multiplyVec4(a, b, []);",
			"};",

			"var mat4_multiply = function(a, b) {",
			"	return mat4.multiply(a, b, []);",
			"};"

		].join("\n");
		
		return sco;
	})()
);

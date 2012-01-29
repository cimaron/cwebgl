/*
Copyright (c) 2011 Cimaron Shanahan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function(cnvgl) {


	function cnvgl_uniform(location, value, slots, components) {
		var ctx, program_obj, uniform_obj, i;
	
		ctx = cnvgl.getCurrentContext();
		program_obj = ctx.shader.activeProgram;
	
		if (!program_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}

		if (location == -1) {
			return;
		}

		//may want to set a uniform location cache in program_obj to avoid this lookup
		for (i = 0; i < program_obj.uniforms.active.length; i++) {
			if (program_obj.uniforms.active[i].location == location) {
				uniform_obj = program_obj.uniforms.active[i];
				break;
			}
		}

		if (!uniform_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;		
		}

		if (slots != uniform_obj.slots || components != uniform_obj.components) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;		
		}

		ctx.driver.uploadUniform(ctx, location, value, slots, components);
	}


	/**
	 * glGetUniformLocation — Returns the location of a uniform variable
	 *
	 * @var GLuint  program  Specifies the program object to be queried.
	 * @var String  name     Points to a null terminated string containing the name of the uniform variable whose location is to be queried.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGetUniformLocation.xml
	 */
	cnvgl.getUniformLocation = function(program, name) {
		var ctx, program_obj, u;

		//get program
		ctx = cnvgl.getCurrentContext();
		program_obj = ctx.shared.shaderObjects[program];
	
		//no program exists
		if (!program_obj) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		//object is not a program (BAD!)
		if (!program_obj instanceof cnvgl.program) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}	
	
		if (!program_obj.link_status) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}
	
		if (u = program_obj.uniforms.names[name]) {
			return u.location;
		}
	
		return -1;
	};


	/**
	 * glUniform1f — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint    location  Specifies the location of the uniform variable to be modified.
	 * @var GLfloat  v0        Specifies the new values to be used for the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform1f = function(location, v0) {
		cnvgl_uniform(location, [v0], 1, 1);
	};


	/**
	 * glUniform1i — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint  location  Specifies the location of the uniform variable to be modified.
	 * @var GLint  v0        Specifies the new values to be used for the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform1i = function(location, v0) {
		cnvgl_uniform(location, [v0], 1, 1);
	};


	/**
	 * glUniform1ui — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint   location  Specifies the location of the uniform variable to be modified.
	 * @var GLuint  v0        Specifies the new values to be used for the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform1ui = function(location, v0) {
		cnvgl_uniform(location, [v0], 1, 1);
	};


	/**
	 * glUniform2f — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint    location  Specifies the location of the uniform variable to be modified.
	 * @var GLfloat  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLfloat  v1
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform2f = function(location, v0, v1) {
		cnvgl_uniform(location, [v0, v1], 1, 2);
	};


	/**
	 * glUniform2i — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint  location  Specifies the location of the uniform variable to be modified.
	 * @var GLint  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLint  v1
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform2i = function(location, v0, v1) {
		cnvgl_uniform(location, [v0, v1], 1, 2);
	};


	/**
	 * glUniform2ui — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint   location  Specifies the location of the uniform variable to be modified.
	 * @var GLuint  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLuint  v1
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform2ui = function(location, v0, v1) {
		cnvgl_uniform(location, [v0, v1], 1, 2);
	};


	/**
	 * glUniform3f — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint    location  Specifies the location of the uniform variable to be modified.
	 * @var GLfloat  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLfloat  v1
	 * @var GLfloat  v2
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform3f = function(location, v0, v1, v2) {
		cnvgl_uniform(location, [v0, v1, v2], 1, 3);
	};


	/**
	 * glUniform3i — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint  location  Specifies the location of the uniform variable to be modified.
	 * @var GLint  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLint  v1
	 * @var GLint  v2
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform3i = function(location, v0, v1, v2) {
		cnvgl_uniform(location, [v0, v1, v2], 1, 3);
	};


	/**
	 * glUniform3ui — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint   location  Specifies the location of the uniform variable to be modified.
	 * @var GLuint  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLuint  v1
	 * @var GLuint  v2
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform3ui = function(location, v0, v1, v2) {
		cnvgl_uniform(location, [v0, v1, v2], 1, 3);
	};


	/**
	 * glUniform4f — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint    location  Specifies the location of the uniform variable to be modified.
	 * @var GLfloat  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLfloat  v1
	 * @var GLfloat  v2
	 * @var GLfloat  v3
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform4f = function(location, v0, v1, v2, v4) {
		cnvgl_uniform(location, [v0, v1, v2, v3], 1, 4);
	};


	/**
	 * glUniform4i — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint  location  Specifies the location of the uniform variable to be modified.
	 * @var GLint  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLint  v1
	 * @var GLint  v2
	 * @var GLint  v3
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform4i = function(location, v0, v1, v2, v3) {
		cnvgl_uniform(location, [v0, v1, v2, v3], 1, 4);
	};


	/**
	 * glUniform4ui — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint   location  Specifies the location of the uniform variable to be modified.
	 * @var GLuint  v0        Specifies the new values to be used for the specified uniform variable.
	 * @var GLuint  v1
	 * @var GLuint  v2
	 * @var GLuint  v3
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform4ui = function(location, v0, v1, v2, v3) {
		cnvgl_uniform(location, [v0, v1, v2, v3], 1, 4);
	};


	/**
	 * glUniform1fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLfloat]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform1fv = function(location, count, value) {
		var i;
		for (i = 0; i < count; i++) {
			cnvgl_uniform(i + location, [value[i]], 1, 1);
		}
	};


	/**
	 * glUniform1iv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint    location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei  count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLint]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform1iv = function(location, count, value) {
		var i;
		for (i = 0; i < count; i++) {
			cnvgl_uniform(i + location, [value[i]], 1, 1);
		}
	};


	/**
	 * glUniform1uiv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint     location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei   count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLuint]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform1uiv = function(location, count, value) {
		var i;
		for (i = 0; i < count; i++) {
			cnvgl_uniform(i + location, [value[i]], 1, 1);
		}
	};


	/**
	 * glUniform2fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLfloat]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform2fv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 2 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1]], 1, 2);
		}
	};


	/**
	 * glUniform2iv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint    location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei  count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLint]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform2iv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 2 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1]], 1, 2);
		}
	};


	/**
	 * glUniform2uiv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint     location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei   count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLuint]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform2uiv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 2 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1]], 1, 2);
		}
	};


	/**
	 * glUniform3fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLfloat]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform3fv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 3 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1], value[v + 2]], 1, 3);
		}
	};


	/**
	 * glUniform3iv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint    location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei  count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLint]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform3iv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 3 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1], value[v + 2]], 1, 3);
		}
	};


	/**
	 * glUniform3uiv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint     location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei   count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLuint]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform3uiv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 3 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1], value[v + 2]], 1, 3);
		}
	};


	/**
	 * glUniform4fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLfloat]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform3fv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 4 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1], value[v + 2]], 1, 3);
		}
	};


	/**
	 * glUniform4iv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint    location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei  count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLint]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform4iv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 4 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1], value[v + 2], value[v + 3]], 1, 4);
		}
	};


	/**
	 * glUniform4uiv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint     location  Specifies the location of the uniform value to be modified.
	 * @var GLsizei   count     Specifies the number of elements that are to be modified. This should be 1 if the targeted uniform variable is not an array, and 1 or more if it is an array.
	 * @var [GLuint]  value     Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniform4uiv = function(location, count, value) {
		var i, v;
		for (i = 0; i < count; i++) {
			v = 4 * i;
			cnvgl_uniform(i + location, [value[v], value[v + 1], value[v + 2], value[v + 3]], 1, 4);
		}
	};


	/**
	 * glUniformMatrix2fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix2fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 4 * i;
			l = i * 2 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,     [value[v    ], value[v + 1]], 1, 2);
				cnvgl_uniform(l + 1, [value[v + 2], value[v + 3]], 1, 2);
			} else {
				cnvgl_uniform(l,     [value[v    ], value[v + 2]], 1, 2);
				cnvgl_uniform(l + 1, [value[v + 1], value[v + 3]], 1, 2);
			}
		}
	};


	/**
	 * glUniformMatrix2x3fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix2x3fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 6 * i;
			l = i * 3 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,     [value[v    ], value[v + 1]], 1, 2);
				cnvgl_uniform(l + 1, [value[v + 2], value[v + 3]], 1, 2);
				cnvgl_uniform(l + 2, [value[v + 4], value[v + 5]], 1, 2);
			} else {
				cnvgl_uniform(l,     [value[v    ], value[v + 3]], 1, 2);
				cnvgl_uniform(l + 1, [value[v + 1], value[v + 4]], 1, 2);
				cnvgl_uniform(l + 2, [value[v + 2], value[v + 5]], 1, 2);				
			}
		}
	};


	/**
	 * glUniformMatrix2x4fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix2x4fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 8 * i;
			l = i * 4 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,     [value[v    ], value[v + 1]], 1, 2);
				cnvgl_uniform(l + 1, [value[v + 2], value[v + 3]], 1, 2);
				cnvgl_uniform(l + 2, [value[v + 4], value[v + 5]], 1, 2);
				cnvgl_uniform(l + 3, [value[v + 6], value[v + 7]], 1, 2);
			} else {
				cnvgl_uniform(l,     [value[v    ], value[v + 4]], 1, 2);
				cnvgl_uniform(l + 1, [value[v + 1], value[v + 5]], 1, 2);
				cnvgl_uniform(l + 2, [value[v + 2], value[v + 6]], 1, 2);				
				cnvgl_uniform(l + 3, [value[v + 3], value[v + 7]], 1, 2);
			}
		}
	};


	/**
	 * glUniformMatrix3x2fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix3x2fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 6 * i;
			l = i * 2 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,     [value[v    ], value[v + 1], value[v + 2]], 1, 3);
				cnvgl_uniform(l + 1, [value[v + 3], value[v + 4], value[v + 5]], 1, 3);
			} else {
				cnvgl_uniform(l,     [value[v    ], value[v + 2], value[v + 4]], 1, 3);
				cnvgl_uniform(l + 1, [value[v + 1], value[v + 3], value[v + 5]], 1, 3);
			}
		}
	};


	/**
	 * glUniformMatrix3fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix3fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 9 * i;
			l = i * 3 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,
							  [value[v    ], value[v + 1], value[v + 2],
							   value[v + 3], value[v + 4], value[v + 5],
							   value[v + 6], value[v + 7], value[v + 8]],
							  3, 3);
			} else {
				cnvgl_uniform(l,
							  [value[v    ], value[v + 3], value[v + 6],
							   value[v + 1], value[v + 4], value[v + 7],
							   value[v + 2], value[v + 5], value[v + 8]],
							  3, 3);
			}
		}
	};


	/**
	 * glUniformMatrix3x4fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix3x4fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 12 * i;
			l = i * 4 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,     [value[v    ], value[v + 1], value[v + 2]], 1, 3);
				cnvgl_uniform(l + 1, [value[v + 3], value[v + 4], value[v + 5]], 1, 3);
				cnvgl_uniform(l + 2, [value[v + 6], value[v + 7], value[v + 8]], 1, 3);
				cnvgl_uniform(l + 3, [value[v + 9], value[v +10], value[v +11]], 1, 3);
			} else {
				cnvgl_uniform(l,     [value[v    ], value[v + 4], value[v + 8]], 1, 3);
				cnvgl_uniform(l + 1, [value[v + 1], value[v + 5], value[v + 9]], 1, 3);
				cnvgl_uniform(l + 2, [value[v + 2], value[v + 6], value[v +10]], 1, 3);
				cnvgl_uniform(l + 3, [value[v + 3], value[v + 7], value[v +11]], 1, 3);
			}
		}
	};


	/**
	 * glUniformMatrix4x2fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix4x2fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 8 * i;
			l = i * 2 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,     [value[v    ], value[v + 1], value[v + 2], value[v + 3]], 1, 4);
				cnvgl_uniform(l + 1, [value[v + 4], value[v + 5], value[v + 6], value[v + 7]], 1, 4);
			} else {
				cnvgl_uniform(l,     [value[v    ], value[v + 2], value[v + 4], value[v + 6]], 1, 4);
				cnvgl_uniform(l + 1, [value[v + 1], value[v + 3], value[v + 5], value[v + 7]], 1, 4);
			}
		}
	};


	/**
	 * glUniformMatrix4x3fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix4x3fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 12 * i;
			l = i * 3 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,
					[value[v    ], value[v + 1], value[v + 2], value[v + 3],
					 value[v + 4], value[v + 5], value[v + 6], value[v + 7],
					 value[v + 8], value[v + 9], value[v +10], value[v +11]],
					3, 4);
			} else {
				cnvgl_uniform(l,     [value[v    ], value[v + 3], value[v + 6], value[v + 9]], 1, 4);
				cnvgl_uniform(l + 1, [value[v + 1], value[v + 4], value[v + 7], value[v +10]], 1, 4);
				cnvgl_uniform(l + 2, [value[v + 2], value[v + 5], value[v + 8], value[v +11]], 1, 4);
			}
		}
	};
	
	
	/**
	 * glUniformMatrix4fv — Specify the value of a uniform variable for the current program object
	 *
	 * @var GLint      location   Specifies the location of the uniform value to be modified.
	 * @var GLsizei    count      Specifies the number of matrices that are to be modified. This should be 1 if the targeted uniform variable is not an array of matrices, and 1 or more if it is an array of matrices.
	 * @var GLboolean  transpose  Specifies whether to transpose the matrix as the values are loaded into the uniform variable.
	 * @var [GLfloat]  value      Specifies a pointer to an array of count values that will be used to update the specified uniform variable.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUniform.xml
	 */
	cnvgl.uniformMatrix4fv = function(location, count, transpose, value) {
		var i, v, l;
		for (i = 0; i < count; i++) {
			v = 16 * i;
			l = i * 4 + location;
			if (transpose != cnvgl.TRUE) {
				cnvgl_uniform(l,
							  [value[v    ], value[v + 1], value[v + 2], value[v + 3],
							   value[v + 4], value[v + 5], value[v + 6], value[v + 7],
							   value[v + 8], value[v + 9], value[v +10], value[v +11],
							   value[v +12], value[v +13], value[v +14], value[v +15]],
							  4, 4);
			} else {
				cnvgl_uniform(l,
							  [value[v    ], value[v + 4], value[v + 8], value[v +12],
							   value[v + 1], value[v + 5], value[v + 9], value[v +13],
							   value[v + 2], value[v + 6], value[v +10], value[v +14],
							   value[v + 3], value[v + 7], value[v +11], value[v +15]],
							  4, 4);
			}
		}
	};


}(cnvgl));



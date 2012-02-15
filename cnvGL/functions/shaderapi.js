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


	/**
	 * glAttachShader — Attaches a shader object to a program object
	 *
	 * @var GLuint  program  Specifies the program object to which a shader object will be attached.
	 * @var GLuint  shader   Specifies the shader object that is to be attached.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glAttachShader.xml
	 */
	cnvgl.attachShader = function(program, shader) {
		var ctx, program_obj, shader_obj;
	
		ctx = cnvgl.getCurrentContext();
	
		program_obj = ctx.shared.shaderObjects[program];
		shader_obj = ctx.shared.shaderObjects[shader];
	
		//program or shader does not exist
		if (!program_obj || !shader_obj) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		//objects are not what they should be
		if (!program_obj instanceof cnvgl.program || !shader_obj instanceof cnvgl.shader) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}
	
		program_obj.attached_shaders.push(shader_obj);	
	};


	/**
	 * glBindAttribLocation — Associates a generic vertex attribute index with a named attribute variable
	 *
	 * @var GLuint  program  Specifies the handle of the program object in which the association is to be made.
	 * @var GLuint  index    Specifies the index of the generic vertex attribute to be bound.
	 * @var String  name     Specifies a null terminated string containing the name of the vertex shader attribute variable to which index is to be bound.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glBindAttribLocation.xml
	 */
	cnvgl.bindAttribLocation = function(program, index, name) {
		var ctx, program_obj, attr_obj;
	
		ctx = cnvgl.getCurrentContext();
		program_obj = ctx.shared.shaderObjects[program];

		//no program exists
		if (!program_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}
	
		if (!program_obj.attributes.bound[name]) {
			//do check that index is valid
			program_obj.attributes.bound[name] = index;
		}
	};


	/**
	 * glGetAttribLocation — glGetAttribLocation — Returns the location of an attribute variable
	 *
	 * @var GLuint  program  Specifies the program object to be queried.
	 * @var String  name     Points to a null terminated string containing the name of the attribute variable whose location is to be queried.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGetAttribLocation.xml
	 */
	cnvgl.getAttribLocation = function(program, name) {
		var ctx, program_obj, attr_obj;
	
		//get program
		ctx = cnvgl.getCurrentContext();
		program_obj = ctx.shared.shaderObjects[program];
	
		//no program exists
		if (!program_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}
	
		if (!program_obj.link_status) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}
	
		if (attrib_obj = program_obj.getActiveAttribute(name)) {
			return attrib_obj.location;	
		}
	
		return -1;
	};


	/**
	 * glCompileShader — Compiles a shader object
	 *
	 * @var GLuint  shader  Specifies the shader object to be compiled.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glCompileShader.xml
	 */
	cnvgl.compileShader = function(shader) {
		var ctx, shader_obj, target, status;
	
		ctx = cnvgl.getCurrentContext();
		shader_obj = ctx.shared.shaderObjects[shader];
	
		//no shader exists
		if (!shader_obj) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}

		//object is not a shader (BAD!)
		if (!shader_obj instanceof cnvgl.shader) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}

		ctx.driver.compileShader(ctx, shader_obj.driverObj, shader_obj.shader_string, shader_obj.type);
		shader_obj.compile_status = ctx.driver.compileStatus;
		shader_obj.information_log = ctx.driver.compileLog;
	};


	/**
	 * glCreateProgram — Creates a program object
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glCreateProgram.xml
	 */
	cnvgl.createProgram = function() {
		var ctx, program_obj, name;

		ctx = cnvgl.getCurrentContext();
		name = ctx.shared.shaderObjects.length;
	
		program_obj = new cnvgl.program();
		program_obj.name = name;
	
		ctx.shared.shaderObjects.push(program_obj);

		program_obj.driverObj = ctx.driver.createProgram(ctx);

		return name;
	};
	

	/**
	 * glCreateShader - Creates a shader object
	 *
	 * @var GLenum  shaderType  Specifies the type of shader to be created.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glCreateShader.xml
	 */
	cnvgl.createShader = function(shaderType) {
		var ctx, shader_obj, name;

		ctx = cnvgl.getCurrentContext();

		if (shaderType != cnvgl.FRAGMENT_SHADER && shaderType != cnvgl.VERTEX_SHADER) {
			cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
			return 0;
		}

		name = ctx.shared.shaderObjects.length;
	
		shader_obj = new cnvgl.shader(name, shaderType);	
		ctx.shared.shaderObjects.push(shader_obj);

		shader_obj.driverObj = ctx.driver.createShader(ctx, shaderType);

		return shader_obj.name;
	};


	/**
	 * glGetProgramiv — Returns a parameter from a program object
	 *
	 * @var GLuint   program  Specifies the program object to be queried.
	 * @var GLenum   pname    Specifies the object parameter.
	 * @var [GLint]  program  Returns the requested object parameter.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGetProgram.xml
	 */	
	cnvgl.getProgramiv = function(program, pname, params) {
		var ctx, program_obj, t, i;
	
		//get program
		ctx = cnvgl.getCurrentContext();
		program_obj = ctx.shared.shaderObjects[program];
	
		//no shader exists
		if (!program_obj) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		//object is not a program (BAD!)
		if (!program_obj instanceof cnvgl.program) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}	
	
		switch (pname) {
	
			case cnvgl.DELETE_STATUS:
				params[0] = program_obj.delete_status ? cnvgl.TRUE : cnvgl.FALSE;
				break;
			
			case cnvgl.LINK_STATUS:
				params[0] = program_obj.link_status;
				break;
			
			case cnvgl.VALIDATE_STATUS:
				params[0] = program_obj.validate_status ? cnvgl.TRUE : cnvgl.FALSE;
				break;
			
			case cnvgl.INFO_LOG_LENGTH:
				params[0] = program_obj.information_log.length;
				break;
	
			case cnvgl.ATTACHED_SHADERS:
				params[0] = program_obj.attached_shaders.length;
				break;
			
			case cnvgl.ACTIVE_ATTRIBUTES:
				params[0] = program_obj.attributes.active.length;
				break;
	
			case cnvgl.ACTIVE_ATTRIBUTE_MAX_LENGTH:
				params[0] = 0;
				for (i in program_obj.attributes.names) {
					params[0] = Math.max(params[0], i.length);
				}
				break;
	
			case cnvgl.ACTIVE_UNIFORMS:
				params[0] = program_obj.uniforms.active.length;
				break;
	
			case cnvgl.ACTIVE_UNIFORM_MAX_LENGTH:
				params[0] = 0;
				for (i in program_obj.uniforms.names) {
					params[0] = Math.max(params[0], i.length);					
				}
				break;
	
			default:
				cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
				return;
		}
	};


	/**
	 * glGetShaderInfoLog — Returns the information log for a shader object
	 *
	 * @var GLuint     shader     Specifies the shader object whose information log is to be queried.
	 * @var GLsizei    maxLength  Specifies the size of the character buffer for storing the returned information log.
	 * @var [GLsizei]  length     Returns the length of the string returned in infoLog (excluding the null terminator).
	 * @var [String]   infoLog    Specifies an array of characters that is used to return the information log.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glCreateShader.xml
	 */
	cnvgl.getShaderInfoLog = function(shader, maxLength, length, infoLog) {
		var ctx, shader_obj;

		//get shader
		ctx = cnvgl.getCurrentContext();
		shader_obj = ctx.shared.shaderObjects[shader];
		
		//no shader exists
		if (!shader_obj) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		//object is not a shader (BAD!)
		if (!shader_obj instanceof cnvgl.shader) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}
	
		if (maxLength < 0) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		var log = shader_obj.information_log;
		
		if (maxLength && maxLength < log.length) {
			log = log.substring(0, maxLength);
		}
	
		length[0] = log.length;
		infoLog[0] = log;
	};


	/**
	 * glGetShaderiv — Returns a parameter from a shader object
	 *
	 * @var GLuint   shader  Specifies the shader object to be queried.
	 * @var GLenum   pname   Specifies the object parameter.
	 * @var [GLint]  params  Returns the requested object parameter.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glGetShader.xml
	 */
	cnvgl.getShaderiv = function(shader, pname, params) {
		var ctx, shader_obj;
		
		//get shader
		ctx = cnvgl.getCurrentContext();
		shader_obj = ctx.shared.shaderObjects[shader];
	
		//no shader exists
		if (!shader_obj) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		//object is not a shader (BAD!)
		if (!shader_obj instanceof cnvgl.shader) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}	
	
		switch (pname) {
			case cnvgl.SHADER_TYPE:
				params[0] = shader_obj.type;
				break;
			case cnvgl.DELETE_STATUS:
				params[0] = shader_obj.delete_status ? cnvgl.TRUE : cnvgl.FALSE;
				break;
			case cnvgl.COMPILE_STATUS:
				params[0] = shader_obj.compile_status ? cnvgl.TRUE : cnvgl.FALSE;
				break;
			case cnvgl.INFO_LOG_LENGTH:
				params[0] = shader_obj.information_log.length;
				break;
			case cnvgl.SHADER_SOURCE_LENGTH:
				params[0] = shader_obj.shader_string.length;
				break;
			default:
				cnvgl.throw_error(cnvgl.INVALID_ENUM, ctx);
				return;
		}
	};


	/**
	 * glLinkProgram — Links a program object
	 *
	 * @var GLuint  program  Specifies the handle of the program object to be linked.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glLinkProgram.xml
	 */
	cnvgl.linkProgram = function(program) {
		var ctx, program_obj, i, shaders, attrib, unif, attrib_obj, uniform_obj;
	
		//get program
		ctx = cnvgl.getCurrentContext();
		program_obj = ctx.shared.shaderObjects[program];
	
		//no program exists
		if (!program_obj) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}

		//object is not a program
		if (!program_obj instanceof cnvgl.program) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}

		shaders = [];
		for (i = 0; i < program_obj.attached_shaders.length; i++) {
			shaders.push(program_obj.attached_shaders[i].driverObj);
		}

		ctx.driver.link(ctx, program_obj.driverObj, shaders);
		program_obj.link_status = ctx.driver.linkStatus;
		program_obj.information_log = ctx.driver.linkErrors;

		if (program_obj.link_status) {

			for (i = 0; i < program_obj.driverObj.attributes.length; i++) {
				attrib = program_obj.driverObj.attributes[i];
				attrib_obj = new cnvgl.program_var(attrib.name, attrib.type, attrib.location, attrib.slots, attrib.components);
				program_obj.addActiveAttribute(attrib_obj);
			}

			for (i = 0; i < program_obj.driverObj.uniforms.length; i++) {
				unif = program_obj.driverObj.uniforms[i];
				uniform_obj = new cnvgl.program_var(unif.name, unif.type, unif.location, unif.slots, unif.components);
				program_obj.addActiveUniform(uniform_obj);
			}	
		}

	};


	/**
	 * glShaderSource — Replaces the source code in a shader object
	 *
	 * @var GLuint    shader  Specifies the handle of the shader object whose source code is to be replaced.
	 * @var GLsizei   count   Specifies the number of elements in the string and length arrays.
	 * @var [String]  string  Specifies an array of pointers to strings containing the source code to be loaded into the shader.
	 * @var [GLint]   length  Specifies an array of string lengths.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glShaderSource.xml
	 */
	cnvgl.shaderSource = function(shader, count, string, length) {
		var ctx, shader_obj;
	
		ctx = cnvgl.getCurrentContext();
		shader_obj = ctx.shared.shaderObjects[shader];
	
		//no shader exists
		if (!shader_obj) {
			cnvgl.throw_error(cnvgl.INVALID_VALUE, ctx);
			return;
		}
	
		//object is not a shader (BAD!)
		if (!shader_obj instanceof cnvgl.shader) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
			return;
		}

		shader_obj.shader_string = string.join();
	};


	/**
	 * glUseProgram — Installs a program object as part of current rendering state
	 *
	 * @var GLuint  program  Specifies the handle of the program object whose executables are to be used as part of current rendering state.
	 *
	 * Notes: See http://www.opengl.org/sdk/docs/man/xhtml/glUseProgram.xml
	 */
	cnvgl.useProgram = function(program) {
		var ctx, program_obj, i, shader_obj;
	
		ctx = cnvgl.getCurrentContext();
	
		if (program == 0) {
			ctx.shader.activeProgram = null;
			ctx.driver.useProgram(ctx, 0);
			return;
		}
	
		//get program
		program_obj = ctx.shared.shaderObjects[program];
	
		//no program exists
		if (!program_obj) {
			cnvgl.throw_error(cnvgl.INVALID_OPERATION, ctx);
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

		ctx.shader.activeProgram = program_obj;	
		
		ctx.driver.useProgram(ctx, program_obj.driverObj);
	};


}(cnvgl));


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

	
	cnvgl.program = (function() {
	
		function var_set() {
			this.bound = {};
			this.active = [];
			this.names = {};
		}
	
		function Initializer() {
			this.name = 0;
			this.attached_shaders = [];
	
			//link status
			this.delete_status = 0;
			this.link_status = 0;
			this.validate_status = 0;
			this.information_log = "";
	
			//variable information
			this.uniforms = null;
			this.attributes = null;
			this.varying = null;

			this.program = null;
		}
	
		var cnvgl_program = jClass('cnvgl_program', Initializer);
	
		cnvgl_program.cnvgl_program = function() {
			this.reset();
		};
	
		cnvgl_program.reset = function() {
			var bound_attr;
	
			this.delete_status = 0;
			this.link_status = 0;
			this.validate_status = 0;
			this.information_log = "";
	
			bound_attr = this.attributes ? this.attributes.bound : {};
	
			this.uniforms = new var_set();
			this.attributes = new var_set();
			this.varying = new var_set();
	
			this.attributes.bound = bound_attr;
		};
	
		cnvgl_program.getOpenSlot = function(set) {
			//active should be in order
			if (set.active.length == 0) {
				return 0;	
			}
			last = set.active[set.active.length - 1];
			return last.location + last.slots;
		};

		cnvgl_program.addActiveAttribute = function(attr) {
			this.attributes.active.push(attr);
			this.attributes.names[attr.name] = attr;
		};

		cnvgl_program.addActiveUniform = function(uniform) {
			this.uniforms.active.push(uniform);
			this.uniforms.names[uniform.name] = uniform;
		};

		cnvgl_program.addActiveVarying = function(varying) {
			this.varying.active.push(varying);
			this.varying.names[varying.name] = varying;
		};

		cnvgl_program.getActiveAttribute = function(name) {
			return this.attributes.names[name];
		};
	
		cnvgl_program.getActiveUniform = function(name) {
			return this.uniforms.names[name];
		};
	
		cnvgl_program.getActiveVarying = function(name) {
			return this.varying.names[name];
		};
	
		return cnvgl_program.Constructor;
	
	}());
	

	cnvgl.program_var = function(name, type, location, slots, components) {
		this.name = name;
		this.type = type;
		this.location = location;
		this.slots = slots;
		this.components = components;
		this.basetype = cnvgl.FLOAT;
		this.value = [0,0,0,0];
	};
	

}(cnvgl));


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


if (typeof pClass == 'undefined') {
	function pClass(_className) {

		this._className = _className;

		this.construct = function() {
			if (this[this._className] && typeof this[this._className] == 'function') {
				this[this._className].apply(this, arguments);
			}
		}

		this.extend = function(className) {
			this._className = className;
			return this;
		}

		this.instanceOf = function(type) {
			if (type) {
				return (this._className == type);
			}
			return this._className;
		}

		this.enumerate = function(enm, obj) {
			enm = enm ? enm : this.enums;
			if (!enm) {
				return;
			}
			if (!obj) {
				var obj = window[this._className];
			}
			if (obj) {
				for (var i in enm) {
					obj[i] = enm[i];
				}
			}
		}

		var overloaded = {};

		this.overload = function(name, fn, types) {

			var callOverloadedFn = function() {
				var def = name+'.'+arguments.length;
				if (!overloaded[def]) {
					for (var i = 0; i < arguments.length; i++) {
						var d = arguments[i];
						if (typeof d == 'object' && d.instanceOf) {
							def	+= '.'+d.instanceOf();
						} else {
							def += '.'+typeof d;	
						}
					}
				}
				if (!overloaded[def]) {
					throw new Error('Function does not exist');	
				}
				overloaded[def].apply(this, arguments);
			};


			var def = name+'.'+fn.length;
			if (types) {
				for (var i = 0; i < types.length; i++) {
					def += '.' + types[i];	
				}
			}
			overloaded[def] = fn;
			this[name] = callOverloadedFn;
		}
	};
}


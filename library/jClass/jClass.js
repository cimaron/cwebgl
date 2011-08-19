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


function jClass(name, Initializer, Extends) {

	function ExtCons(){}
	function ProtoCons(){}
	function Constructor() {
		if (this.Initializer) {
			this.Initializer.apply(this);
		}
		if (this[this.TypeOf]) {
			this[this.TypeOf].apply(this, arguments);
		}
	}

	if (Extends) {
		ExtCons.prototype = Extends.prototype;
	}

	var my_proto = new ExtCons();
	ProtoCons.prototype = my_proto;
	Constructor.prototype = new ProtoCons();

	if (Initializer) {
		//for extending class
		Constructor.Initializer = Initializer;
		//for Constructor
		my_proto.Initializer = Initializer;
	}

	my_proto.Constructor = Constructor;
	my_proto.TypeOf = name;
	my_proto.typeOf = jClass.typeOf;
	my_proto.Enumerate = jClass.Enumerate;

	return my_proto;
}

jClass.typeOf = function(name) {
	if (name) {
		return this.TypeOf == name;
	}
	return this.TypeOf;
};

jClass.Enumerate = function(obj) {
	var i;
	for (i in obj) {
		this[i] = obj[i];	
	}
};


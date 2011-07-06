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


//----------------------------------------------------------------------------------------
//	class ShaderCompilerAst
//----------------------------------------------------------------------------------------

function ShaderCompilerAst() {
	this.construct();
}

//----------------------------------------------------------------------------------------
//	Class Magic
//----------------------------------------------------------------------------------------

__ShaderCompilerAst = new pClass('ShaderCompilerAst');
ShaderCompilerAst.prototype = __ShaderCompilerAst;

__ShaderCompilerAst.ast_node = function() {

	var node = {
		token : null,
		symbol : null,
		left : null,
		right : null,
		next : null,
		attributes : {}
	};
	
	return node;
}


//----------------------------------------------------------------------------------------
//	Methods
//----------------------------------------------------------------------------------------

__ShaderCompilerAst.ShaderCompilerAst = function() {
}


__ShaderCompilerAst.node = function(token) {
	if (typeof token == 'object') {
		return token;	
	}
	var node = new this.ast_node();
	node.token = token;
	return node;
}

__ShaderCompilerAst.adopt = function(node, left, right) {
	node = this.node(node);
	left = this.node(left);
	right = this.node(right);
	node.left = left;
	node.right = right;
	return node;
}

__ShaderCompilerAst.adoptLeft = function(node, left) {
	node = this.node(node);
	left = this.node(left);
	node.left = left;
	return node;
}

__ShaderCompilerAst.adoptRight = function(node, right) {
	node = this.node(node);
	right = this.node(right);
	node.right = right;
	return node;
}

__ShaderCompilerAst.adoptSibl = function(node, sibl) {
	node = this.node(node);
	sibl = this.node(sibl);
	var c = node;
	while (c.next) {
		c = c.next;
	}
	c.next = sibl;
	return node;
}

__ShaderCompilerAst.morph = function(node, target) {
	node = this.node(node);
	target = this.node(target);
	node.left = target.left;
	node.right = target.right;
	return node;
}

__ShaderCompilerAst.adoptMulti = function(node, child) {
	node = this.node(node);
	child = this.node(child);
	if (!node.left) {
		node.left = child;
		return node;
	}
	this.adoptSibl(node.left, child);
	return node;
}


__ShaderCompilerAst.render = function(tree, el) {
	var data = this.renderTree(tree);
	var cnv = document.createElement('canvas');
	cnv.width = data.width;
	cnv.height = data.height;
	var ctx = cnv.getContext('2d');
	ctx.putImageData(data.data, 0, 0);

	var div = document.createElement('div');
	div.style.backgroundColor = '#FAFAFA';
	div.style.marginBottom = '100px';
	(el ? el : document.body).appendChild(div);
	div.appendChild(cnv);
}

__ShaderCompilerAst.renderTree = function(node) {

	if (!node) {
		return;	
	}

	var ctx = this.renderContext(0, 0);

	//base node dimensions
	var dims = {};
	dims.width = ctx.measureText(node.token).width + 20;
	dims.node_width = dims.width;
	dims.node_left = 0;
	dims.height = 30;
	dims.data = this.renderNode(node.token, dims.width, dims.height);
	
	var left = this.renderTree(node.left);
	var right = this.renderTree(node.right);
	var next = this.renderTree(node.next);

	//case 1 left only
	if (left && !right) {
		//resize
		dims.height = dims.height + left.height + 10;
		if (left.width > dims.width) {
			dims.width = left.width;	
		} else {
			left.node_left = (dims.width - left.width) / 2;	
		}
		dims.node_left = (dims.width - dims.node_width) / 2;
	}

	if (left && right) {
		//resize
		dims.height = dims.height + 10 + Math.max(left.height, right.height);
		var nwidth = left.width + 10 + right.width;
		if (nwidth > dims.width) {
			dims.width = nwidth;
		}
		right.node_left = left.width + 10;

		dims.node_left = (dims.width - dims.node_width) / 2;
	}
	
	if (next) {
		next.node_left += dims.width + 10;
		dims.width += next.width + 10;
		dims.height = Math.max(dims.height, next.height);
	}

	ctx = this.renderContext(dims.width, dims.height);
	ctx.putImageData(dims.data, dims.node_left, 0);

	if (left) {
		ctx.putImageData(left.data, left.node_left, 40);
		this.renderLine(ctx, dims.node_left + dims.node_width / 2, 30, (left.node_left + left.node_width / 2), 40);		
	}

	if (right) {
		ctx.putImageData(right.data, right.node_left, 40);
		this.renderLine(ctx, dims.node_left + dims.node_width / 2, 30, (right.node_left + right.node_width / 2), 40);		
	}
	
	if (next) {
		ctx.putImageData(next.data, next.node_left, 0);
		this.renderLine(ctx, dims.node_left + dims.node_width, 15, next.node_left, 15);				
	}

	dims.data = ctx.getImageData(0, 0, dims.width, dims.height);

	return dims;
}

__ShaderCompilerAst.renderContext = function(width, height) {
	var cnv = document.createElement('canvas');
	cnv.width = width;
	cnv.height = height;
	ctx = cnv.getContext('2d');
	return ctx;
}

__ShaderCompilerAst.renderLine = function(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

__ShaderCompilerAst.renderNode = function(text, width, height) {
	var ctx = this.renderContext(width, height);
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = '#000000';
	ctx.fillText(text, 10, 20);
	ctx.strokeRect(0, 0, width, height);
	//document.body.appendChild(cnv);
	return ctx.getImageData(0, 0, width, height);		
}


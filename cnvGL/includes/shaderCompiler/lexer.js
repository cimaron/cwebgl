
/*
function __glCompileShaderLexer() {

	this.tokens = {
		'INT'		: new RegExp('^[0-9]'),
		'NUMBER'	: new RegExp('^[0-9]?\.[0-9]+'),
		'ID'		: new RegExp('^[a-z_][a-z0-9_]*', 'i'),
		'('			: new RegExp('^\\('),
		')'			: new RegExp('^\\)'),
		'='			: new RegExp('^='),
		'*'			: new RegExp('^\\*'),
		','			: new RegExp('^,'),
	};


	this.originalSource = '';
	this.source = '';
	this.position = 0;
	this.line = 0;

	this.compile = function(source, type) {

		if (type == gl.VERTEX_SHADER) {
			return defaultVertex();	
		} else {
			return defaultFragment();
		}
		
		//----------------------
		this.source = source;
		this.originalSource = source;
		
		this._preprocess();
		
		while (token = this._nextToken()) {
			this._parseToken(token);
		}
	};

	this.nextToken = function() {

		//newline position
		var endline = this.source.indexOf("\n", this.position);

		//eof
		if (this.position == this.source.length) {
			return false;	
		}

		//gobble up whitespace
		while (this.source.substring(this.position, this.position + 1).match(/\s/)) {
			if (this.position == endline) {
				endline = this.source.indexOf("\n", this.position + 1);
				this.line++;
			}
			this.position++;
		}

		//restrict token grabbing from current line (possibly improves performance, don't know)
		var line = this.source.substring(this.position, endline);

		var token = false, m = false;
		for (var i in this.tokens) {
			if (m = this.tokens[i].exec(line)) {
				token = { token : i, content : m[0] };
			}
		}
		if (!token) {
			throw "Syntax error at line " + this.line;
		}
		this.position += m.length;
		return token;
	}
}



function __glCompileShaderParser() {

	this.rules = {
		'program'		:	{"program decl " : '',
							 "program ;" : "",
							 "program profunc " : '',
							 'execute=' : function(a, b) {
							  	return { root : a, left : b};
							  }
							},

		//declarations
		'decl'			:	{"type declobj " : ''},
		'declobj'		:	{"object " : ''},
		'object'		:	{"{ID}" : ''},
		//nonterminals
		'type'			:	{}
	};

	this.parse = function() {
		
	}
};


*/
var preprocessor = (function() {

	var preprocessor = {

		process : function(source) {
			//pretty basic, just want to make it work for right now
			source = source.replace(/[ \t]*\#[^\n]+/g, '');
			return source;
		}
	
	};

	return preprocessor;
})();
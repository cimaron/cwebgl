<?php
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

global $debug, $operations, $types, $base_types, $operation_table;
if (!$_SERVER['argv'] && $debug) {
	header('Content-Type: text/javascript');
}

$operations = array(
	"assign",
	"plus", "neg", "add", "sub", "mul", "div", "mod", "lshift", "rshift", "less", "greater",
	"lequal", "gequal", "equal", "nequal", "bit_and", "bit_xor", "bit_or", "bit_not", "logic_and",
	"logic_xor", "logic_or", "logic_not", "mul_assign", "div_assign", "mod_assign", "add_assign",
	"sub_assign", "ls_assign", "rs_assign", "and_assign", "xor_assign", "or_assign", "conditional",
	"pre_inc", "pre_dec", "post_inc", "post_dec", "field_selection", "array_index", "function_call",
	"identifier", "int_constant", "uint_constant", "float_constant", "bool_constant", "sequence",
	"constructor"
);

$types = array(
	"'void'",
	"float", "int", "uint", "bool",
	"vec2", "vec3", "vec4",
	"bvec2", "bvec3", "bvec4",
	"ivec2", "ivec3", "ivec4",
	"uvec2", "uvec3", "uvec4",
	"mat2", "mat2x3", "mat2x4",
	"mat3x2", "mat3", "mat3x4",
	"mat4x2", "mat4x3",	"mat4",
	"sampler1D", "sampler2D", "sampler2Drect", "sampler3D", "samplercube",
	"sampler1Dshadow", "sampler2Dshadow", "sampler2Drectshadow", "samplercubeshadow",
	"sampler1Darray", "sampler2Darray", "sampler1Darrayshadow", "sampler2Darrayshadow",
	"isampler1D", "isampler2D", "isampler3D", "isamplercube", "isampler1Darray", "isampler2Darray",
	"usampler1D", "usampler2D", "usampler3D", "usamplercube", "usampler1Darray", "usampler2Darray",
	"struct", "type_name"
);

$base_types = array(
	NULL,
	"float", "int", "uint", "bool",
	"float", "float", "float",
	"bool", "bool", "bool",
	"int", "int", "int",
	"uint", "uint", "uint",
	"float", "float", "float",
	"float", "float", "float",
	"float", "float", "float",
);
foreach ($base_types as $i => $base_name) {
	$base_types[$i] = array_search($base_name, $types);
}


$operation_table = array();
function addOperation($op_name, $type_names, $obj) {
	global $operation_table, $operations, $types;
	$op = array_search($op_name, $operations);

	if (!isset($operation_table[$op])) {
		$operation_table[$op] = array();
	}
	$t = &$operation_table[$op];

	//get entry by definition
	foreach ($type_names as $type_name) {
		$type = array_search($type_name, $types);
		if (!isset($t[$type])) {
			$t[$type] = array();
		}
		$t = &$t[$type];
	}

	$obj['type'] = array_search($obj['type'], $types);
	$t = $obj;
}

function addFunction($func_name, $def_in, $obj) {
	global $operation_table, $operations, $types;
	$op = array_search('function_call', $operations);

	//get function_call operation entries
	if (!isset($operation_table[$op])) {
		$operation_table[$op] = array();
	}
	$t = &$operation_table[$op];

	//get function entries
	if (!isset($t[$func_name])) {
		$t[$func_name] = array();
	}
	$t = &$t[$func_name];

	//get entry by definition
	foreach ($def_in as $type_name) {
		$type = array_search($type_name, $types);
		if (!isset($t[$type])) {
			$t[$type] = array();
		}
		$t = &$t[$type];
	}

	$obj['type'] = array_search($obj['type'], $types);

	$t[0] = $obj;
}

addOperation('logic_not', array('bool'), array(
	'type' => 'bool',
	'code' => array(
		"ABS %1.x %2.x",
		"SGE %1.x 0.0 %1.x"
	)
));

addOperation('add', array('vec3', 'vec3'), array(
	'type' => 'vec3',
	'code' => array(
		"ADD %1.xyz %2.xyz %3.xyz"
	)
));

addOperation('add', array('vec4', 'vec4'), array(
	'type' => 'vec4',
	'code' => array(
		"ADD %1 %2 %3"
	)
));

addOperation('less', array('float', 'float'), array(
	'type' => 'float',
	'code' => array(
		"SLT %1.x %2.x %3.x"
	)
));


addOperation('mul', array('float', 'float'), array(
	'type' => 'float',
	'code' => array(
		"MUL %1.x %2.x %3.x"
	)
));

addOperation('mul', array('vec3', 'float'), array(
	'type' => 'vec3',
	'code' => array(
		"MUL %1.xyz %2.xyz %3.x"		
	)
));

addOperation('mul', array('vec3', 'vec3'), array(
	'type' => 'vec3',
	'code' => array(
		"MUL %1.xyz %2.xyz %3.xyz"		
	)
));

addOperation('mul', array('vec4', 'vec4'), array(
	'type' => 'vec4',
	'code' => array(
		"MUL %1 %2 %3"
	)
));

addOperation('mul', array('mat3', 'vec3'), array(
	'type' => 'vec3',
	'code' => array(
		"MUL %1.xyz %2[0].xyz %3.x",
		"MAD %1.xyz %2[1].xyz %3.y %1",
		"MAD %1.xyz %2[2].xyz %3.z %1",
	)
));

addOperation('mul', array('mat4', 'vec4'), array(
	'type' => 'vec4',
	'code' => array(
		"MUL %1 %2[0] %3.x",
		"MAD %1 %2[1] %3.y %1",
		"MAD %1 %2[2] %3.z %1",
		"MAD %1 %2[3] %3.w %1",
	)
));

addOperation('mul', array('mat4', 'mat4'), array(
	'type' => 'mat4',
	'code' => array(
		//Row 1
		"MUL %1[0] %2[0] %3[0].x",
		"MAD %1[0] %2[1] %3[0].y %1[0]",
		"MAD %1[0] %2[2] %3[0].z %1[0]",
		"MAD %1[0] %2[3] %3[0].w %1[0]",
		//Row 2
		"MUL %1[1] %2[0] %3[1].x",
		"MAD %1[1] %2[1] %3[1].y %1[1]",
		"MAD %1[1] %2[2] %3[1].z %1[1]",
		"MAD %1[1] %2[3] %3[1].w %1[1]",
		//Row 3
		"MUL %1[2] %2[0] %3[2].x",
		"MAD %1[2] %2[1] %3[2].y %1[2]",
		"MAD %1[2] %2[2] %3[2].z %1[2]",
		"MAD %1[2] %2[3] %3[2].w %1[2]",
		//Row 4
		"MUL %1[3] %2[0] %3[3].x",
		"MAD %1[3] %2[1] %3[3].y %1[3]",
		"MAD %1[3] %2[2] %3[3].z %1[3]",
		"MAD %1[3] %2[3] %3[3].w %1[3]",
	)
));

addOperation('sub', array('vec4', 'vec4'), array(
	'type' => 'vec4',
	'code' => array(
		"SUB %1 %2 %3"
	)
));

addOperation('sub', array('vec3', 'vec3'), array(
	'type' => 'vec3',
	'code' => array(
		"SUB %1.xyz %2.xyz %3.xyz"
	)
));

addFunction('dot', array('vec3', 'vec3'), array(
	'type' => 'float',
	'code' => array(
		'DP3 %1 %2 %3'
	)
));

addFunction('dot', array('vec4', 'vec4'), array(
	'type' => 'float',
	'code' => array(
		'DP4 %1 %2 %3'
	)
));

addFunction('max', array('float', 'float'), array(
	'type' => 'float',
	'code' => array(
		'MAX %1.x %2.x %3.x'
	)
));

addFunction('normalize', array('vec3'), array(
	'type' => 'vec3',
	'code' => array(
		'DP3 %1.x %2 %2',
		'RSQ %1.x %1.x',
		'MUL %1.xyz %2.xyz %1.x'
	)
));

addFunction('normalize', array('vec4'), array(
	'type' => 'vec4',
	'code' => array(
		'DP4 %1.x %2 %2',
		'RSQ %1.x %1.x',
		'MUL %1 %2 %1.x'
	)
));

addFunction('pow', array('float', 'float'), array(
	'type' => 'float',
	'code' => array(
		'POW %1.x %2.x %3.x'
	)
));

addFunction('reflect', array('vec3', 'vec3'), array(
	'type' => 'vec3',
	'code' => array(
		'DP3 %1.x %3 %2',
		'MUL %1.xyz %3 %1.x',
		'MAD %1.xyz -%1 2.0 %2'
	)
));

addFunction('texture2D', array('sampler2D', 'vec2'), array(
	'type' => 'vec4',
	'code' => array(
		'TEX %1 %3 %2 2D'
	)
));



?>
(function(glsl) {
	
	glsl.ir_operation_table = <? echo json_encode($operation_table); ?>;
	glsl.type.base = <? echo json_encode($base_types); ?>;
	
	function function_by_path(state, func, table, path) {
		var t, entry;
		for (t in table) {
			t = parseInt(t);
			if (t == 0) {
				entry = state.symbols.add_function(func, table[t].type, path.slice(0));
				entry.code = table[t].code;
			} else {
				path.push(parseInt(t));
				function_by_path(state, func, table[t], path);
				path.pop();
			}
		}
	}

	glsl.parser.initialize_functions = function(state) {
		var table, f, path, t;
		table = glsl.ir_operation_table[glsl.ast.operators.function_call];
		for (f in table) {
			function_by_path(state, f, table[f], []);
		}
	};

}(glsl));

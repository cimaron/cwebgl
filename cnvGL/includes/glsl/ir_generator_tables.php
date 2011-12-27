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

global $debug;
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
	"'void'", "float", "int", "uint", "bool",
	"vec2", "vec3", "vec4", "bvec2", "bvec3",
	"bvec4", "ivec2", "ivec3", "ivec4", "uvec2",
	"uvec3", "uvec4", "mat2", "mat2x3", "mat2x4",
	"mat3x2", "mat3", "mat3x4", "mat4x2", "mat4x3",
	"mat4", "sampler1D", "sampler2D", "sampler2Drect", "sampler3D",
	"samplercube", "sampler1Dshadow", "sampler2Dshadow", "sampler2Drectshadow", "samplercubeshadow",
	"sampler1Darray", "sampler2Darray", "sampler1Darrayshadow", "sampler2Darrayshadow", "isampler1D",
	"isampler2D", "isampler3D", "isamplercube", "isampler1Darray", "isampler2Darray",
	"usampler1D", "usampler2D", "usampler3D", "usamplercube", "usampler1Darray",
	"usampler2Darray", "struct", "type_name"
);


$operation_table = array();
function addOperation($op_name, $type1_name, $type2_name, $obj) {
	global $operation_table, $operations, $types;
	$op = array_search($op_name, $operations);
	$type1 = array_search($type1_name, $types);
	$type2 = array_search($type2_name, $types);

	if (!isset($operation_table[$op])) {
		$operation_table[$op] = array();
	}
	if (!isset($operation_table[$op][$type1])) {
		$operation_table[$op][$type1] = array();
	}

	$obj['type'] = array_search($obj['type'], $types);
	$operation_table[$op][$type1][$type2] = $obj;
}


addOperation('mul', 'mat4', 'vec4', array(
	'type' => 'vec4',
	'code' => array(
		"TEMP %4",
		"MUL %1 %2[0] %3.x",
		"MUL %4 %2[1] %3.y",
		"ADD %1 %1 %4",
		"MUL %4 %2[2] %3.z",
		"ADD %1 %1 %4",
		"MUL %4 %2[3] %3.w",
		"ADD %1 %1 %4",
	)
));

addOperation('mul', 'mat4', 'mat4', array(
	'type' => 'mat4',
	'code' => array(
		"TEMP %4",
		//Row 1
		"MUL %1[0] %2[0] %3[0].x",
		"MUL %4 %2[1] %3[0].y",
		"ADD %1[0] %1[0] %4",
		"MUL %4 %2[2] %3[0].z",
		"ADD %1[0] %1[0] %4",
		"MUL %4 %2[3] %3[0].w",
		"ADD %1[0] %1[0] %4",
		//Row 2
		"MUL %1[1] %2[0] %3[1].x",
		"MUL %4 %2[1] %3[1].y",
		"ADD %1[1] %1[1] %4",
		"MUL %4 %2[2] %3[1].z",
		"ADD %1[1] %1[1] %4",
		"MUL %4 %2[3] %3[1].w",
		"ADD %1[1] %1[1] %4",
		//Row 3
		"MUL %1[2] %2[0] %3[2].x",
		"MUL %4 %2[1] %3[2].y",
		"ADD %1[2] %1[2] %4",
		"MUL %4 %2[2] %3[2].z",
		"ADD %1[2] %1[2] %4",
		"MUL %4 %2[3] %3[2].w",
		"ADD %1[2] %1[2] %4",
		//Row 4
		"MUL %1[3] %2[0] %3[3].x",
		"MUL %4 %2[1] %3[3].y",
		"ADD %1[3] %1[3] %4",
		"MUL %4 %2[2] %3[3].z",
		"ADD %1[3] %1[3] %4",
		"MUL %4 %2[3] %3[3].w",
		"ADD %1[3] %1[3] %4",
	)
));


?>
(function(glsl) {
	glsl.ir_operation_table = <? echo json_encode($operation_table); ?>;
}(glsl));

<?php

$rules = "
add				vec3	vec3		: vec3	vec3.add(%s,%s,[])
mul				float	float		: float	%s * %s
mul				vec3	float		: vec3	vec3.scale(%s,%s,[])
mul				vec3	vec3		: vec3	vec3.multiply(%s,%s,[])
mul				vec4	vec4		: vec4	vec4.multiply(%s,%s,[])
mul				mat3	vec3		: vec3	mat3.multiplyVec3(%s,%s,[])
mul				mat4	mat4		: mat4	mat4.multiply(%s,%s,[])
mul				mat4	vec4		: vec4	mat4.multiplyVec4(%s,%s,[])
logic_not		bool				: bool	!(%s)
function_call						: any	%s(%s)
";


$states = array();
$functions = array();

$operations = array(
"assign",
"plus",
"neg",
"add",
"sub",
"mul",
"div",
"mod",
"lshift",
"rshift",
"less",
"greater",
"lequal",
"gequal",
"equal",
"nequal",
"bit_and",
"bit_xor",
"bit_or",
"bit_not",
"logic_and",
"logic_xor",
"logic_or",
"logic_not",
"mul_assign",
"div_assign",
"mod_assign",
"add_assign",
"sub_assign",
"ls_assign",
"rs_assign",
"and_assign",
"xor_assign",
"or_assign",
"conditional",
"pre_inc",
"pre_dec",
"post_inc",
"post_dec",
"field_selection",
"array_index",
"function_call",
"identifier",
"int_constant",
"uint_constant",
"float_constant",
"bool_constant",
"sequence",
"constructor"
);

$types = array(
"'void'",
"float",
"int",
"uint",
"bool",
"vec2",
"vec3",
"vec4",
"bvec2",
"bvec3",
"bvec4",
"ivec2",
"ivec3",
"ivec4",
"uvec2",
"uvec3",
"uvec4",
"mat2",
"mat2x3",
"mat2x4",
"mat3x2",
"mat3",
"mat3x4",
"mat4x2",
"mat4x3",
"mat4",
"sampler1D",
"sampler2D",
"sampler2Drect",
"sampler3D",
"samplercube",
"sampler1Dshadow",
"sampler2Dshadow",
"sampler2Drectshadow",
"samplercubeshadow",
"sampler1Darray",
"sampler2Darray",
"sampler1Darrayshadow",
"sampler2Darrayshadow",
"isampler1D",
"isampler2D",
"isampler3D",
"isamplercube",
"isampler1Darray",
"isampler2Darray",
"usampler1D",
"usampler2D",
"usampler3D",
"usamplercube",
"usampler1Darray",
"usampler2Darray",
"struct",
"type_name");

$rules = trim($rules);
$rules = explode("\n", $rules);

foreach ($rules as $rule) {
	$rule = explode(":", $rule);
	$func = trim(preg_replace('#\s#', ' ', $rule[1]));
	if (!in_array($func, $functions)) {
		$functions[] = $func;
	}
	
	$path = preg_split("#\s+#", trim($rule[0]));
	
	$list = &$states;

	for ($i = 0; $i < count($path); $i++) {
		$token = $path[$i];
		if ($i == 0) {
			$token = array_search($token, $operations);
		} else {
			$token = array_search($token, $types);
		}

		//add a new state
		if (!isset($list[$token])) {
			$list[$token] = array();
		}
		$list = &$list[$token];
	}

	$list = array_search($func, $functions);

}

echo json_encode($states);
echo ";\n\n";
echo json_encode($functions);
echo ";";

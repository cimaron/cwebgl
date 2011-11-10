<?php

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
	"type_name"
);

$operation_rules = "
add				float	float		: float	(%s+%s)
add				vec3	vec3		: vec3	vec3.add(%s,%s)
add				vec4	vec4		: vec4	vec4.add(%s,%s)

sub				float	float		: float	(%s-%s)
sub				vec4	vec4		: vec4	vec4.sub(%s,%s)

mul				float	float		: float	(%s*%s)
mul				vec3	float		: vec3	vec3.scale(%s,%s)
mul				vec3	vec3		: vec3	vec3.multiply(%s,%s)
mul				vec4	vec4		: vec4	vec4.multiply(%s,%s)
mul				mat3	vec3		: vec3	mat3.multiplyVec3(%s,%s)
mul				mat4	vec4		: vec4	mat4.multiplyVec4(%s,%s)
mul				mat4	mat4		: mat4	mat4.multiply(%s,%s)

div				float	float		: float	(%s/%s)

logic_not		bool				: bool	!(%s)

function_call						: any	%s(%s)
";


$linker_functions = "
gl_Position					this.vertex['%s']
gl_FragDepth				this.fragment['%s']
gl_FragColor				this.fragment['%s']

dot(vec3,vec3)				vec3.%s
max(float,float)			Math.%s
reflect(vec2,vec3)			vec2.%s
reflect(vec3,vec3)			vec3.%s
reflect(vec4,vec4)			vec4.%s
normalize(vec2)				vec2.%s
normalize(vec3)				vec3.%s
normalize(vec4)				vec4.%s
sqrt(float)					Math.%s
texture2D(sampler2D,vec2)	this._%s
";


$operation_table = array();
$operation_functions = array();

$operation_rules = explode("\n", $operation_rules);
foreach ($operation_rules as $rule) {
	if (trim($rule) == "") {
		continue;
	}
	$rule = explode(":", $rule);
	$func = trim(preg_replace('#\s#', ' ', $rule[1]));
	if (!in_array($func, $operation_functions)) {
		$operation_functions[] = $func;
	}
	
	$path = preg_split("#\s+#", trim($rule[0]));
	
	$list = &$operation_table;

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

	$list = array_search($func, $operation_functions);
}

$func_table = array();

$linker_functions = explode("\n", $linker_functions);
foreach ($linker_functions as $rule) {
	if (trim($rule) == "") {
		continue;
	}
	
	preg_match('#([a-zA-Z0-9_]+)(?:(\([^\)]+\))?)\s+(.*)#', $rule, $parsed);
	
	$name = $parsed[1];
	$args = $parsed[2];
	$func = $parsed[3];
	
	if (!empty($args)) {
		$args = substr($args, 1, strlen($args) - 2);
		$args = explode(',', $args);
		foreach ($args as $type) {
			$name .= '.' . array_search($type, $types);
		}
	}
	
	$name = "@$name@";
	
	$func_table[$name] = $func;
}


echo "//generator.js:\n";

echo "\tvar g_operation_table = ";
echo json_encode($operation_table);
echo ";\n\n";

echo "\tvar g_operation_functions = ";
echo json_encode($operation_functions);
echo ";\n\n\n";

echo "//linker.js:\n";

echo "\tvar func_table = ";
echo json_encode($func_table);
echo ";\n\n\n";



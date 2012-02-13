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

$debug = isset($_GET['debug']) ? true : false;
$base = dirname($_SERVER['SCRIPT_NAME']);
$basepath = dirname(__FILE__);

function cWebGLInclude($file) {
	static $included = array();
	if (!isset($included[$file])) {
		$included[$file] = true;
		$output = cWebGLIncludeFile($file);
		echo $output;
	}
}

function strip_comments($str) {

	$out = '';
	$state = 0;

	$in_single_line_comment = 1;
	$in_multi_line_comment = 2;
	$in_single_string = 4;
	$in_double_string = 8;

	for ($i = 0; $i < strlen($str); $i++) {

		$c = $str[$i];
		$la = $str[$i + 1];

		//start single string ('...')
		if ($c == "'" && ($state == 0)) {
			$state |= $in_single_string;
			$out .= $c;
			continue;
		}

		//end single string ('...')
		if ($c == "'" && ($state & $in_single_string)) {
			$state ^= $in_single_string;
		}

		//start double string ("...")
		if ($c == '"' && ($state == 0)) {
			$state |= $in_double_string;
			$out .= $c;
			continue;
		}

		//end double string ("...")
		if ($c == '"' && ($state & $in_double_string)) {
			$state ^= $in_double_string;
		}

		//start single-line comment
		if (($c == '/' && $la == '/') && ($state == 0)) {
			$state |= $in_single_line_comment;
		}

		//end single-line comment
		if ($c == "\n" && ($state & $in_single_line_comment)) {
			$state ^= $in_single_line_comment;
		}

		//start multi-line comment
		if (($c == '/' && $la == '*') && ($state == 0)) {
			$state |= $in_multi_line_comment;
		}

		//end multi-line comment
		if (($c == '*' && $la == '/') && ($state & $in_multi_line_comment)) {
			$state ^= $in_multi_line_comment;
			$i++;
			$c = '';
		}

		if (!($state & ($in_single_line_comment | $in_multi_line_comment))) {
			$out .= $c;		
		}
	}

	return $out;
}

function cWebGLIncludeFile($file) {
	global $basepath;
	if (!file_exists($basepath.'/'.$file)) {
		return "throw new Error('Could not load file \'$file\'');";
	}

	ob_start();
	include $basepath.'/'.$file;
	$output = ob_get_clean();
	$output = strip_comments($output);
	$output = preg_replace('#\n\n+#', "\n", $output);

	$output = preg_replace_callback('#include\(\'([^\']+)\'\);#', 'cWebGLIncludeCallback', $output);
	$output = "//file: $file\n$output";
	
	$output = processCnvGLDefines($output);
	
	return $output;
}

function cWebGLIncludeCallback($matches) {
	$output = cWebGLIncludeFile($matches[1]);
	return $output;
}

function cWebGLIncludeDebug($file) {
	static $included = array();
	if (!isset($included[$file])) {
		$included[$file] = true;
		echo "include('$file');\n";
	}
}

function processCnvglDefines($str) {
	static $defines = array();
	
	while (preg_match('#cnvgl\.([A-Z0-9_]+)\s*=\s*(0x)?([0-9A-F]+);\s*\n#', $str, $matches)) {
		$sub = $matches[0];
		$name = $matches[1];
		$hex = !empty($matches[2]);
		$value = $matches[3];
		$defines[$name] = $hex ? base_convert($value, 16, 10) : $value;
		$str = str_replace($sub, "", $str);
	}

	$offset = 0;
	while (preg_match('#cnvgl\.([A-Z0-9_]+)#', $str, $matches, PREG_OFFSET_CAPTURE, $offset)) {
		$sub = $matches[0][0];
		$start = $matches[0][1];
		$name = $matches[1][0];
		$value = $defines[$name];
		if (isset($defines[$name])) {
			$str = substr_replace($str, $value, $start, strlen($sub));
		} else {
			$offset = ($matches[0][1] + strlen($sub));
		}
	}

	return $str;
}

$include = 'cWebGLInclude';

if (!$_SERVER['argv']) {
	header('Content-Type: text/javascript');
}
if ($debug) { ?>
function include(file) {
	document.write('<scr'+'ipt type="text/javascript" src="<?php echo $base; ?>/'+file+'<?php echo ($debug ? '?debug=1' : ''); ?>"></script>');
}
<?php
	$include .= 'Debug';
}


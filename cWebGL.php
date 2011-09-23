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


$debug = (int)$_GET['debug'];
$base = dirname($_SERVER['SCRIPT_NAME']);
$basepath = dirname(__FILE__);

function cWebGLInclude($file) {
	$output = cWebGLIncludeFile($file);
	echo $output;
}

function cWebGLIncludeFile($file) {
	global $basepath;
	if (!file_exists($basepath.'/'.$file)) {
		echo "alert('Could not find \'$file\'');";
		//should we provide an error to the end user?
		continue;
	}

	ob_start();
	include $basepath.'/'.$file;
	$output = ob_get_clean();
	$output = preg_replace('#//.*\n#', "\n", $output);	
	$output = preg_replace('#/\*(.|[\r\n])*?\*/#', '', $output);
	$output = preg_replace('#\n\n+#', "\n", $output);

	$output = preg_replace_callback('#include\(\'([^\']+)\'\);#', 'cWebGLIncludeCallback', $output);
	return $output;
}

function cWebGLIncludeCallback($matches) {
	$output = cWebGLIncludeFile($matches[1]);
	return $output;
}

function cWebGLIncludeDebug($file) {
	global $base;
	echo "include('$file');\n";
}

$include = 'cWebGLInclude';

if (!$_SERVER['argv']) {
	header('Content-Type: text/javascript');
}
if ($debug) { ?>
function include(file) {
	document.write('<scr'+'ipt type="text/javascript" src="<? echo $base; ?>/'+file+'"></script>');
}
<?
	$include .= 'Debug';
}

$include('library/jClass/jClass.js');

$drivers = array('cnvGL', 'Flash', 'WebGL');
$driver = 0;

$include('drivers/'.$drivers[$driver].'/GraphicsContext3D.js');

//cnvGL Library
if ($drivers[$driver] == 'cnvGL') {
	$include('cnvGL/cnvGL.js');
}

//WebGLInclude('WebGLMath.js');
$include('library/TypedArray/TypedArray.js');
$include('WebGL/WebGLObject.js');
$include('WebGL/WebGLBuffer.js');
$include('WebGL/WebGLContextAttributes.js');
$include('WebGL/WebGLFramebuffer.js');
$include('WebGL/WebGLProgram.js');
$include('WebGL/WebGLShader.js');
$include('WebGL/WebGLTexture.js');
$include('WebGL/WebGLRenderbuffer.js');
$include('WebGL/WebGLRenderingContext.js');
$include('WebGL/WebGLUniformLocation.js');
$include('cWebGL.js');


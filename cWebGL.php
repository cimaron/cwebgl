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


$debug = !(int)$_GET['debug'];
$base = dirname($_SERVER['SCRIPT_NAME']);

function cWebGLInclude($file) {
	if (!file_exists($file)) {
		//should we provide an error to the end user?
		return;
	}
	$output = file_get_contents($file);
	$output = preg_replace('#//.*\n#', '', $output);	
	$output = preg_replace('#/\*(.|[\r\n])*?\*/#', '', $output);

	preg_replace_callback('#cWebGLInclude\(([^\)]+)#', 'cWebGLInclude', $output);
	echo $output;
}

function cWebGLIncludeDebug($file) {
	global $base;
	echo "include('$file');\n";
}

$include = 'cWebGLInclude';

header('Content-Type: text/javascript');

if ($debug) {
	?>
function include(file) {
	document.write('<scr'+'ipt type="text/javascript" src="<? echo $base; ?>/'+file+'"></script>');
}
<?
	$include .= 'Debug';
}

$include('library/pClass/pClass.js');
$include('library/jClass/jClass.js');
$include('library/glMatrix/glMatrix.js');
$include('library/glMatrix/constructors.js');
$include('cWebGL.js');

$cnvGL = true;
if ($cnvGL) {
	//CanvasGL Library
	$include('cnvGL/cnvGL.js');
	$include('drivers/cnvGL/GraphicsContext3D.js');
} else {
	//Passthru Driver
	$include('drivers/WebGL/GraphicsContext3D.js');
}

//WebGLInclude('WebGLMath.js');
//WebGLInclude('typedarray.js');

$include('WebGL/WebGLObject.js');

?>
if (typeof Float32Array == 'undefined') {
	<? //$include('WebGL/ArrayBufferView.js'); ?>
	<? //$include('WebGL/TypedArrayBase.js'); ?>
	<? //$include('WebGL/Float32Array.js'); ?>
	<? $include('library/TypedArray/TypedArray.js'); ?>
}
<?

$include('WebGL/WebGLBuffer.js');
$include('WebGL/WebGLFramebuffer.js');
$include('WebGL/WebGLProgram.js');
$include('WebGL/WebGLShader.js');
$include('WebGL/WebGLTexture.js');
$include('WebGL/WebGLRenderbuffer.js');
$include('WebGL/WebGLRenderingContext.js');
$include('WebGL/WebGLUniformLocation.js');


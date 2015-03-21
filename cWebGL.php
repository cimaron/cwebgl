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

require_once dirname(__FILE__).'/include.php';

//Extra Libraries
$include('library/util.js');
$include('library/jClass/jClass.js');
$include('library/stdio/stdio.js');

//cnvGL Library
$include('cnvGL/cnvGL.js');

//GLSL Library
$include('external/glsl2js/glsl.js');

//WebGL Library
$include('WebGL/WebGL.js');

$include('cWebGL.js');

//Drivers
$include('drivers/driver.js');
//$include('drivers/WebGL/WebGL.js');
//$include('drivers/Stage3D/Stage3D.js');
//$include('drivers/cnvGL/cnvGL.js');

$include('build/driver.cnvgl.js');


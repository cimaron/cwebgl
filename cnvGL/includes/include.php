<?php
header('Content-type: text/javascript');

$out = '';

$fh = opendir('includes');
while ($file = readdir($fh)) {
	if ($file[0] != '.') {
		$out .= file_get_contents('includes/'.$file);
	}
}

if ($_REQUEST['source']) {
	echo $out;
	exit;
}

echo "__ShaderLinker.include_code = ";

$out = explode("\n", $out);

for ($i = 0; $i < count($out); $i++) {
	$line = $out[$i];
	echo '"'.str_replace('"', '\"', $line)."\\n\"+\n";
}

echo "'';";

<?php
session_start();

// JSON Format
// header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
// header("Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT"); 
// header("Cache-Control: no-cache, must-revalidate"); 
// header("Pragma: no-cache");
 header("Content-type: application/json");

//Grab the index parameter from the url
$index = (isset($_GET['i'])) ? $_GET['i']  : 0 ;

echo "{";
echo '"times":';
echo "[";
if (isset($_SESSION['var_cache'])){
	$hashtags = unserialize($_SESSION['var_cache']);
	$count = 1;
	$length = count($hashtags[$index]['times']);
	foreach ($hashtags[$index]['times'] as $time => $info) {
		$flotTime = $time*1000;
		echo '['.$flotTime.','.$info['count'].']';
		if ($count < $length) echo ',';
		$count++;
	}
}
echo "]";
echo "}";

?>
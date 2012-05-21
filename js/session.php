<?php 
	session_start();
	$hashtagStruct = json_encode(unserialize($_SESSION['var_cache']));
?>
function setHashtagStruct(){
	hashtagStruct = <?=$hashtagStruct;?>;
}
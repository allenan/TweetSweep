<?php
require('../lib/simple_html_dom.php');
$html = file_get_html($_GET['url']);

echo $html->find('title',0)->innertext;

?>
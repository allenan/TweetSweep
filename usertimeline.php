<?php

date_default_timezone_set('UTC');

require 'lib/tmhOAuth.php';
require 'lib/tmhUtilities.php';
require 'lib/TweetSweep.php';
$tmhOAuth = new tmhOAuth(array());
$tweetSweep = new TweetSweep();


$args = array(
  'screen_name'  => '_andrew_allen_', //$_GET['screen_name'],
);

$results = array();

$tmhOAuth->request(
'GET',
'http://api.twitter.com/1/statuses/user_timeline.json',
$args,
false
);

//echo "Received page {$i}\t{$tmhOAuth->url}" . PHP_EOL;

if ($tmhOAuth->response['code'] == 200) {
$data = json_decode($tmhOAuth->response['response'], true);
//print_r($tmhOAuth->response['response']);
$results = array_merge($results, $data['results']);
} else {
$data = htmlentities($tmhOAuth->response['response']);
echo 'There was an error.' . PHP_EOL;
var_dump($data);
die();
}
$results = file_get_contents('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=_andrew_allen_');
$results = json_decode($results);
echo '<pre>';
print_r($results);
echo '</pre>'

?>
<?php

date_default_timezone_set('UTC');

require '../lib/tmhOAuth.php';
require '../lib/tmhUtilities.php';
require '../lib/TweetSweep.php';
$tmhOAuth = new tmhOAuth(array());
$tweetSweep = new TweetSweep();


$args = array(
  'screen_name'  => '_andrew_allen_', //$_GET['screen_name'],
);


$results = file_get_contents('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=_andrew_allen_');
$results = json_decode($results);
echo '<pre>';
print_r($results);
echo '</pre>'

?>

<table id="user-table" style="width:100%;">
          <tr>
            <td><h4>Tweets</h4></td>
            
          </tr>
          <tr style="border-top:1px solid #e8e8e8; border-bottom:1px solid #e8e8e8;">
            <td><?php echo "<img src='$resp->profile_image_url' />"; ?></td>
            <td><div><?php echo '<strong>'.$resp->name.'</strong>';?></div>I need a tweet to test a twitter app... so here it is</td>
          </tr>


        </table>
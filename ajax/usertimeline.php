<?php

date_default_timezone_set('UTC');

require '../lib/tmhOAuth.php';
require '../lib/tmhUtilities.php';
require '../lib/TweetSweep.php';
$tmhOAuth = new tmhOAuth(array());
$tweetSweep = new TweetSweep();

$tmhOAuth = new tmhOAuth(array(
  'consumer_key'    => 'Fq2XgU0Rje9IXtNxsjQCQ',
  'consumer_secret' => 'HYRIDleqQyizKE2vmwEQcECYIj0jnQY4rS0bSxbQol8',
));

$tmhOAuth->config['user_token']  = $_SESSION['access_token']['oauth_token'];
$tmhOAuth->config['user_secret'] = $_SESSION['access_token']['oauth_token_secret'];

$code = $tmhOAuth->request('GET', $tmhOAuth->url('1/statuses/user_timeline'), array(
  'include_entities' => '1',
  'include_rts'      => '1',
  'screen_name'      => '_andrew_allen_', //$_GET['screen_name'],
  'count'            => 20,
));

if ($code == 200) {
  $timeline = json_decode($tmhOAuth->response['response'], true);
  foreach ($timeline as $tweet) :
    $entified_tweet = tmhUtilities::entify_with_options($tweet);
    $is_retweet = isset($tweet['retweeted_status']);

    $diff = time() - strtotime($tweet['created_at']);
    if ($diff < 60*60)
      $created_at = floor($diff/60) . ' minutes ago';
    elseif ($diff < 60*60*24)
      $created_at = floor($diff/(60*60)) . ' hours ago';
    else
      $created_at = date('d M', strtotime($tweet['created_at']));

    $permalink  = str_replace(
      array(
        '%screen_name%',
        '%id%',
        '%created_at%'
      ),
      array(
        $tweet['user']['screen_name'],
        $tweet['id_str'],
        $created_at,
      ),
      '<a href="https://twitter.com/%screen_name%/%id%">%created_at%</a>'
    );

  ?>
  <div id="<?php echo $tweet['id_str']; ?>" style="margin-bottom: 1em">
    <span>ID: <?php echo $tweet['id_str']; ?></span><br>
    <span>Orig: <?php echo $tweet['text']; ?></span><br>
    <span>Entitied: <?php echo $entified_tweet ?></span><br>
    <small><?php echo $permalink ?><?php if ($is_retweet) : ?>is retweet<?php endif; ?>
    <span>via <?php echo $tweet['source']?></span></small>
  </div>
<?php
  endforeach;
} else {
  tmhUtilities::pr($tmhOAuth->response);
}
?>

<?php

die();

$args = array(
  'screen_name'  => '_andrew_allen_', //$_GET['screen_name'],
);


$results = file_get_contents('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=_andrew_allen_');
$results = json_decode($results);
echo '<pre>';
print_r($results);
echo '</pre>'

?>

<!-- <table id="user-table" style="width:100%;">
          <tr>
            <td><h4>Tweets</h4></td>
            
          </tr>
          <tr style="border-top:1px solid #e8e8e8; border-bottom:1px solid #e8e8e8;">
            <td><?php echo "<img src='$resp->profile_image_url' />"; ?></td>
            <td><div><?php echo '<strong>'.$resp->name.'</strong>';?></div>I need a tweet to test a twitter app... so here it is</td>
          </tr>


        </table> -->
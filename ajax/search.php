<!-- <pre> -->
<?php
  session_start();
  //$_SESSION['var_cache'] = serialize($tweetSweep->hashtagStruct);
  //print_r(unserialize($_SESSION['var_cache']));
  //echo $test[5] = 1;

 ?> 
<!-- </pre> -->


<?php



date_default_timezone_set('UTC');

require '../lib/tmhOAuth.php';
require '../lib/tmhUtilities.php';
require '../lib/TweetSweep.php';
$tmhOAuth = new tmhOAuth(array());
$tweetSweep = new TweetSweep();

$pages = (isset($_GET['pages'])) ? ((int)$_GET['pages'])/100 : 5 ;
//$pages = 12;
//$pages = ((int)$_GET['pages'])/100;
$q = (isset($_GET['q'])) ? $_GET['q'] : "bieber" ;
$args = array(
  'q'        => $q,
  'since_id' => '0',
  'rpp'      => '100',
  'lang'     => 'en',
  'include_entities' => 'true',
);

$results = array();


for ($i=$pages; $i > 0; $i--) {
  $args['page'] = $i;

  $tmhOAuth->request(
    'GET',
    'http://search.twitter.com/search.json',
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
}


foreach ($results as $result) {
  $date = strtotime($result['created_at']);
  $from_user = $result['from_user_id'];
  //$result['text'] = str_replace(PHP_EOL, '', $result['text']);
  //print_r($result);
  //echo "{$result['id_str']}\t{$date}\t{$result['from_user']}\t\t{$result['text']}" . PHP_EOL;
  foreach ($result['entities']['hashtags'] as $hashtag ) {
    if ($hashtag['text'] != '') {
      $tweetSweep->addHashtag($hashtag['text'], $date, $from_user);
      //echo $hashtag['text'];
      //echo '<br/>';
    } 
  }
  foreach ($result['entities']['user_mentions'] as $user_mention) {
    if ($user_mention['screen_name'] != '') {
      $tweetSweep->addUserMention($user_mention['screen_name']);
      //echo $user_mention['screen_name'];
      //echo '<br/>';
    }
  }  
}
$tweetSweep->sortHashtags();
$tweetSweep->sortUserMentions();
?>

<!-- <pre> -->
<?php 
  //session_start();
  $_SESSION['var_cache'] = serialize($tweetSweep->hashtagStruct);
  //print_r($_SESSION);
  //print_r(unserialize($_SESSION['var_cache']));
  //echo $test['hello'] + 1;
  //print_r($tweetSweep->hashtagStruct);
 // print_r($results);
//die();
  ?>
<!-- </pre>  -->

<h1>Results for <?php echo $args['q'];?></h1>
<p>Based on <?php echo $args['rpp']*$pages; ?> recent tweets</p>
<div class="row">
  <div class="span3">
<h2>Top 10 Hashtags</h2>

<table class="table" style="width:290px;">
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th>Hashtag</th>
      <th># Uses</th>
    </tr>
  </thead>
  <tbody>
  <?php $i = 0; ?>
<?php foreach ($tweetSweep->hashtagStruct as $index => $h): ?>
  <tr>
    <td><a class="add-btn" data-content="<?php echo $h['text']; ?>" data-prefix="#" href="#"><img src="img/add.png"/></a></td>
    <td><a class="hashtagInfo" data-toggle="modal" href="#myModal" target="_blank" data-index="<?php echo $index ?>"><?php echo '#'.$h['text']?></a></td>
    <td><?php echo $h['count']?></td>
  </tr>
<?php $i++;?>
<?php if ($i >= 10) break; ?>
<?php endforeach; ?>
</tbody>
</table> 
</div>
<div class="span3">
<h2>Top 10 User Mentions</h2>
<table class="table">
    <thead>
    <tr>
      <th>&nbsp;</th>
      <th>User</th>
      <th># Mentions</th>
    </tr>
  </thead>
  <tbody>
  <?php $i = 0; ?>
<?php foreach ($tweetSweep->userMentionStruct as $h): ?>
  <tr>
    <td><a class="add-btn" data-content="<?php echo $h['screen_name']; ?>" data-prefix="@" href="#"><img src="img/add.png"/></a></td>
    <td><a href="https://twitter.com/#!/<?php echo urlencode($h['screen_name']); ?>" target="_blank"><?php echo '@'.$h['screen_name']?></a></td>
    <td><?php echo $h['count']?></td>
  </tr>
<?php $i++;?>
<?php if ($i >= 10) break; ?>
<?php endforeach; ?>
</tbody>
</table>
</div> 


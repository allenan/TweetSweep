<?php
session_start();

// JSON Format
// header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); 
// header("Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT"); 
// header("Cache-Control: no-cache, must-revalidate"); 
// header("Pragma: no-cache");
 //header("Content-type: application/json");

//Grab the index parameter from the url
$index = (isset($_GET['i'])) ? $_GET['i']  : 0 ;



echo '<pre>';
if (isset($_SESSION['var_cache'])){
	$hashtags = unserialize($_SESSION['var_cache']);
	print_r($hashtags);
}
echo '</pre>';
die();
?>

<table id="user-table" style="width:100%;">
          <tr>
            <td><h4>Tweets</h4></td>
            
          </tr>
  <?php
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
  <!-- <pre> -->
  	<?php //print_r($tweet); ?>
  <!-- </pre> -->
<tr style="border-top:1px solid #e8e8e8; border-bottom:1px solid #e8e8e8;">
	<td>
		<img src="<?php echo $tweet['user']['profile_image_url']; ?>">
	</td>
	<td>
		<div><strong><?php echo $tweet['user']['name']; ?> </strong></div>
		<?php echo $entified_tweet ?><br/>
		<small><?php echo $permalink ?><?php if ($is_retweet) : ?>is retweet<?php endif; ?>
    	<span>via <?php echo $tweet['source']?></span></small>
	</td>
</tr>



<?php
  endforeach;?>
</table>
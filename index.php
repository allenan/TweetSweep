<?php
require_once 'lib/twig/lib/Twig/Autoloader.php';
Twig_Autoloader::register();
$loader = new Twig_Loader_Filesystem('templates');
$twig = new Twig_Environment($loader, array());

include_once 'lib/auth.php';


if (isset($_SESSION['access_token']) ) {
  $template = $twig->loadTemplate('dashboard.phtml');
  $params = array(
      'name' => $resp->name,
      'profile_image_url' => $resp->profile_image_url,
      'tweets_count' => $resp->statuses_count,
      'following_count' => $resp->friends_count,
      'followers_count' => $resp->followers_count
  );
  $template->display($params);
} else {
  $template = $twig->loadTemplate('home.phtml');

  $template->display(array());
}






?>





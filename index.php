<?php
session_start();
require_once 'lib/Twig/lib/Twig/Autoloader.php';
Twig_Autoloader::register();
$loader = new Twig_Loader_Filesystem('templates');
$twig = new Twig_Environment($loader, array());

include_once 'lib/auth.php';

$alphaKey = "a8e2eaebf76d2ecd4dabef2ff136fc87";
$page = (isset($_GET['p'])) ? $_GET['p'] : 'home';
$pw = (isset($_GET['pw'])) ? $_GET['pw'] : '' ;

$root = '/tweetsweep';
$navigation[] = array('page' => 'home', 'href' => $root, 'caption' => 'Home');
$navigation[] = array('page' => 'about', 'href' => $root.'?p=about', 'caption' => 'About');
$navigation[] = array('page' => 'features', 'href' => $root.'?p=features', 'caption' => 'Features');
$navigation[] = array('page' => 'contact', 'href' => $root.'?p=contact', 'caption' => 'Contact');
$vars = array(
  'root' => $root,
  'alpha' => $pw == $alphaKey,
  'page' => $page,
  'navigation' => $navigation,
);

//print_r($_SESSION);
//die();


if ($page != 'home') {
  if (file_exists('templates/'.$page.'.phtml')) {
    $template = $twig->loadTemplate($page.'.phtml');
    $template->display($vars);
  } else {
    //TODO: make this load a 404 file
    $template = $twig->loadTemplate('home.phtml');
    $template->display($vars);
  }
}

elseif (isset($_SESSION['access_token']) ) {
  $template = $twig->loadTemplate('dashboard.phtml');
  $params = array(
      'name' => $resp->name,
      'location' => $resp->location,
      'profile_image_url' => $resp->profile_image_url,
      'tweets_count' => $resp->statuses_count,
      'following_count' => $resp->friends_count,
      'followers_count' => $resp->followers_count
  );
  $template->display(array_merge($params,$vars));
} 

else {
  $template = $twig->loadTemplate('home.phtml');
  $template->display($vars);
}






?>





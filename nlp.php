<?php
require('lib/opencalais.php');
require('lib/content-extract.php');
$oc = new OpenCalais('t7vydt6bxg5m6v2vtc7bk929');
$html = file_get_contents($_GET['url']);
 
$extractor = new ContentExtractor();
$content = $extractor->extract($html);
//echo $content;
//die();
$entities = $oc->getEntities($content);
?>
<ul>
	<?php foreach ($entities as $key => $value): ?>
		<li><?php echo $key;?>
			<ul>
				<?php foreach ($value as $i):?>
					<li><input type="checkbox" data-content="<?php echo $i;?>"/><?php echo $i; ?></li>
				<?php endforeach; ?>
			</ul>
		</li>
		<?php //echo $key; echo '<br/>'; echo $value; echo '<br/>';?>

	<?php endforeach;?>
</ul>
<?php
require('../lib/opencalais.php');
require('../lib/content-extract.php');
$oc = new OpenCalais('t7vydt6bxg5m6v2vtc7bk929');
$content = $_GET['content'];
$threshold = 0.4;

$entities = $oc->getEntities($content);

?>
<ul>
	<?php foreach ($entities as $key => $value): ?>
		<li><?php echo ucfirst(strtolower($key));?>
			<ul>
				<?php foreach ($value as $i):?>
					<li>
						<input type="checkbox"
							<?php echo ($i['relevancy']>=$threshold) ? 'checked="checked"' : "" ; ?>
							data-content="<?php echo $i['name'];?>"
							data-relevancy="<?php echo $i['relevancy'];?>"
							data-count="<?php echo $i['count'];?>"
						/>
						<?php echo $i['name']; ?>
					</li>
				<?php endforeach; ?>
			</ul>
		</li>
		<?php //echo $key; echo '<br/>'; echo $value; echo '<br/>';?>

	<?php endforeach;?>
</ul>
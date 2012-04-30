<?php
session_start();
?>
$().ready(function(){
	//plotTime();
});
function plotTime(){
	d = [];
	<?php if (isset($_SESSION['var_cache'])): ?>
		<?php $hashtags = unserialize($_SESSION['var_cache']); ?>
		<?php foreach ($hashtags[1]['times'] as $time => $info): ?>
			d.push([<?=$time ?>*1000,<?=$info['count'] ?>])
		<?php endforeach; ?>
	<?php endif; ?>

    //d = [[1335708000*1000, 14], [1335706200*1000, 8], [1335704400*1000, 4],[1335702600*1000, 2]];
    d.sort(function(a,b){
    	return a[0] - b[0];
    })
    $.plot($("#flot"), [d], { 
    	xaxis: { mode: "time" },
    	series: {
    		points:{show:true},
    		lines:{show:true, fill:true},
    	},
    	grid: {
    		hoverable:true
    	}
    });
}
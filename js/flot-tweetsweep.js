$().ready(function(){
    $("#flot").ajaxError(function(event, request, settings){
       $(this).append("<li>Error requesting page " + settings.url + "</li>");
     });
	plotTime(0);
    $('.hashtagInfo').each(function () {
        console.log($(this))
        // $(this).click(function(){
        //     console.log('link clicked');
        // });
        
    })
});

function plotTime(i){
	d = [];
    var dataurl = '/ajax/times.php';

    $.getJSON(  
        dataurl,  
        {i: i},  
        function(json) {  
            console.log(json);
            d = json.times;

            d.sort(function(a,b){
                return a[0] - b[0];
            })

            //plot it
            $.plot($("#flot"), [d], { 
                xaxis: { mode: "time", timeformat: "%h:%M%p" },
                series: {
                    points:{show:true},
                    lines:{show:true, fill:true},
                },
                grid: {
                    hoverable:true
                }
            });  
        }  
    );


    //d = [[1335708000*1000, 14], [1335706200*1000, 8], [1335704400*1000, 4],[1335702600*1000, 2]];
    
}
//Setup
$.ajaxSetup ({
  cache: false
});
  
//Variables

//On Page Load:
$(document).ready(function() {
  updateUserTimeline();

  //Attach search bar to search function
  $("#search-form").submit(function(e){
    var query = $('#search-form input').val();
    e.preventDefault();
    search(query);
  });

  //responsive features of typing in the composition area
  $('#composition-textarea').live('keyup',function(){
    var charsRemaining = $('#chars-remaining');
    var prevChars = parseInt(charsRemaining.text());
    var currentChars = $(this).val().length;
    charsRemaining.text(140 - currentChars);
    if (currentChars>0) {
      $('#tweet-btn').removeClass('disabled');
    }else{
      $('#tweet-btn').addClass('disabled');
    };
  });


  //execute tweet on click of tweet button
  $('#tweet-btn').click(function() {
    var status = $('#composition-textarea').val();

    $.post(
        'ajax/tweet.php',
        { status: status },
        function() {
          $('#composition-textarea').val('');
          $.doTimeout(2000, function(){
            updateUserTimeline();
          });
        },
        "html"
      );
  });

  //check composition area for links and ajax them to nlp.php
  $('.link-input').keyup(function() {
    var ajax_load = '<img src="img/ajax-loader.gif"/>';
    var url = $(this).val();
    var loadUrl = 'ajax/nlp.php';
    $("#tags").html(ajax_load).load(loadUrl, "url="+url, function(){
        checkboxTree();
      });
  });



});

//jQuery UI
// # results slider 
$(function() {
$( "#slider" ).slider({
  value:500,
  min: 100,
  max: 2000,
  step: 100,
  slide: function( event, ui ) {
    $( "#amount" ).val( ui.value );
  }
});
$( "#amount" ).val(  $( "#slider" ).slider( "value" ) );
});


/*
 * Description: search twitter for a query string and ajax the results to the #result div
 * Inputs: string q
 * Outputs: none
 */
function search(q){
  var ajax_load = "<img src='img/bird-loader.gif' alt='loading...' style='margin-top:170px;margin-left:235px;' />";
  var loadUrl = "ajax/search.php";
  var pages = $('#amount').val();
  $("#result").html(ajax_load).load(loadUrl, "q="+q+"&pages="+pages, function(){
    assignAdds();
    assignHashtagModal();
    plotTime();
  });

  // var scriptUrl = "js/flot-tweetsweep.php";  

  // $.getScript(scriptUrl, function(){  
  //     plotTime();
  // });  
 
};


/*
 * Description: Makes the add buttons insert the hashtag/@-mention text in the twitter composition area
 * Inputs: none
 * Outputs: none
 */
function assignAdds () {
  $('.add-btn').unbind('click');
  $('.add-btn').click(function(e){
    e.preventDefault();
    var textarea = $('#composition-textarea');
    var text = textarea.val();
    var newText = $(this).data("content");
    var prefix = $(this).data("prefix");

    if (text.search(new RegExp(prefix+newText,"i")) != -1) { //If the hashtag is already in the textarea...
      text = text.replace(new RegExp(prefix+newText,"i"), prefix+newText);
      textarea.val(text);
      $(this).data("existed",true);
    } else if(text.search(new RegExp(newText,"i")) != -1) {
      text = text.replace(new RegExp(newText,"i"), prefix+newText);
      textarea.val(text);
      $(this).data("existed",true);
    } else{ //just append it
      textarea.val(text+" "+prefix+newText);
      $(this).data("existed",false);
    };
    $(this).attr("class","rmv-btn");
    $(this).children('img').attr("src","img/subtract.png");
    assignRemoves();
  });
}

/*
 * Description: Makes the remove buttons remove the hashtag/@-mention text in the twitter composition area
 * Inputs: none
 * Outputs: none
 */
function assignRemoves(){
  $('.rmv-btn').unbind('click');
  $('.rmv-btn').click(function(e){
    e.preventDefault();
    var textarea = $('#composition-textarea');
    var text = textarea.val();
    var newText = $(this).data("content");
    var prefix = $(this).data("prefix");
    
    if ($(this).data("existed")) { //was the keyword already there?
      if (text.search(new RegExp(prefix+newText,"i")) != -1) { //There might not be a space in front of it.
        text = text.replace(new RegExp(prefix+newText,"i"), newText);
        textarea.val(text);
      }
    } else {
      if (text.search(new RegExp(" "+prefix+newText,"i")) != -1) { //Look for the tag in the text area and remove it. if there's a space in from remove that too, this gets rid of the extra spaces from clicking add and subtract repeatedly
        text = text.replace(new RegExp(" "+prefix+newText,"i"), "");
        textarea.val(text);
      } else if (text.search(new RegExp(prefix+newText,"i")) != -1) { //There might not be a space in front of it.
        text = text.replace(new RegExp(prefix+newText,"i"), "");
        textarea.val(text);
      }
    };
    $(this).attr("class","add-btn");
    $(this).children('img').attr("src","img/add.png");
    assignAdds();
  });
}

/*
 * Description: Makes the tag textbox tree expandable & collapsable
 * Inputs: none
 * Outputs: none
 */
function checkboxTree(){
  $('#tags > ul  ul').hide();
  $('#tags > ul > li').prepend('<a href="#"><img src="img/expand.png"/></a>');
  $('#tags > ul a').click(function(e){
    e.preventDefault();
    var thisUl = $(this).parent().find("ul");
    thisUl.slideToggle('fast',
      function () {
        if(thisUl.is(":hidden")){
          $(this).parent().find("img").attr({src:"img/expand.png"});
        } else{
          $(this).parent().find("img").attr({src:"img/collapse.png"});
        }
      });
  });
  $('#tags ul input').change(function(){
    search($(this).data("content"));
  });
}

/*
 * Description: update the user timeline by issuing an ajax call to usertimeline.php
 * Inputs: none
 * Outputs: none
 */
function updateUserTimeline () {
  var ajax_load = "<img src='img/ajax-loader.gif' alt='loading...' style='margin-top:170px;margin-left:235px;' />";
  var loadUrl = "ajax/usertimeline.php";
  $("#usertimeline").load(loadUrl, "q=", function(){
    //assignAdds();
    $('#timeline-refresh').click(function(e){
      e.preventDefault();
      updateUserTimeline();
    })
  });
}

/*
 * Description: change the contents of the modal when hashtags are clicked on
 * Inputs: none
 * Outputs: none
 */
 function assignHashtagModal () {
  $('.hashtagInfo').each(function(){
    $(this).click(function(){
      var index = $(this).data("index");
      var hashtag = $(this).html();
      $('#myModal h3').html(hashtag + " Details");
      plotTime(index);
      //console.log($(this));
    });
  });
 }

//Graveyard

/*
 * Description: 
 * Inputs:
 * Outputs:
 */

  // $('#myModal').modal({
  //   keyboard: false
  // }).modal('hide');

  // $('#testButton').click(function(e){
  //   $(".modal-body").html(ajax_load).load("https://twitter.com/#!/search/%23masters");
  // });
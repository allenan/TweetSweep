<?php
/*
 * Copyright (c) 2008, ClearForest Ltd.
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions 
 * are met:
 * 
 * 		- 	Redistributions of source code must retain the above 
 * 			copyright notice, this list of conditions and the 
 * 			following disclaimer.
 * 
 * 		- 	Redistributions in binary form must reproduce the above 
 * 			copyright notice, this list of conditions and the 
 * 			following disclaimer in the documentation and/or other 
 * 			materials provided with the distribution. 
 * 
 * 		- 	Neither the name of ClearForest Ltd. nor the names of 
 * 			its contributors may be used to endorse or promote 
 * 			products derived from this software without specific prior 
 * 			written permission. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS 
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE 
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF 
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * Calais REST Interface sample
 * 
 * This class invokes the OpenCalais REST interface via HTTP POST
 * 
 */

// Your license key (obatined from api.opencalais.com)
$apiKey = "t7vydt6bxg5m6v2vtc7bk929";

// Content and input/output formats
$content = "(CNN) -- Bubba Watson won the 76th U.S. Masters as he beat South African Louis Oosthuizen at the second hole of a sudden death playoff at Augusta National on Sunday.
Watson, who was winning his first major title, played a remarkable recovery shot from the trees at the 10th to find the green.
Oosthuizen, the 2010 British Open champion, saw his par putt miss to leave his American opponent with two putts to take the title.
Golf.com: Watson's magnificent shot
The 33-year-old Watson rolled his first to within six inches before completing the task, bursting into tears as he embraced his mother, Molly, by the side of the green.
\"I never got this far in my dreams,\" said Watson as he prepared to don the famous green jacket, won last year by Oosthuizen's fellow South African Charl Schwartzel.
Watson and his wife have recently adopted their first child and he added: \"To go home to my new son is going to be fun.\"
I never got this far in my dreams
Bubba Watson
The playoff pair had finished tied at 10-under 278 in regulation play, Watson producing a burst of four straight birdies on the back nine to draw level with his playing partner.
Oosthuizen had taken control of the tournament when he holed his second shot at the par-5 second hole for a remarkable three-under-par double-eagle, only the fourth in the history of the Masters.
Oosthuizen makes history on No. 2
But he mixed two bogeys with two birdies to give Watson the chance to force a playoff, his second in a major after losing to Martin Kaymer of Germany at the 2010 U.S. PGA Championship.
First round leader Lee Westwood of England, home pair Matt Kuchar and Phil Mickelson, and overnight leader Peter Hanson of Sweden finished tied for third at eight-under 280.
Mickelson's challenge was disrupted by a triple bogey six at the short fourth and he was never able to get on terms in search of his fourth Masters crown as he finished with a level-par 72.
Hanson also struggled early in his round before a late rally.
Up ahead, Westwood, once again immaculate from tee to green, carded a four-under 68 to set the clubhouse pace in search of his first major crown and was joined on that mark by local favorite Kuchar.
But Oosthuizen and his playing partner Watson kept their nerve, parring both the 17th and 18th to stay locked together at 10-under-par to go into the extra holes.
Two of the pre-tournament favorites, Tiger Woods and Northern Ireland's Rory McIlroy, finished tied together at five-over, 15 shots adrift after final rounds of 74 and 76 respectively.";
$contentType = "text/txt"; // simple text - try also text/html
$outputFormat = "text/simple"; // simple output format - try also xml/rdf and text/microformats

$restURL = "http://api.opencalais.com/enlighten/rest/";
$paramsXML = "<c:params xmlns:c=\"http://s.opencalais.com/1/pred/\" " . 
			"xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> " .
			"<c:processingDirectives c:contentType=\"".$contentType."\" " .
			"c:outputFormat=\"".$outputFormat."\"".
			"></c:processingDirectives> " .
			"<c:userDirectives c:allowDistribution=\"false\" " .
			"c:allowSearch=\"false\" c:externalID=\" \" " .
			"c:submitter=\"Calais REST Sample\"></c:userDirectives> " .
			"<c:externalMetadata><c:Caller>Calais REST Sample</c:Caller>" .
			"</c:externalMetadata></c:params>";

// Construct the POST data string
$data = "licenseID=".urlencode($apiKey);
$data .= "&paramsXML=".urlencode($paramsXML);
$data .= "&content=".urlencode($content); 

// Invoke the Web service via HTTP POST
 $ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $restURL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
$response = curl_exec($ch);
curl_close($ch);

// Now, the Web service's response is in the $response variable.
// You can now parse the response and use it ...

//echo $response;


// SIMPLE FORMAT Parsing sample
//
// The code below will only work for text/simple output format (it
// parses the response and displays the entities/events/facts it founds)

$simple_level = 0;
$simple_is_parse_err = false;
$simple_l1_tag = null;
$element = null;

$xmlp = xml_parser_create();
xml_parser_set_option($xmlp, XML_OPTION_CASE_FOLDING, 0);
xml_parser_set_option($xmlp, XML_OPTION_SKIP_WHITE, 0);
xml_set_element_handler($xmlp, "simple_start", "simple_stop");
xml_set_character_data_handler($xmlp, "simple_char");
if (xml_parse($xmlp, $response, 1) == 0)
{
	echo "Parse error";
}
xml_parser_free($xmlp);


function simple_start($parser, $element_name, $element_atts) {
	
	global $simple_level;
	global $simple_is_parse_err;
	global $simple_l1_tag;
	global $element;

	if ($simple_is_parse_err)
	{
		return;
	}

	if ($simple_level == 0)
	{
		/*
		 * Level 0 - the OpenCalaisSimple tag
		 */
		if ($element_name != "OpenCalaisSimple")
		{
			$simple_is_parse_err = true;
			return;		
		}
	}
	else if ($simple_level == 1)
	{
		/*
		 * Level 2 - Description or CalaisSimpleOutputFormat
		 */
		if ($element_name != "Description" && 
			$element_name != "CalaisSimpleOutputFormat")
		{
			$simple_is_parse_err = true;
			return;		
		}
		
		$simple_l1_tag = $element_name;
	}
	else if ($simple_level > 1)
	{
		/*
		 * Level 2+ - Description information or semantic data
		 */
		if ($simple_l1_tag == "Description")
		{
			/*
			 * Information under the Description element - place
			 * in info array - not presented
			 */
		}
		else if ($simple_l1_tag == "CalaisSimpleOutputFormat")
		{
			/*
			 * Information under the CalaisSimpleOutputFormat - 
			 * displayed
			 */
			$element = array("type" => $element_name,
							"name" => "",
							"repeat" => 0);
								 
			foreach ($element_atts as $name => $value)
			{
				if ($name == "count")
				{
					$element["repeat"] = (integer)$value; 
				}
			}	 
		}
	}
	
	$simple_level++;
	
}

function simple_stop($parser, $element_name) {

	global $simple_level;
	global $simple_is_parse_err;
	global $simple_l1_tag;
	global $element;

	if ($simple_is_parse_err)
	{
		return;
	}
	
	if ($simple_level == 0)
	{
		$simple_is_parse_err = true;
		return;		
	}
	
	if ($simple_level == 1)
	{
		/*
		 * Level 0 - closing the OpenCalaisSimple tag
		 */
		if ($element_name != "OpenCalaisSimple")
		{
			$simple_is_parse_err = true;
			return;		
		}
	}
	else if ($simple_level == 2)
	{
		/*
		 * Level 1 - closing Description or CalaisSimpleOutputFormat
		 */
		if ($element_name != "Description" && 
			$element_name != "CalaisSimpleOutputFormat")
		{
			$simple_is_parse_err = true;
			return;		
		}
		
		$simple_l1_tag = "";
	}
	else if ($simple_level == 3)
	{
		/*
		 * Level 2 - if under CalaisSimpleOutputFormat - closing an
		 * entity or event - Display it now
		 */
		if ($simple_l1_tag == "CalaisSimpleOutputFormat")
		{
			echo "Found element of type ".$element["type"];
			echo " with name ".$element["name"];
			echo " repeated ".$element["repeat"]." times\n<br>\n"; 	
		} 
	}

	$simple_level--;
}

function simple_char($parser, $data) {
  
	global $simple_level;
	global $simple_is_parse_err;
	global $simple_l1_tag;
	global $element;

	if ($simple_is_parse_err)
	{
		return;
	}  	
	
	/*
	 * Data within <tag> </tag> - set the name of the current element
	 */
	if ($simple_l1_tag == "CalaisSimpleOutputFormat" && $simple_level == 3)
	{
		$element["name"] .= trim($data);
	}

}

?>
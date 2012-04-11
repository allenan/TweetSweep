<?php
/*
 * Created on Apr 15, 2008
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 * 
 * This class provides an interface to the OpenCalais API returning the 
 * results from the API in JSON format
 */

require_once "CalaisPHPIf.php";
require_once "JSON.php";
require_once "./srdf/SimpleRdfParser.php"; 

// for XML parsing
$level = 0;
$ret_parse = "";
 
class CalaisJSONIf {

	var $calaisIf	= null;	
	
	
	function CalaisJSONIf($apiKey = false) {

		$this->calaisIf = new CalaisPHPIf($apiKey);		
	}

	/**
	 * Submit $content to the OpenCalaisAPI and return the results in JSON
	 */
	function getJSONResults($content) {
		
		$cif = $this->calaisIf;
		$resp_rdf = $cif->callEnlighten($content);

		if (strpos($resp_rdf, "Enlighten ERROR:") !== false) {
			return $resp_rdf;
		}

		if (strpos($resp_rdf, "<Exception>") !== false) {
			return "Enlighten ERROR: ".$resp_rdf;
		}

		if (strpos($resp_rdf, "<h1>403 Developer Inactive</h1>") !== false) {
			return "Enlighten ERROR: ".$resp_rdf;
		}

		$stripped_resp_rdf = $this->stripResponse($resp_rdf);

		$p = new SimpleRdfParser();

		$triples = $p->string2triples($stripped_resp_rdf, "");

		$servicesJSON = new Services_JSON();
		$ret = $servicesJSON->encode($triples);
		
		
		
		return $ret;
	}	

	function convertJSONToPrintableHTML($json)
	{
	    $tab = "&nbsp;&nbsp;&nbsp;&nbsp;";
	    $new_json = "";
	    $indent_level = 0;
	    $in_string = false;
	    $json = htmlspecialchars($json);
	    
	    $len = strlen($json);
	    
	    for($c = 0; $c < $len; $c++)
	    {
	        $char = $json[$c];
	        switch($char)
	        {
	            case '{':
	            case '[':
	                if(!$in_string)
	                {
	                    $new_json .= $char . "<br>\n" . str_repeat($tab, $indent_level+1);
	                    $indent_level++;
	                }
	                else
	                {
	                    $new_json .= $char;
	                }
	                break;
	            case '}':
	            case ']':
	                if(!$in_string)
	                {
	                    $indent_level--;
	                    $new_json .= "<br>\n" . str_repeat($tab, $indent_level) . $char;
	                }
	                else
	                {
	                    $new_json .= $char;
	                }
	                break;
	            case ',':
	                if(!$in_string)
	                {
	                    $new_json .= ",<br>\n" . str_repeat($tab, $indent_level);
	                }
	                else
	                {
	                    $new_json .= $char;
	                }
	                break;
	            case ':':
	                if(!$in_string)
	                {
	                    $new_json .= ": ";
	                }
	                else
	                {
	                    $new_json .= $char;
	                }
	                break;
	            case '"':
	                $in_string = !$in_string;
	            default:
	                $new_json .= $char;
	                break;                    
	        }
	    }
	    
	    $new_json = str_replace("\\/", "/", $new_json); 
	    return str_replace("http: //", "http://", $new_json);
	} 
	
	/**
	 * Strip the encompassing string tag and return the inner RDF
	 */
	function stripResponse($response) {

		global $level;
		global $ret_parse;
		
		$ret_parse = "";
		$level = 0;

		$xmlp = xml_parser_create();
	  	xml_parser_set_option($xmlp, XML_OPTION_CASE_FOLDING, 0);
	  	xml_parser_set_option($xmlp, XML_OPTION_SKIP_WHITE, 0);
	  	xml_set_element_handler($xmlp, "start", "stop");
	  	xml_set_character_data_handler($xmlp, "char");
	  	xml_parse($xmlp, $response, 1)or die(sprintf("XML Error: %s at line %d",
    		xml_error_string(xml_get_error_code($xmlp)), 
    		xml_get_current_line_number($xmlp)));

  		xml_parser_free($xmlp);

  		return $ret_parse;
	}

	
}

function start($parser, $element_name, $element_atts) {
	
	global $level;
	global $ret_parse;
	
	if ($level > 0)
	{
		$ret_parse .= "<".$element_name;
		foreach ($element_atts as $name => $value)
		{
			$ret_parse .= " ".$name."=\"".$value."\"";
		}
		$ret_parse .= ">";
	}
	$level++;
	
}

function stop($parser, $element_name) {

	global $level;
	global $ret_parse;
	
	$level--;
	if ($level > 0)
	{
		$ret_parse .= "</".$element_name.">";
	}

}

function char($parser, $data) {
  
    global $level;
  	global $ret_parse;
  	
	if ($level > 0)
  	{
		$ret_parse .= $data;
  	}
}

?>

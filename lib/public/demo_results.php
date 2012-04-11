<?php
/*
 * Created on Apr 15, 2008
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 * 
 * Results of the Calais PHP Demo
 */

require_once "CalaisJSONIf.php";
require_once "key.php";

if (!isset($_POST['SubmittedText']) || !isset($_POST['ResultsFormat']))
{
	echo "Error: Invalid Request";
	exit(1);
}

$resformat = (integer)$_POST['ResultsFormat'];

switch($resformat)
{
	case 1:
		// CalaisViewer format
		$cjif = new CalaisJSONIf($calais_API_key);
		$json_res = $cjif->getJSONResults($_POST['SubmittedText']);
		if (strpos($json_res, "Enlighten ERROR") !== false)
		{
			echo $json_res;
		}
		else
		{
			include_once("ViewerJSON/CalaisViewerJSON.html");
		}
		break;
	
	case 2:
		// JSON format
		html_preamble();
		$cjif = new CalaisJSONIf($calais_API_key);
		$json_res = $cjif->getJSONResults($_POST['SubmittedText']);
		if (strpos($json_res, "Enlighten ERROR") !== false)
		{
			echo $json_res;
		}
		else
		{
			echo $cjif->convertJSONToPrintableHTML($json_res);			
		}
		html_close();
		break;
		
	case 3:
		html_preamble();
		$phpif = new CalaisPHPIf($calais_API_key);
		$raw_res = $phpif->callEnlighten($_POST['SubmittedText']);
		$lines = explode("\n", $raw_res);
		for ($i = 0; $i < count($lines); $i++)
		{
			echo "line #".$i.": ".htmlspecialchars($lines[$i])."<br><br><br>";
		}
		html_close();
		break;
	
	default:
		echo "Error: Invalid Request";
		exit(1);
		break;
}

function html_preamble()
{
	echo "<html><head><title>OpenCalais PHP Demo - Results</title>\n";
	echo "<link href=\"styles1.css\" rel=\"stylesheet\" /></head><body>\n";
	echo "<a href=\"http://opencalais.com/\" target=\"_blank\" style=\"display:block; margin-top:0px;\"><img src=\"img/calais_logo.gif\" border=\"0\"></a>\n";
	echo "<br>&nbsp;<span class=\"title1\">OpenCalais PHP Demo</span><br><br>";
}

function html_close() 
{
	echo "<br><br>";
	echo "<a href=\"CalaisPHPDemo.html\">Back to demo start page</a><br>";
	echo "</body></html>";	
}

?>

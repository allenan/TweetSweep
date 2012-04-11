var _imagePath = null;

function includeJavaScript(jsFile) {
	document.write('<script type="text/javascript" src="' + jsFile + '"></script>'); 
}

function loadResources(scriptsPath, imagesPath) {
	_imagePath = imagesPath;
	if (scriptsPath != null) {
		includeJavaScript(scriptsPath + '/wz_tooltip.js');
		includeJavaScript(scriptsPath + '/clfgeneralprototype.js');
		includeJavaScript(scriptsPath + '/clfxml.js');
		includeJavaScript(scriptsPath + '/clfframeattributes.js');
		includeJavaScript(scriptsPath + '/clfwriter.js');
		includeJavaScript(scriptsPath + '/xmlutils.js');
		includeJavaScript(scriptsPath + '/extractionresults.js');
		includeJavaScript(scriptsPath + '/attributevaluecollection.js');
		includeJavaScript(scriptsPath + '/marknextprev.js');
		includeJavaScript(scriptsPath + '/highlight.js');
		includeJavaScript(scriptsPath + '/clfxmlparser.js');
		includeJavaScript(scriptsPath + '/clfxsltparser.js');
		includeJavaScript(scriptsPath + '/clfrdfparser.js');
	}
}

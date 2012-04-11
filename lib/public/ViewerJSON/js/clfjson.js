//------ CLFJSON ------//
function CLFJSON(clfJSONText, clfJSONobj) {
	this.asString = clfJSONText;
	this.asObj = clfJSONobj;
}

CLFJSON.prototype.getSTR = function() {
	return this.asString;
}

CLFJSON.prototype.getOBJ = function() {
  return this.asObj;
}

CLFJSON.prototype.setSTR = function(clfJSONstr) {
	this.asString = clfJSONstr;
	this.asObj = eval(clfJSONstr);
}

CLFJSON.prototype.getDocumentSTR = function() {
		var obj = this.getFirstJSONElement('http://s.opencalais.com/1/pred/document');
		var txt = obj[1][0];
		return txt;
}

CLFJSON.prototype.getFirstJSONElement = function(name) {

  for(var key in this.asObj)
	{
	 	frame = this.asObj[key];
		for(var i = 0; i < frame.length; i++)
		{
		 	 if(frame[i][0] == name)
			 {
			   return frame[i];
			 }
		}
	}
		
	return null;
}

CLFJSON.prototype.getDocumentNode = function() {

  try //Internet Explorer
  {
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(this.getDocumentSTR());
		return xmlDoc;
  }
  catch(e)
  {
    try //Firefox, Mozilla, Opera, etc.
    {
		 		 var parser=new DOMParser();
		 		 var ret=parser.parseFromString(this.getDocumentSTR(),"text/xml");
				 return ret;
    }
    catch(e) {alert(e.message)}
  }
}

CLFJSON.prototype.setDocumentSTR = function(docSTR) {
	var obj = this.getFirstJSONElement('http://s.opencalais.com/1/pred/document');
	obj[1][0] = docSTR;
}


CLFJSON.prototype.isRDF = function() {
	// always RDF
	return true;
}

/*CLFJSON.prototype.getMetadataTags = function() {
	var res = new Array();
	var tags = this.getXML().getElementsByTagName("MetadataConfig_body");
	if (tags.length > 0 && tags[0].firstChild != null)
		res = tags[0].firstChild.data.split(/[;,]/).concat(res);
	var tags = this.getXML().getElementsByTagName("MetadataConfig_title_tag_name");
	if (tags.length > 0 && tags[0].firstChild != null)
		res = tags[0].firstChild.data.split(/[;,]/).concat(res);
	var tags = this.getXML().getElementsByTagName("MetadataConfig_description_tag_name");
	if (tags.length > 0 && tags[0].firstChild != null)
		res = tags[0].firstChild.data.split(/[;,]/).concat(res);
	var tags = this.getXML().getElementsByTagName("MetadataConfig_date_tag_name");
	if (tags.length > 0 && tags[0].firstChild != null)
		res = tags[0].firstChild.data.split(/[;,]/).concat(res);
	return res;
}*/
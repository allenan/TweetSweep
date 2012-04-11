//------ CLFXML ------//
function CLFXML(clfXMLstr) {
	this.isrdf = null;
	this.isxslt = null;
	this.israwtext = null;
	if (clfXMLstr.indexOf('Format="ClearForest"') < 0) {
		this.isxslt = false;
		if (clfXMLstr.indexOf('http://s.opencalais.com/') < 0)
			throw new Error("CLFERROR: Unrecognized document");
	} else {
		this.isrdf = false;
	}
	this.asString = clfXMLstr.replace(/\r/g, "");
	this.asXML = null;
	this.docOffset = null;
	this.doclength = null;
}

CLFXML.prototype.getXML = function() {
	if (this.asXML == null) {
		try {
			this.asXML = _xmlutil.loadstr(this.asString);
		} catch (exc) {}
		if (this.asXML == null)
			throw new Error("CLFERROR: illegal XML file");
	}
	return this.asXML;
}

CLFXML.prototype.getSTR = function() {
	return this.asString;
}

CLFXML.prototype.setSTR = function(clfXMLstr) {
	this.asString = clfXMLstr;
	this.asXML = null;
	this.docOffset = null;
}

CLFXML.prototype.getDocumentSTR = function() {
	if (this.isRawText())
		return this.getXML().getElementsByTagName("Text")[0].firstChild.data;
	if (this.isRDF()) {
		var obj =  getElementsByTagNameEX(this.getXML(), 'c', 'document')[0];
		var txt = obj.text;
		if (txt == null)
			txt = obj.textContent;
		return txt;
	}
	return this.getSTR().substr(this.getDocumentOffset(), this.getDocumentLength());
}

CLFXML.prototype.getDocumentNode = function() {
	var text;
	if (this.isRDF())
		text = getElementsByTagNameEX(this.getXML(), 'c', 'document');
	else
		text = this.getXML().getElementsByTagName("Text");
    if (text == null || text.length == 0)
        throw new Error("CLFERROR: Unsupported Document\n\t('Text' element is missing)");
	return text[0].firstChild;
}

CLFXML.prototype.setDocumentSTR = function(docSTR) {
	if (this.isRawText())
		this.getXML().getElementsByTagName("Text")[0].firstChild.data = docSTR;
	else if (this.isRDF())
		this.setSTR(this.getSTR().substr(0,this.getSTR().indexOf('<c:document>') + 12) + docSTR + this.getSTR().substr(this.getSTR().indexOf('</c:document>')));
	else
		this.setSTR(this.getSTR().substring(0, this.getDocumentOffset()) + docSTR + this.getSTR().substr(this.getDocumentOffset() + this.getDocumentLength()));
}

CLFXML.prototype.getDocumentOffset = function() {
	if (this.docOffset == null)
		this.docOffset = this.getSTR().indexOf(">", this.getSTR().indexOf("<Text")) + 1;
	return this.docOffset;
}

CLFXML.prototype.isXSLT = function() {
	// Check the XML format
	// XSLT format has 'Results' TAG under the root element
	if (this.isxslt == null) {
		var results = this.getXML().getElementsByTagName("Results");
		for(var i=0; i < results.length && this.isxslt == null; i++)
			if (results[i].parentNode != null && results[i].parentNode.parentNode  == this.getXML())
				this.isxslt = true;
		if (this.isxslt)
			this.isrdf = false;
	}
	if (this.isxslt == null)
		this.isxslt = false;
	return this.isxslt;
}

CLFXML.prototype.isRDF = function() {
	// Check the XML format
	// RDF format has 'rdf' TAG as the root element
	if (this.isrdf == null) {
		this.isrdf = (this.getXML().documentElement.tagName == "rdf:RDF");
		if (this.isrdf)
			this.isxslt = false;
	}
	return this.isrdf;
}

CLFXML.prototype.getDocumentLength = function() {
	// Check the length attribute in Text node
	if (this.doclength == null) {
		var texts = this.getXML().getElementsByTagName("Text");
		for(var i=0; i < texts.length && this.doclength == null; i++)
			if (texts[i].getAttribute("length") != null && texts[i].getAttribute("length").length > 0)
				this.doclength = parseInt(texts[i].getAttribute("length"));
	}
	if (this.doclength == null)
		this.doclength = -1;
	return this.doclength;
}

CLFXML.prototype.isRawText = function() {
	// Check the rawtext attribute in Text node
	if (this.israwtext == null) {
		var texts = this.getXML().getElementsByTagName("Text");
		for(var i=0; i < texts.length && this.israwtext == null; i++)
			if (texts[i].getAttribute("rawtext") != null && texts[i].getAttribute("rawtext").toLowerCase() == "true")
				this.israwtext = true;
	}
	if (this.israwtext == null)
		this.israwtext = false;
	return this.israwtext;
}

CLFXML.prototype.getMetadataTags = function() {
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
}
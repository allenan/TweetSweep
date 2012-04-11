function XMLUtils() {
	this.root = null;
}

XMLUtils.prototype.escstr = function(str) {
	if (this.root == null) {
		var x = this.loadstr("<xml></xml>");
		this.root = x.createTextNode("");
	}
	this.root.nodeValue = str;
	if (typeof XMLSerializer != "undefined")
		return (new XMLSerializer( )).serializeToString(this.root);
	return this.root.xml;
}

XMLUtils.prototype.createclfBHNode = function(id, categ, attrs) {
	var xml = this.loadstr("<xml></xml>");
	var clfBH = xml.createElement("clfBH");
	clfBH.setAttribute("id", id);
	clfBH.setAttribute("category", categ);
	for (var i=0; i < attrs.attributes.length; i++) {
		clfBH.setAttribute('A' + i, attrs.attributes[i]);
		clfBH.setAttribute('V' + i, attrs.values[i]);
	}
	if (typeof XMLSerializer != "undefined")
		return (new XMLSerializer( )).serializeToString(clfBH);
	return clfBH.xml;
}

XMLUtils.prototype.loadstr = function(str) {
	if (typeof DOMParser != "undefined") {
		// Mozilla, Firefox, and related browsers
		return (new DOMParser( )).parseFromString(str, "application/xml");
	} else if (typeof ActiveXObject != "undefined") {
		// Internet Explorer
		var root = new ActiveXObject("MSXML2.DOMDocument");
		root.preserveWhiteSpace = true;
		root.loadXML(str);
		return root;
	} else {
		// ???
		throw new Error("CLFERROR: Unsupportable browser");
	}
}
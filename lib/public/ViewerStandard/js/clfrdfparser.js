function clfrdfparserAddFrames(clfXML, addFrameData) {
	function getNodeText(node) {
		if (node.text != null)
			return node.text;
		return node.textContent;
	}
	function extractRdfNode(frame) {
		if (frame.tagName != "rdf:Description")
			return;
		var type = getAttributeEX(getElementsByTagNameEX(frame,'rdf', 'type')[0], 'rdf', 'resource');
		if (type.indexOf(emprefix) != 0)
			return;
		var hashcode = getAttributeEX(frame, 'rdf', 'about');
		var name = type.substr(emprefix.length + 2);
		var attrs = new AttributeValueCollection();
		var isTerm = type.substr(emprefix.length, 1) == 'e';
		if (isTerm) {
			attrs.attributes.push(name);
			attrs.values.push(getNodeText(getElementsByTagNameEX(frame, 'c' ,'name')[0]).replace(/[\s\n\t\r]+/g, ' '));
		} else {
			for (var i = 0; i < frame.childNodes.length; i++) {
				if (frame.childNodes[i].nodeName.indexOf('c:') == 0) {
					attrs.attributes.push(frame.childNodes[i].nodeName.substr(2));
					var ref = getAttributeEX(frame.childNodes[i], 'rdf', 'resource');
					if (ref == null || ref == '')
						attrs.values.push(getNodeText(frame.childNodes[i]).replace(/[\s\n\t\r]+/g, ' '));
					else
						attrs.values.push('%ref%' + ref);
				}
			}
		}
		rdfData[hashcode] = [name, attrs];
	}
	function extractOffsetLength(frame) {
		if (frame.tagName != "rdf:Description")
			return;
		var type = getAttributeEX(getElementsByTagNameEX(frame, 'rdf', 'type')[0], 'rdf' ,'resource');
		if (type.indexOf(instanceprefix) != 0)
			return;
		var hashcode = getAttributeEX(getElementsByTagNameEX(frame, 'c', 'subject')[0], 'rdf' ,'resource');
		var data = rdfData[hashcode];
		// fix references
		for (var i = 0; i < data[1].values.length; i++)
			if (data[1].values[i].indexOf('%ref%') == 0)
				data[1].values[i] = rdfData[data[1].values[i].substr(5)][1].values[0];
		var offset = getNodeText(getElementsByTagNameEX(frame, 'c' ,'offset')[0]);
		var len = getNodeText(getElementsByTagNameEX(frame, 'c', 'length')[0]);
		var frameid = ++_id;
		addFrameData(frameid, data[0], data[1], parseInt(offset), parseInt(len));
	}
	var instanceprefix = 'http://s.opencalais.com/1/type/sys/InstanceInfo'
	var emprefix = 'http://s.opencalais.com/1/type/em/';
	var rdfData = new Object();
	var allframes = clfXML.getXML().documentElement.childNodes;
	if (allframes == null || allframes.length == 0)
		throw new Error("CLFERROR: Unsupported RDF Document\n\t(Root element is empty)");
	var _id = 100000; // default frame id
	for (var i = 0; i < allframes.length; i++)
		extractRdfNode(allframes[i]);
	for (var i = 0; i < allframes.length; i++)
		extractOffsetLength(allframes[i]);
}

var clf_ns2url = new Object();
clf_ns2url.rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
clf_ns2url.c = "http://s.opencalais.com/1/pred/"

function getElementsByTagNameEX(e, ns, tag) {
	if (e.getElementsByTagNameNS != null)
		return e.getElementsByTagNameNS(clf_ns2url[ns], tag);
	return e.getElementsByTagName(ns + ':' + tag);
}

function getAttributeEX(e, ns, tag) {
	if (e.getAttributeNS != null)
		return e.getAttributeNS(clf_ns2url[ns], tag);
	return e.getAttribute(ns + ':' + tag);
}

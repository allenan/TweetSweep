var clf_ns2url = new Object();
clf_ns2url.rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
clf_ns2url.c = "http://s.opencalais.com/1/pred/";

function clfjsonparserAddFrames(clfJSONObj, addFrameData) {
	function getNodeText(node) {
		return node[1][0];
	}
	function extractRdfNode(key, frame) {
	  var typeElm = getElementByTagNameEX(frame, 'rdf', 'type');
		if (typeElm == null)
		{
		 return;
		}
		var type = getResource(typeElm);
		if (type.indexOf(emprefix) != 0)
			return;
		var hashcode = key;
		var name = type.substr(emprefix.length + 2);
		var attrs = new AttributeValueCollection();
		var isTerm = type.substr(emprefix.length, 1) == 'e';
		if (isTerm) {
			attrs.attributes.push(name);
			attrs.values.push(getNodeText(getElementByTagNameEX(frame, 'c' ,'name')).replace(/[\s\n\t\r]+/g, ' '));
		} else {
			for (var i = 0; i < frame.length; i++) {
				if (frame[i][0].indexOf(clf_ns2url['c']) == 0) {
					attrs.attributes.push(frame[i][0].substr(clf_ns2url['c'].length));
					var ref = getResourceIfExists(frame[i]);
					if (ref == null || ref == '')
						attrs.values.push(getNodeText(frame[i]).replace(/[\s\n\t\r]+/g, ' '));
					else
						attrs.values.push('%ref%' + ref);
				}
			}
		}
		rdfData[hashcode] = [name, attrs];
	}
	function extractOffsetLength(key, frame) {
	  var typeElm = getElementByTagNameEX(frame, 'rdf', 'type');
		if (typeElm == null)
		{
		 return;
		}
		var type = getResource(typeElm);
		if (type.indexOf(instanceprefix) != 0)
			return;
	  var subjectElm = getElementByTagNameEX(frame, 'c', 'subject');
		var hashcode = getResource(subjectElm);	
		var data = rdfData[hashcode];
		// fix references
		for (var i = 0; i < data[1].values.length; i++)
			if (data[1].values[i].indexOf('%ref%') == 0)
				data[1].values[i] = rdfData[data[1].values[i].substr(5)][1].values[0];
		var offset = getNodeText(getElementByTagNameEX(frame, 'c' ,'offset'));
		var len = getNodeText(getElementByTagNameEX(frame, 'c', 'length'));
		var frameid = ++_id;
		addFrameData(frameid, data[0], data[1], parseInt(offset), parseInt(len));
	}
	var instanceprefix = 'http://s.opencalais.com/1/type/sys/InstanceInfo'
	var emprefix = 'http://s.opencalais.com/1/type/em/';
	var rdfData = new Object();
	var allframes = clfJSONObj.getOBJ();
	if (allframes == null || allframes.length == 0)
		throw new Error("CLFERROR: Unsupported RDF Document\n\t(Root element is empty)");
	var _id = 100000; // default frame id
	for (var key in allframes)
		extractRdfNode(key, allframes[key]);
	for (var key in allframes)
		extractOffsetLength(key, allframes[key]);
}


function getElementByTagNameEX(e, ns, tag) {
  var fulltag = clf_ns2url[ns] + tag;
  for (var i = 0; i < e.length; i++)
	{
	  if ((fulltag.length == e[i][0].length) && (fulltag.indexOf(e[i][0]) == 0))
		{
		  return e[i];
		}
	}
	return null;
}

function getAttributeEX(e, ns, tag) {
  
	var elm = getElementByTagNameEX(e, ns, tag);
	if (elm == null)
	{
	 	 return null;
	}
	return elm[1][0];
}

function getResource(e) {

  return e[1]; 
}

function getResourceIfExists(e) {

  if (e.length > 1 && typeof e[1] == 'string')
	{
	 	 return e[1];
	}
	
	return null;
}
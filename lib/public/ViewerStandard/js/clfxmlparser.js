function clfxmlparserAddFrames(clfXML, addFrameData) {
	function addFrame(frame) {
		if (frame.nodeName != "Frame")
			return;
		var offset = parseInt(frame.getAttribute("offset"));
		var len = parseInt(frame.getAttribute("length"))
		var name = frame.getAttribute("name");
		var terms = frame.getElementsByTagName("Term");
		var attrs = new AttributeValueCollection();
		var frameid = frame.getAttribute("FID");
		if (frameid == null || frameid == "")
			frameid = ++_id;
		else
			frameid = parseInt(frameid);
		// traverse all terms inside the frame
		for (var i=0; i < terms.length; i++) {
			if (terms[i].firstChild != null && terms[i].firstChild.nodeValue != null && terms[i].firstChild.nodeValue.length >0 && terms[i].firstChild.nodeValue != "N/A") {
				attrs.attributes.push(terms[i].getAttribute("attribute"));
				attrs.values.push(terms[i].firstChild?terms[i].firstChild.nodeValue.replace(/[\s\n\t\r]+/g, ' '):"");
				// mark terms inside frames
				var termlen = parseInt(terms[i].getAttribute("length"));
				var termoffset = parseInt(terms[i].getAttribute("offset"));
				if (len > termlen && offset <= termoffset && offset + len > termoffset)
					addFrameData(frameid * -1, null, null, termoffset, termlen);
			}
		}
		addFrameData(frameid, name, attrs, offset, len);
	}
	var frmsroot = clfXML.getXML().getElementsByTagName("Frames");
	if (frmsroot == null || frmsroot.length == 0)
		throw new Error("CLFERROR: Unsupported XML Document\n\t('Frames' element is missing)");
	var allframes = frmsroot[0].childNodes;
	if (allframes == null || allframes.length == 0)
		throw new Error("CLFERROR: Unsupported XML Document\n\t(No 'Frame' elements)")
	var _id = 100000; // default frame id if no frame id found
	for (var i = 0; i < allframes.length; i++)
		addFrame(allframes[i]);
}
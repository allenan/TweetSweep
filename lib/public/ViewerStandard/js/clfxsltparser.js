function clfxsltparserAddFrames(clfXML, addFrameData) {
	function addFrame(frame) {
		if (frame.nodeName == "Entities" || frame.nodeName == "Events_Facts") {
			var ntts = frame.childNodes;
			for (var i=0; i < ntts.length; i++) {
				var ntt = ntts[i];
				var offset = parseInt(ntt.getAttribute("offset"));
				var len = parseInt(ntt.getAttribute("length"))
				var name = ntt.nodeName;
				var attrs = new AttributeValueCollection();
				var frameid = ntt.getAttribute("FID");
				if (frameid == null || frameid == "")
					frameid = ++_id;
				// traverse all terms inside the frame
				for (var j=0; j < ntt.childNodes.length; j++) {
					if (ntt.childNodes[j].firstChild != null && ntt.childNodes[j].firstChild.nodeValue != null && ntt.childNodes[j].firstChild.nodeValue.length > 0 && ntt.childNodes[j].firstChild.nodeValue != "N/A") {
						attrs.attributes.push(ntt.childNodes[j].nodeName);
						attrs.values.push(ntt.childNodes[j].firstChild.nodeValue.replace(/[\s\n\t\r]+/g, ' '));
						// mark terms inside frames
						var termlen = parseInt(ntt.childNodes[j].getAttribute("length"));
						var termoffset = parseInt(ntt.childNodes[j].getAttribute("offset"));
						if (len > termlen && offset <= termoffset && offset + len > termoffset)
							addFrameData(frameid * -1, null, null, termoffset, termlen);
					}
				}
				addFrameData(frameid, name, attrs, offset, len);
			}
		}
	}
	var frmsroot = clfXML.getXML().getElementsByTagName("Results");
	if (frmsroot == null || frmsroot.length == 0)
		throw new Error("CLFERROR: Unsupported XSLT Document\n\t('Results' element is missing)");
	var allframes = frmsroot[0].childNodes;
	if (allframes == null || allframes.length == 0)
		throw new Error("CLFERROR: Unsupported XSLT Document\n\t(No 'Entities' or 'Events_Facts' elements)")
	var _id = 100000; // default frame id if no frame id found
	for (var i = 0; i < allframes.length; i++)
		addFrame(allframes[i]);
}
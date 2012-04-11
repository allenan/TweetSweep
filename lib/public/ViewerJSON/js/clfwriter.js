// Sidebar Writer //

function CLFSidebarWriter(htmlElement) {
	this.lastCategID = null;
	this.root = htmlElement;
	this.place4instances = null;
}

CLFSidebarWriter.prototype.addCategory = function(categName, categID) {
	var niceCategName = categName.addSpaces();
	var categClass = _clfResult.isTerm(categName)?"CLFSBAnyTerm":"CLFSBAnyEvent";
	categClass += " CLFSBCateg CLFSBCateg" + categName;
	var sidebarElm = new SidebarElement(categID, "-1", categClass, null);
	sidebarElm.addCMD_ToggleVisibility();
	sidebarElm.addCMD_Highlight();
	sidebarElm.addText(niceCategName);
	this.root.appendChild(sidebarElm.getElement());
	var div = document.createElement("div");
	div.className = "CLFSBInstances";
	div.id = "CLFSBInstances" + categID;
	this.root.appendChild(div);
	this.lastCategID = categID;
	this.place4instances = div;
}

CLFSidebarWriter.prototype.addTerm = function(termName, termID) {
	var sidebarElm = new SidebarElement(this.lastCategID, termID, "CLFSBTerm", termName.length>35?termName:null);
	sidebarElm.addCMD_Highlight();
	if (termName.length > 35)
		termName = termName.substr(0,32) + "...";
	sidebarElm.addText(termName);
	this.place4instances.appendChild(sidebarElm.getElement());
}

CLFSidebarWriter.prototype.addRelation = function(relationName, relationID) {
	var str = "";
	var categName = _clfResult.getCategs()[this.lastCategID];
	var termName = _clfResult.getCategTerms(categName)[relationID];
	var id = "CLFH" + _clfResult[categName][termName][0] + ".";
	for (var j=0; j<9; j++) {
		var clfid = id + j
		var elm = document.getElementById(clfid);
		if (elm == null)
			break;
		str += elm.innerText?elm.innerText:elm.textContent;
	}
	var sidebarElm = new SidebarElement(this.lastCategID, relationID, "CLFSBFrame", relationName);
	sidebarElm.addCMD_Highlight();
	str = str.replace(/[\s\n\t\r]+/g, ' ');
	if (str.length > 35)
		str = str.substr(0,32) + "...";
	sidebarElm.addText(str);
	this.place4instances.appendChild(sidebarElm.getElement());
}

CLFSidebarWriter.prototype.addHeader = function(nameHeader, isTerm) {
	var sidebarElm = new SidebarElement("-1", "-1", "CLFSBHeader", null);
	sidebarElm.addText(nameHeader);
	sidebarElm.addCMD_HighlightAllNone(isTerm);
	this.root.appendChild(sidebarElm.getElement());
}

// Sidebar Element //

function SidebarElement(categID, instanceID, className, tooltip) {
	this.categID = categID;
	this.instanceID = instanceID;
	this.div = document.createElement("div");
	this.nobr = document.createElement("nobr");
	this.div.className = className;
	if (tooltip != null) {
		if (clf_wzTooltip) {
			var txt = new StringBuilder();
			addTooltipAsHTML(txt, tooltip);
			txt = txt.ToString();
			this.div.onmouseover = function() {Tip(txt, BALLOON, false)};
		} else {
			this.div.title = tooltip;
		}
	}
	this.div.appendChild(this.nobr);
}

SidebarElement.prototype.addCMD_Highlight = function() {
	var highlightCMD = document.createElement("input");
	highlightCMD.type = "checkbox";
	highlightCMD.id = "CLFSideBar." + this.categID + "." + this.instanceID;
	if (highlightCMD.attachEvent) {// IE
		highlightCMD.setAttribute("categID", this.categID);
		highlightCMD.setAttribute("instanceID", this.instanceID);
		highlightCMD.attachEvent("onclick", function(e) {changeHighlight(e.srcElement.checked, e.srcElement.categID, e.srcElement.instanceID);} );	
	} else { // Firefox
		highlightCMD.setAttribute("onclick", "changeHighlight(this.checked, " + this.categID + ", " + this.instanceID + ");");
	}
	this.nobr.appendChild(highlightCMD);
}

SidebarElement.prototype.addCMD_ToggleVisibility = function() {
	var toggleVisibilityCMD = document.createElement("input");
	toggleVisibilityCMD.type = "image";
	toggleVisibilityCMD.src = _imagePath + "/collapsesmall.gif";
	toggleVisibilityCMD.className = "collapseExpandIcon";
	toggleVisibilityCMD.id = "toggleVisibilityImage" + this.categID;
	if (toggleVisibilityCMD.attachEvent) {// IE
		toggleVisibilityCMD.setAttribute("categID", this.categID);
		toggleVisibilityCMD.attachEvent("onclick", function(e) {toggleInstancesVisibility(e.srcElement.categID);} );	
	} else { // Firefox
		toggleVisibilityCMD.setAttribute("onclick", "toggleInstancesVisibility(" + this.categID + ");");
	}
	this.nobr.appendChild(toggleVisibilityCMD);
}

SidebarElement.prototype.addText = function(text) {
	this.nobr.appendChild(document.createTextNode(text));
}

SidebarElement.prototype.addCMD_HighlightAllNone = function(isTerm) {
	var highlightNoneCMD = document.createElement("input");
	highlightNoneCMD.type = "image";
	highlightNoneCMD.src = _imagePath + "/highlightnone.gif";
	highlightNoneCMD.title = "Clear Highlights";
	highlightNoneCMD.className = "CLFclearhighlights";
	if (isTerm)
		highlightNoneCMD.onclick = function(e) {changeHighlightByTerm(false, true);};
	else
		highlightNoneCMD.onclick = function(e) {changeHighlightByTerm(false, false);};
	var highlightAllCMD = document.createElement("input");
	highlightAllCMD.type = "image";
	highlightAllCMD.src = _imagePath + "/highlightall.gif";
	highlightAllCMD.title = "Highlight All";
	highlightAllCMD.className = "CLFhighlightsall";
	if (isTerm)
		highlightAllCMD.onclick = function(e) {changeHighlightByTerm(true, true);};	
	else
		highlightAllCMD.onclick = function(e) {changeHighlightByTerm(true, false);};	
	var spanHighlights = document.createElement("span");
	spanHighlights.className = "CLFHighlightAllNone";
	spanHighlights.appendChild(highlightAllCMD);
	spanHighlights.appendChild(highlightNoneCMD);
	this.nobr.appendChild(spanHighlights);
}

SidebarElement.prototype.addCMD_MarkNextPrev = function() {
	var nextCMD = document.createElement("input");
	nextCMD.type = "image";
	nextCMD.src = _imagePath + "/findnext.gif";
	nextCMD.className = "findnext";
	nextCMD.onclick = function(e) {markNextPrev(true);};
	var prevCMD = document.createElement("input");
	prevCMD.type = "image";
	prevCMD.src = _imagePath + "/findprev.gif";
	prevCMD.className = "findprev";
	prevCMD.onclick = function(e) {markNextPrev(false);};
	var spanNextPrev = document.createElement("span");
	spanNextPrev.className = "CLFNextPrev";
	spanNextPrev.appendChild(prevCMD);
	spanNextPrev.appendChild(nextCMD);
	this.nobr.appendChild(spanNextPrev);
}

SidebarElement.prototype.addCMD_CollapseExpandAll = function() {
	var collapseCMD = document.createElement("input");
	collapseCMD.type = "image";
	collapseCMD.src = _imagePath + "/treecollapseall.gif";
	collapseCMD.className = "collapseAll";
	collapseCMD.onclick = function(e) {collapseExpandAll(true);};
	var expandCMD = document.createElement("input");
	expandCMD.type = "image";
	expandCMD.src = _imagePath + "/treeexpandall.gif";
	expandCMD.className = "expandAll";
	expandCMD.onclick = function(e) {collapseExpandAll(false);};
	var spanCollapseExpand = document.createElement("span");
	spanCollapseExpand.className = "CLFCollapseExpand";
	spanCollapseExpand.appendChild(expandCMD);
	spanCollapseExpand.appendChild(collapseCMD);
	this.nobr.appendChild(spanCollapseExpand);
}

SidebarElement.prototype.getElement = function() {
	return this.div;
}

// Document Writer //

function CLFDOCWriter(htmlElement) {
	this.currentLevel = 0;
	this.rootElement = htmlElement;
	this.currentElement = htmlElement;
	this.currentType = "ROOT";
	this.currentTag = "ROOT";
	this.openHighlight = new Array();
	this.tmpClosedHighlight = new Array();
	this.highlightInfo = new Object();
	this.RXurl = /^https?:\/\/[^ ]+$/i;
	this.textdata = new StringBuilder();
}

CLFDOCWriter.prototype.changeCurrentElement = function(newElm, add2root, newType, newLevel) {
	if (this.currentType == "TEXT") {
		if (!this.textdata.IsEmpty())
			this.currentElement.appendChild(document.createTextNode(this.textdata.ToString()));
	}
	if (newLevel != null)
		this.currentLevel = newLevel;
	if (newType != null)
		this.currentType = newType;
	if (newElm != null) {
		if (add2root)
			this.rootElement.appendChild(newElm);
		else
			this.currentElement.appendChild(newElm);
		if (newElm.tagName != "BR")
			this.currentElement = newElm;
	}
}

CLFDOCWriter.prototype.addHeaderElement = function(level, headerName) {
	this.optimize();
	var elm = document.createElement("DIV");
	elm.className = "CLFDOCHeader CLFDOCLevel" + level + " CLFTAG" + headerName;
	this.changeCurrentElement(elm, true, "HEADER", level);
	this.currentTag = headerName;
	this.currentElement.appendChild(document.createTextNode(headerName));
}

CLFDOCWriter.prototype.addP = function() {
	//this.optimize();
//	if (this.currentType != "TEXT")
//		this.addTextElement(this.currentLevel + 1);
//	var elm = document.createElement("DIV");
//	elm.className = "CLFDOCText CLFDOCLevel" + this.currentLevel + " CLFTAG" + this.currentTag;
//	this.changeCurrentElement(elm, true, null, null);
	var elm = document.createElement("BR");
	this.changeCurrentElement(elm, false, null, null);
}

CLFDOCWriter.prototype.addTable = function(start) {
	var elm = document.createElement("BR");
	this.changeCurrentElement(elm, false, null, null);
}

CLFDOCWriter.prototype.addTableRow = function() {
	var elm = document.createElement("BR");
	this.changeCurrentElement(elm, false, null, null);
}

CLFDOCWriter.prototype.addTextElement = function(level) {
	if (this.currentType == "TEXT" && this.currentLevel == level)
		return;
	this.optimize();
	var elm = document.createElement("DIV");
	elm.className = "CLFDOCText CLFDOCLevel" + level + " CLFTAG" + this.currentTag;
	this.changeCurrentElement(elm, true, "TEXT", level);
}

CLFDOCWriter.prototype.appendStr = function(str) {
	if (str.match(this.RXurl) != null) {
		var txt = document.createElement("a");
		txt.href = str;
		txt.className = "CLFDOCLink";
		txt.appendChild(document.createTextNode(str));
		this.changeCurrentElement(null, null, null, null);
		this.currentElement.appendChild(txt);
	} else
		this.textdata.Append(str);
}

CLFDOCWriter.prototype.beginHighlight = function(level, id, category, isTerm, tooltip) {
	var hgl = document.createElement("SPAN");
	var hglID = "CLFH" + id + ".";
	var nextFID = 0;
	if (this.highlightInfo[id] != null) {
		for (; nextFID < 9; nextFID++) {
			var tempid = hglID + nextFID
			var n = document.getElementById(tempid);
			if (n == null)
				break;	
		}
	}
	hgl.id = hglID + nextFID;
	hgl.className = "CLF" + category;
	if (tooltip != null)
		hgl.setAttribute("clftooltip", tooltip);
	if (this.currentType != "TEXT")
		this.addTextElement(level);
	this.changeCurrentElement(hgl, false, null, null);
	this.openHighlight.push(id);
	this.highlightInfo[id] = [level, id, category, isTerm, tooltip];
}

CLFDOCWriter.prototype.endHighlight = function(level, id) {
	this.popHighlight();
	var lastID = this.openHighlight.pop();
	// close all overlapping
	while (lastID != id) {
		this.tmpClosedHighlight.push(lastID);
		this.popHighlight();
		lastID = this.openHighlight.pop();
	}
	// open back all overlapping
	while (this.tmpClosedHighlight.length > 0) {
		var arv = this.highlightInfo[this.tmpClosedHighlight.pop()];
		this.beginHighlight(arv[0], arv[1], arv[2], arv[3], arv[4]);
	}
}

CLFDOCWriter.prototype.popHighlight = function() {
	this.changeCurrentElement(null, null, null, null);
	if (this.currentElement.childNodes.length == 0) {
		var tmp = this.currentElement;
		this.currentElement = this.currentElement.parentNode;
		this.currentElement.removeChild(tmp);
	} else {
		this.currentElement = this.currentElement.parentNode;
	}
}

CLFDOCWriter.prototype.eod = function() {
	this.changeCurrentElement(null, null, null);
	this.optimize();
}

CLFDOCWriter.prototype.optimize = function() {
	// patch to remove div with only spaces
	if (this.currentElement.childNodes.length == 1)
		if (this.currentElement.firstChild.nodeType == 3)
			if (this.currentElement.firstChild.data.trim().length == 0)
				this.rootElement.removeChild(this.currentElement);
	// end of patch
}
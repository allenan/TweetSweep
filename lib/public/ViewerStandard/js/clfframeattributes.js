var clfAllTerms = null;

function CLFFrameAttributes(category, attributes) {
	if (clfAllTerms == null)
		calculateClfTermsByCSS();
	this.allTerms = clfAllTerms;
	this.category = category;
	this.attrs = new Object();
	if (typeof attributes == "string") {
		var atvl = /"([^"]*)".*?"([^"]*)"/g;
		var result;
		while((result = atvl.exec(attributes)) != null) {
			if (this.attrs[result[1]] == null)
				this.attrs[result[1]] = new Array();
			this.attrs[result[1]].push(result[2]);
		}
	} else {
		for (var i = 0; i < attributes.length; i++) {
			var name = attributes[i].name;
			var val = attributes[i].value;
			if (name.search(/^A[0-9]+$/) == 0) {
				var vname = name.replace("A","V");
				if (this.attrs[val] == null)
					this.attrs[val] = new Array();
				this.attrs[val].push(attributes.getNamedItem(vname).value);
			}
		}
	}
	this.isterm = this.calculateTerm();
}

CLFFrameAttributes.prototype.isTerm = function() {
	return (this.isterm != null);
}

// for term = the value of the category attribute else the tooltip
CLFFrameAttributes.prototype.getName = function() {
	if (this.isterm != null) {
		if (this.attrs[this.isterm] != null)
			return this.attrs[this.isterm][0];
		if (this.attrs['Detection'] != null)
			return this.attrs['Detection'][0];
		for (var first in this.attrs) {
			return this.attrs[first][0];
		}
	}
	return this.getTooltip();
}

CLFFrameAttributes.prototype.getTooltip = function() {
	if (this.isterm != null)
		return this.category.addSpaces() + " :: " + this.getName();
	var ret = this.category.addSpaces();
	for (var at in this.attrs) {
		if (at.toUpperCase() == "DETECTION")
			continue;
		this.attrs[at].sort();
		for (var i=0; i < this.attrs[at].length; i++)
			ret += "\n " + at.addSpaces() + ": " + this.attrs[at][i];
	}
	return ret;
}

CLFFrameAttributes.prototype.calculateTerm = function() {
	if (this.allTerms[this.category] != null)
		return this.allTerms[this.category];
	if (this.attrs[this.category] != null)
		return this.category;
	return null;
}

var calculateClfTermsByCSS = function() {
	// find the right (last highlight.css) css
	var css = null;
	for (var i=0; i < document.styleSheets.length; i++)
		if (document.styleSheets[i].href.toLowerCase().indexOf('highlight.css') > -1)
			css = document.styleSheets[i]
	if (css == null)
		return; // didn't find
	// find the .CLFSBAnyTerm rule
	var theRules = new Array();
	if (css.cssRules)
		theRules = css.cssRules
	else if (css.rules)
		theRules = css.rules
	else return
	for (var i=0; i < theRules.length; i++)
		if (theRules[i].selectorText == ".CLFSBAnyTerm")
			break;
	if (i == theRules.length)
		return; // didn't find
	// find the pattern of term
	var termPattern = theRules[i].style.cssText;
	var cssCanonization = /#[a-zA-Z0-9]+/g;
	termPattern = termPattern.replace(cssCanonization, '');
	clfAllTerms = new Object();
	for (;i < theRules.length; i++)
		if (theRules[i].selectorText.indexOf('.CLFSBCateg') == 0)
			if (theRules[i].style.cssText.replace(cssCanonization, '') == termPattern) {
				var str = theRules[i].selectorText.substr(11);
				clfAllTerms[str] = str;
			}
}
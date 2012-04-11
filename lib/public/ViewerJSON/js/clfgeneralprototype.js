// String //
String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); };
String.prototype.addSpaces = function() { return this.replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace("_"," "); };
String.prototype.insert = function(str, index) {
	if (index==null || index==0)
		return str + this.toString();
	return this.toString().substr(0, index) + str + this.toString().substr(index);
}

// Array //
Array.prototype.sortNoCase = function() { return this.sort( function (a,b) { return a.toLowerCase().localeCompare(b.toLowerCase()); } );}
Array.prototype.sortNum = function() { return this.sort( function (a,b) { return a-b; } );}

// StringBuilder //
var StringBuilder = function() {
	var h = new Array();
	this.Append = Append;
	this.ToString = ToString;
	this.IsEmpty = IsEmpty;

	// Appends the string representation of a specified object to the end of this instance.
	// Parameter["stringToAppend"] - The string to append. 
	function Append(stringToAppend) {
		h[h.length] = stringToAppend;
	}

	// Converts a StringBuilder to a String.
	function ToString() {
		if (h.length < 2) {
			var ret = (h[0])?h[0]:"";
			h = new Array();// ToString clear the buffer !!!!
			return ret;
		}
		var a = h.join('');
		h = new Array();
		// h[0] = a; // ToString clear the buffer !!!!
		return a;
	}
	
	function IsEmpty() {
		return (h.length == 0);
	}
}

if (!window.XMLHttpRequest)
	window.XMLHttpRequest = function() { return new ActiveXObject('Microsoft.XMLHTTP') }


if (typeof HTMLElement!="undefined" && !HTMLElement.prototype.insertAdjacentElement) {
	HTMLElement.prototype.insertAdjacentElement = function (where,parsedNode) {
		switch (where) {
		case 'beforeBegin':
			this.parentNode.insertBefore(parsedNode,this)
			break;
		case 'afterBegin':
			this.insertBefore(parsedNode,this.firstChild);
			break;
		case 'beforeEnd':
			this.appendChild(parsedNode);
			break;
		case 'afterEnd':
			if (this.nextSibling)
				this.parentNode.insertBefore(parsedNode,this.nextSibling);
			else
				this.parentNode.appendChild(parsedNode);
			break;
		}
	}

	HTMLElement.prototype.insertAdjacentHTML = function (where,htmlStr) {
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var parsedHTML = r.createContextualFragment(htmlStr);
		this.insertAdjacentElement(where,parsedHTML)
	}


	HTMLElement.prototype.insertAdjacentText = function (where,txtStr) {
		var parsedText = document.createTextNode(txtStr)
		this.insertAdjacentElement(where,parsedText)
	}
}
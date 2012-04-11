var _selectText = null;

function markNextPrev(next) {
	if (_selectText == null || _selectText.clfResult != _clfResult)
		_selectText = new SelectText();
	next ? _selectText.selectNext() : _selectText.selectPrev();
}

function SelectText() {
	this.idbyorder = new Array();
	this.addCLFNode(_docElement);
	this.lastSelectedIndex = -1;
	this.clfResult = _clfResult;
}

SelectText.prototype.selectNext = function() {
	var id = this.getNextID(1);
	if (id)
		selectID(id);
}

SelectText.prototype.selectPrev = function() {
	var id = this.getNextID(-1);
	if (id)
		selectID(id);
}

SelectText.prototype.getNextID = function(add) {
	var index = this.lastSelectedIndex;
	var nodeFound = null;
	for (var i = 0; i < this.idbyorder.length && !nodeFound; i++) {
		index += add;
		if (index >= this.idbyorder.length)
			index -= this.idbyorder.length;
		if (index < 0)
			index += this.idbyorder.length;
		for (var j=0; j < this.idbyorder[index].length && !nodeFound; j++) {
			var node = document.getElementById(this.idbyorder[index][j]);
			if (node.className.indexOf("Highlight") > 0)
				nodeFound = node;
		}
	}
	this.lastSelectedIndex = index;
	return nodeFound ? nodeFound.id : null;
}

SelectText.prototype.addCLFNode = function(node) {
	var allspan = node.getElementsByTagName('span');
	for (var i=0; i < allspan.length; i++) {
		var node = allspan[i];
		if (node.id != null && node.id.search("CLFH[0-9]+\.0") == 0) {
			if (node.parentNode.id != null && node.parentNode.id.search("CLFH[0-9]+\.0") == 0 && node.previousSibling == null) {
				this.idbyorder[this.idbyorder.length - 1].push(node.id);
			} else {
				var arr = new Array();
				arr.push(node.id);
				this.idbyorder.push(arr);
			}
		}
	}
}

function selectID(clfID) {
	var id = clfID.substr(0, clfID.length-1);
	if (window.getSelection) {
		// Firefox
		var selectedText = window.getSelection();
		var selectedRanges = new Array();
		for (var leastID = 0; leastID < 999; leastID++) {
			var node = document.getElementById(id + leastID);
			if (node == null)
				break;
			selectedText.selectAllChildren(node);
			selectedRanges.push(selectedText.getRangeAt(0));
		}
		for (var i=0; i < selectedRanges.length; i++) {
			selectedText.addRange(selectedRanges[i]);
		}
	} else {
		// IE
		var node = document.getElementById(clfID);
		var selection = document.body.createTextRange();
		selection.moveToElementText(node);
		for (var leastID = 1; leastID < 999; leastID++) {
			node = document.getElementById(id + leastID);
			if (node == null)
				break;
			var nodesel = document.body.createTextRange();
			nodesel.moveToElementText(node);
			selection.setEndPoint("EndToEnd", nodesel);
		}
		selection.select();
	}
}
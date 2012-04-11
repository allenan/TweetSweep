function ExtractionResults() {
	this._allCategs = new Array();
	this._categ2isTerm = new Object();
	this._id2isTerm = new Object();
}

ExtractionResults.prototype.addResult = function(categ, name, id, isTerm) {
	if (this[categ] == null) {
		this[categ] = new Object();
		this[categ]._allInstances = new Array();
		this._allCategs.push(categ);
	}
	if (this[categ][name] == null) {
		this[categ][name] = new Array();
		this[categ]._allInstances.push(name);
	}
	this[categ][name].push(id);
	this._categ2isTerm[categ] = isTerm;
	this._id2isTerm[id] = isTerm;
}

ExtractionResults.prototype.getCategs = function() {
	return this._allCategs;
}

ExtractionResults.prototype.getCategTerms = function(categ) {
	return this[categ]._allInstances;
}

ExtractionResults.prototype.unifiedTerms = function(categFrom, termFrom, categTo, termTo) {
	this[categTo][termTo].push(this[categFrom][termFrom]);
}

ExtractionResults.prototype.deleteTerm = function(categ, term) {
	delete this[categ][term];
	for (var i=0; i < this[categ]._allInstances.length; i++) {
		if (this[categ]._allInstances[i] == term) {
			this[categ]._allInstances.splice(i,1);
			break;
		}
	}
}

ExtractionResults.prototype.sort = function() {
	this._allCategs.sortNoCase();
	for (var i=0; i<this._allCategs.length; i++)
		this[this._allCategs[i]]._allInstances.sortNoCase();
}

ExtractionResults.prototype.isTerm = function(categ) {
	return this._categ2isTerm[categ];
}

ExtractionResults.prototype.isTermID = function(id) {
	return this._id2isTerm[id];
}

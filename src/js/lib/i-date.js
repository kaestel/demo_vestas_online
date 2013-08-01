Util.Objects["dateView"] = new function() {
	this.init = function(node) {

		var timestamp = parseInt(node.innerHTML.trim());
		if(new Date(timestamp).getTime()) {
			node.innerHTML = u.date("Y.m.d", timestamp);
		}
		else {
			alert("bad timestamp:" + node.innerHTML);
		}

	}
}


var u, Util = u = new function() {}
u.version = "current";
u.bug = function() {}
u.stats = new function() {this.pageView = function(){};this.event = function(){};this.customVar = function(){}}
Util.testURL = function(url) {
	return document.domain.match(/.local$|^w\./);
}
Util.debug = function(output) {
	if(Util.testURL()) {
		var element, br;
		if(Util.debugWindow && Util.debugWindow.document) {
			element = Util.debugWindow.document.createTextNode(output);
			br = Util.debugWindow.document.createElement('br');
			Util.debugWindow.document.body.appendChild(element);
			Util.debugWindow.document.body.appendChild(br);
			Util.debugWindow.scrollBy(0,1000);
		}
		else {
			Util.openDebugger();
			if(!Util.debugWindow) {
				alert("Disable popup blocker!");
			}
			else {
				Util.debug(output);
			}
		}
	}
}
Util.debugWindow = false;
Util.openDebugger = function() {
	Util.debugWindow = window.open("", "debugWindow", "width=600, height=400, scrollbars=yes, resizable=yes");
	Util.debugWindow.document.body.style.fontFamily = "Courier";
	var element = Util.debugWindow.document.createTextNode("--- new session ---");
	var br = Util.debugWindow.document.createElement('br');
	Util.debugWindow.document.body.appendChild(br);
	Util.debugWindow.document.body.appendChild(element);
	Util.debugWindow.document.body.appendChild(br.cloneNode(br));
	Util.debugWindow.document.body.appendChild(br.cloneNode(br));
}
Util.tracePointer = function(e) {
	if(Util.testURL()) {
		var position = document.createElement("div");
		document.body.appendChild(position);
		position.id = "debug_pointer";
		position.style.position = "absolute";
		position.style.backgroundColor = "#ffffff";
		position.style.color = "#000000";
		this.trackMouse = function(event) {
			u.ge("debug_pointer").innerHTML = event.pageX+"x"+event.pageY;
			u.ge("debug_pointer").style.left = 7+event.pageX+"px";
			u.ge("debug_pointer").style.top = 7+event.pageY+"px";
		}
		u.e.addEvent(e, "mousemove", this.trackMouse);
	}
}
Util.bug = function(target, message, color) {
	if(Util.testURL()) {
		var option, options = new Array(new Array(0, "auto", "auto", 0), new Array(0, 0, "auto", "auto"), new Array("auto", 0, 0, "auto"), new Array("auto", "auto", 0, 0));
		if((!color && !message) || (!color && isNaN(target))) {
			color = message;
			message = target;
			target = 0;
		}
		if(!color) {
			color = "black";
		}
		if(!u.ge("debug_"+target)) {
			for(var i = 0; option = options[i]; i++) {
				if(!u.ge("debug_id_"+i)) {
					var d_target = document.createElement("div");
					document.body.appendChild(d_target);
					d_target.style.position = "absolute";
					d_target.style.zIndex = 100;
					d_target.style.top = option[0];
					d_target.style.right = option[1];
					d_target.style.bottom = option[2];
					d_target.style.left = option[3];
					d_target.style.backgroundColor = "#ffffff";
					d_target.style.color = "#000000";
					d_target.style.textAlign = "left";
					d_target.style.padding = "3px";
					d_target.id = "debug_id_"+i;
					d_target.className = "debug_"+target;
					break;
				}
			}
		}
		u.ae(u.ge("debug_"+target), "div", ({"style":"color: " + color})).innerHTML = message;
	}
}
Util.htmlToText = function(string) {
	return string.replace(/>/g, "&gt;").replace(/</g, "&lt;");
}
Util.listObjectContent = function(object) {
	var x, s = "-s-<br>";
	for(x in object) {
		if(object[x] && typeof(object[x]) == "object" && typeof(object[x].nodeName) == "string") {
			s += x + "=" + object[x]+" -> " + u.nodeId(object[x]) + "<br>";
		}
		else {
			s += x + "=" + object[x]+"<br>";
		}
	}
	s += "-e-"
	return s;
}
Util.nodeId = function(node) {
	return node.id ? node.id : (node.className ? node.className : (node.name ? node.name : node.nodeName));
}
Util.Animation = u.a = new function() {
	this.support = function() {
		var node = document.createElement("div");
		if(node.style[this.variant() + "Transition"] !== undefined) {
			return true;
		}
		return false;
	}
	this.variant = function(e) {
		if(this.implementation == undefined) {
			if(document.body.style.webkitTransition != undefined) {
				this.implementation = "webkit";
			}
			else if(document.body.style.MozTransition != undefined) {
				this.implementation = "Moz";
			}
			else if(document.body.style.oTransition != undefined) {
				this.implementation = "o";
			}
			else {
				this.implementation = "";
			}
		}
		return this.implementation;
	}
	this.translate = function(e, x, y) {
		var variant_string = this.variant();
		if(variant_string == "webkit") {
			e.style[variant_string + "Transform"] = "translate3d("+x+"px, "+y+"px, 0)";
		}
		else {
			e.style[variant_string + "Transform"] = "translate("+x+"px, "+y+"px)";
		}
		e.element_x = x;
		e.element_y = y;
		e._x = x;
		e._y = y;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.rotate = function(e, deg) {
		e.style[this.variant() + "Transform"] = "rotate("+deg+"deg)";
		e._rotation = deg;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.scale = function(e, scale) {
		e.style[this.variant() + "Transform"] = "scale("+scale+")";
		e.scale = scale;
		e._scale = scale;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.setOpacity = function(e, opacity) {
		e.style.opacity = opacity;
		e._opacity = opacity;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.setWidth = function(e, width) {
		var width_px = (width == "auto" ? width : width+"px");
		e.style.width = width_px;
		e._width = width;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.setHeight = function(e, height) {
		var height_px = (height == "auto" ? height : height+"px");
		e.style.height = height_px;
		e._height = height;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.rotateTranslate = function(e, deg, x, y) {
		e.style[this.variant() + "Transform"] = "rotate("+deg+"deg) translate("+x+"px, "+y+"px)";
		e.rotation = deg;
		e.element_x = x;
		e.element_y = y;
		e._rotation = deg;
		e._x = x;
		e._y = y;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.translateRotate = function(e, x, y, deg) {
		e.style[this.variant() + "Transform"] = "translate("+x+"px, "+y+"px) rotate("+deg+"deg)";
		e.element_x = x;
		e.element_y = y;
		e.rotation = deg;
		e._x = x;
		e._y = y;
		e._rotation = deg;
		e.transition_timestamp = new Date().getTime();
		e.offsetHeight;
	}
	this.transition = function(e, transition) {
		try {
			e.style[this.variant() + "Transition"] = transition;
			u.e.addEvent(e, this.variant() + "TransitionEnd", this._transitioned);
			u.e.addEvent(e, "transitionend", this._transitioned);
			var duration = transition.match(/[0-9.]+[ms]+/g);
			if(duration) {
				var d = duration[0];
				e.duration = d.match("ms") ? parseFloat(d) : (parseFloat(d) * 1000);
			}
			else {
				e.duration = false;
			}
			e.offsetHeight;
		}
		catch(exception) {
			u.bug("Exception ("+exception+") in u.a.transition, called from: "+arguments.callee.caller);
		}
	}
	this._transitioned = function(event) {
		if(event.target == this && typeof(this.transitioned) == "function") {
			this.transitioned(event);
		}
	}
	this.fadeIn = function(e, duration) {
		duration = duration == undefined ? "0.5s" : duration;
		u.as(e, "opacity", 0);
		if(u.gcs(e, "display") == "none") {
			u.as(e, "display", "block");
		}
		u.a.transition(e, "all "+duration+" ease-in");
		u.as(e, "opacity", 1);
	}
}

Util.date = function(format, timestamp, months) {
	var date = timestamp ? new Date(timestamp) : new Date();
	if(isNaN(date.getTime())) {
		if(!timestamp.match(/[A-Z]{3}\+[0-9]{4}/)) {
			if(timestamp.match(/ \+[0-9]{4}/)) {
				date = new Date(timestamp.replace(/ (\+[0-9]{4})/, " GMT$1"));
			}
		}
		if(isNaN(date.getTime())) {
			date = new Date();
		}
	}
	var tokens = /d|j|m|n|F|Y|G|H|i|s/g;
	var chars = new Object();
	chars.j = date.getDate();
	chars.d = (chars.j > 9 ? "" : "0") + chars.j;
	chars.n = date.getMonth()+1;
	chars.m = (chars.n > 9 ? "" : "0") + chars.n;
	chars.F = months ? months[date.getMonth()] : "";
	chars.Y = date.getFullYear();
	chars.G = date.getHours();
	chars.H = (chars.G > 9 ? "" : "0") + chars.G;
	var i = date.getMinutes();
	chars.i = (i > 9 ? "" : "0") + i;
	var s = date.getSeconds();
	chars.s = (s > 9 ? "" : "0") + s;
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};

Util.getElement = u.ge = function(identifier, target) {
	var e, i, regexp, t;
	t = target ? target : document;
	if(document.getElementById(identifier)) {
		return document.getElementById(identifier);
	}
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; e = t.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(e.className)) {
			return e;
		}
	}
	return t.getElementsByTagName(identifier).length ? t.getElementsByTagName(identifier)[0] : false;
}
Util.getElements = u.ges = function(identifier, target) {
	var e, i, regexp, t;
	var elements = new Array();
	t = target ? target : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; e = t.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(e.className)) {
			elements.push(e);
		}
	}
	return elements.length ? elements : t.getElementsByTagName(identifier);
}
Util.querySelector = u.qs = function(query, target) {
	t = target ? target : document;
	return t.querySelector(query);
}
Util.querySelectorAll = u.qsa = function(query, target) {
	t = target ? target : document;
	return t.querySelectorAll(query);
}
Util.getSibling = u.gs = function(e, direction) {
	try {
		var node_type = e.nodeType;
		var ready = false;
		var prev_node = false;
		for(var i = 0; node = e.parentNode.childNodes[i]; i++) {
			if(node.nodeType == node_type) {
				if(ready) {
					return node;
				}
				if(node == e) {
					if(direction == "next") {
						ready = true;
					}
					else {
						return prev_node;
					}
				}
				else {
					prev_node = node;
				}
			}
		}
		return false;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.gs, called from: "+arguments.callee.caller);
	}
}
Util.previousSibling = u.ps = function(e, exclude) {
	var node = e.previousSibling;
	if(exclude) {
		while(node && (node.nodeType == 3 || node.nodeType == 8 || node.className.match("(^|\\s)" + exclude + "(\\s|$)") || node.nodeName.match(exclude.toUpperCase()))) {
			node = node.previousSibling;
		}
	}
	else {
		while(node && (node.nodeType == 3 || node.nodeType == 8)) {
			node = node.previousSibling;
		}
	}
	return node;
}
Util.nextSibling = u.ns = function(e, exclude) {
	var node = e.nextSibling;
	if(exclude) {
		while(node && (node.nodeType == 3 || node.nodeType == 8 || node.className.match("(^|\\s)" + exclude + "(\\s|$)") || node.nodeName.match(exclude.toUpperCase()))) {
			node = node.nextSibling;
		}
	}
	else {
		while(node && (node.nodeType == 3 || node.nodeType == 8)) {
			node = node.nextSibling;
		}
	}
	return node;
}
Util.appendElement = u.ae = function(e, node_type, attributes) {
	try {
		var node = e.appendChild(document.createElement(node_type));
		if(attributes) {
			if(typeof(attributes) == "object") {
				for(attribute in attributes) {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
			else {
				u.addClass(node, attributes)
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ae, called from: "+arguments.callee.caller.name);
		u.bug("e="+e + ":nodename="+e.nodeName + ":id="+e.id + ":classname="+e.classname + ":attributes=" + attribute);
	}
}
Util.insertElement = u.ie = function(e, node_type, attributes) {
	try {
		var node = e.insertBefore(document.createElement(node_type), e.firstChild);
		if(attributes) {
			if(typeof(attributes) == "object") {
				for(attribute in attributes) {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
			else {
				u.addClass(node, attributes)
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.getIJ, called from: "+arguments.callee.caller);
	}
}
Util.getIJ = function(e, id) {
	try {
		var regexp = new RegExp(id + ":[?=\\w/\\#~:.?+=?&%@!\\-]*");
		if(e.className.match(regexp)) {
			return e.className.match(regexp)[0].replace(id + ":", "");
		}
		return false;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.getIJ, called from: "+arguments.callee.caller);
	}
}
Util.setClass = u.sc = function(e, classname) {
	try {
		e.className = classname;
		e.offsetTop;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.setClass, called from: "+arguments.callee.caller);
	}
}
Util.addClass = u.ac = function(e, classname) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
			if(!regexp.test(e.className)) {
				e.className += e.className ? " " + classname : classname;
				e.offsetTop;
			}
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.addClass, called from: "+arguments.callee.caller);
	}
}
Util.removeClass = u.rc = function(e, classname) {
	try {
		if(classname) {
			var regexp = new RegExp(classname + " | " + classname + "|" + classname);
			e.className = e.className.replace(regexp, "");
			e.offsetTop;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.removeClass, called from: "+arguments.callee.caller);
	}
}
Util.toggleClass = u.tc = function(e, classname, second_classname) {
	try {
		var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
		if(regexp.test(e.className)) {
			Util.removeClass(e, classname);
			if(second_classname) {
				Util.addClass(e, second_classname);
			}
			return second_classname;
		}
		else {
			Util.addClass(e, classname);
			if(second_classname) {
				Util.removeClass(e, second_classname);
			}
			return classname;
		}
		e.offsetTop;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.toggleClass, called from: "+arguments.callee.caller);
	}
}
Util.hasClass = u.hc = function(e, classname) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
			if(regexp.test(e.className)) {
				return true;
			}
			else {
				return false;
			}
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.hasClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.applyStyle = u.as = function(e, style, value) {
	try {
		e.style[style] = value;
		e.offsetHeight;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.applyStyle("+u.nodeId(e)+", "+style+", "+value+") called from: "+arguments.callee.caller);
	}
}
Util.getComputedStyle = u.gcs = function(e, attribute) {
	e.offsetHeight;
	if(document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(e, null).getPropertyValue(attribute);
	}
	return false;
}
Util.wrapElement = u.we = function(e, wrap, attributes) {
	wrap = e.parentNode.insertBefore(document.createElement(wrap), e);
	if(attributes) {
		for(attribute in attributes) {
			wrap.setAttribute(attribute, attributes[attribute]);
		}
	}
	wrap.appendChild(e);
	return wrap;
}

Util.Events = u.e = new function() {
	this.event_pref = typeof(document.ontouchmove) == "undefined" ? "mouse" : "touch";
	this.kill = function(event) {
		if(event) {
			event.preventDefault();
			event.stopPropagation()
		}
	}
	this.addEvent = function(e, type, action) {
		try {
			e.addEventListener(type, action, false);
		}
		catch(exception) {
			alert("exception in addEvent:" + e + "," + type + ":" + exception);
		}
	}
	this.removeEvent = function(e, type, action) {
		try {
			e.removeEventListener(type, action, false);
		}
		catch(exception) {
			u.bug("exception in removeEvent:" + e + "," + type + ":" + exception);
		}
	}
	this.addStartEvent = this.addDownEvent = function(e, action) {
		u.e.addEvent(e, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.removeStartEvent = this.removeDownEvent = function(e, action) {
		u.e.removeEvent(e, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.addMoveEvent = function(e, action) {
		u.e.addEvent(e, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.removeMoveEvent = function(e, action) {
		u.e.removeEvent(e, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.addEndEvent = this.addUpEvent = function(e, action) {
		u.e.addEvent(e, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(e.snapback && u.e.event_pref == "mouse") {
			u.e.addEvent(e, "mouseout", this._snapback);
		}
	}
	this.removeEndEvent = this.removeUpEvent = function(e, action) {
		u.e.removeEvent(e, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(e.snapback && u.e.event_pref == "mouse") {
			u.e.removeEvent(e, "mouseout", this._snapback);
		}
	}
	this.overlap = function(element, target, strict) {
		if(target.constructor.toString().match("Array")) {
			var target_start_x = Number(target[0]);
			var target_start_y = Number(target[1]);
			var target_end_x = Number(target[2]);
			var target_end_y = Number(target[3]);
		}
		else {
			var target_start_x = target.element_x ? target.element_x : 0;
			var target_start_y = target.element_y ? target.element_y : 0;
			var target_end_x = Number(target_start_x + target.offsetWidth);
			var target_end_y = Number(target_start_y + target.offsetHeight);
		}
		var element_start_x = Number(element.element_x);
		var element_start_y = Number(element.element_y);
		var element_end_x = Number(element_start_x + element.offsetWidth);
		var element_end_y = Number(element_start_y + element.offsetHeight);
		if(strict && element_start_x >= target_start_x && element_start_y >= target_start_y && element_end_x <= target_end_x && element_end_y <= target_end_y) {
			return true;
		}
		else if(strict) {
			return false;
		}
		else if(element_end_x < target_start_x || element_start_x > target_end_x || element_end_y < target_start_y || element_start_y > target_end_y) {
			return false;
		}
		return true;
	}
	this.resetClickEvents = function(e) {
		u.t.resetTimer(e.t_held);
		u.t.resetTimer(e.t_clicked);
		this.removeEvent(e, "mouseup", this._dblclicked);
		this.removeEvent(e, "touchend", this._dblclicked);
		this.removeEvent(e, "mousemove", this._clickCancel);
		this.removeEvent(e, "touchmove", this._clickCancel);
		this.removeEvent(e, "mousemove", this._move);
		this.removeEvent(e, "touchmove", this._move);
	}
	this.resetDragEvents = function(e) {
		this.removeEvent(e, "mousemove", this._pick);
		this.removeEvent(e, "touchmove", this._pick);
		this.removeEvent(e, "mousemove", this._drag);
		this.removeEvent(e, "touchmove", this._drag);
		this.removeEvent(e, "mouseup", this._drop);
		this.removeEvent(e, "touchend", this._drop);
		this.removeEvent(e, "mouseout", this._snapback);
		this.removeEvent(e, "mouseout", this._drop);
	}
	this.resetEvents = function(e) {
		this.resetClickEvents(e);
		this.resetDragEvents(e);
	}
	this.resetNestedEvents = function(e) {
		while(e && e.nodeName != "HTML") {
			this.resetEvents(e);
			e = e.parentNode;
		}
	}
	this._inputStart = function(event) {
		this.event_var = event;
		this.input_timestamp = new Date().getTime();
		this.start_event_x = u.eventX(event);
		this.start_event_y = u.eventY(event);
		this.current_xps = 0;
		this.current_yps = 0;
		this.swiped = false;
		if(this.e_click || this.e_dblclick || this.e_hold) {
			var node = this;
			while(node) {
				if(node.e_drag || node.e_swipe) {
					u.e.addMoveEvent(this, u.e._clickCancel);
					break;
				}
				else {
					node = node.parentNode;
				}
			}
			u.e.addMoveEvent(this, u.e._move);
			u.e.addEndEvent(this, u.e._dblclicked);
		}
		if(this.e_hold) {
			this.t_held = u.t.setTimer(this, u.e._held, 750);
		}
		if(this.e_drag || this.e_swipe) {
			u.e.addMoveEvent(this, u.e._pick);
			u.e.addEndEvent(this, u.e._drop);
		}
		if(typeof(this.inputStarted) == "function") {
			this.inputStarted(event);
		}
	}
	this._cancelClick = function(event) {
		u.e.resetClickEvents(this);
		if(typeof(this.clickCancelled) == "function") {
			this.clickCancelled(event);
		}
	}
	this._move = function(event) {
		if(typeof(this.moved) == "function") {
			this.moved(event);
		}
	}
	this.hold = function(e) {
		e.e_hold = true;
		u.e.addStartEvent(e, this._inputStart);
	}
	this._held = function(event) {
		u.e.resetEvents(this);
		if(typeof(this.held) == "function") {
			this.held(event);
		}
	}
	this.click = this.tap = function(e) {
		e.e_click = true;
		u.e.addStartEvent(e, this._inputStart);
	}
	this._clicked = function(event) {
		u.stats.event(this, "clicked");
		u.e.resetNestedEvents(this);
		if(typeof(this.clicked) == "function") {
			this.clicked(event);
		}
	}
	this.dblclick = this.doubletap = function(e) {
		e.e_dblclick = true;
		u.e.addStartEvent(e, this._inputStart);
	}
	this._dblclicked = function(event) {
		if(u.t.valid(this.t_clicked) && event) {
			u.e.resetNestedEvents(this);
			if(typeof(this.dblclicked) == "function") {
				this.dblclicked(event);
			}
			return;
		}
		else if(!this.e_dblclick) {
			this._clicked = u.e._clicked;
			this._clicked(event);
		}
		else if(!event) {
			this._clicked = u.e._clicked;
			this._clicked(this.event_var);
		}
		else {
			u.e.resetNestedEvents(this);
			this.t_clicked = u.t.setTimer(this, u.e._dblclicked, 400);
		}
	}
	this.drag = function(e, target, strict, snapback) {
		e.e_drag = true;
		e.strict = strict ? true : false;
		e.allowed_offset = e.strict ? 0 : 250;
		e.elastica = 2;
		e.snapback = snapback ? true : false;
		if(target.constructor.toString().match("Array")) {
			e.start_drag_x = Number(target[0]);
			e.start_drag_y = Number(target[1]);
			e.end_drag_x = Number(target[2]);
			e.end_drag_y = Number(target[3]);
		}
		else {
			e.start_drag_x = target.element_x ? target.element_x : 0;
			e.start_drag_y = target.element_y ? target.element_y : 0;
			e.end_drag_x = Number(e.start_drag_x + target.offsetWidth);
			e.end_drag_y = Number(e.start_drag_y + target.offsetHeight);
		}
		e.element_x = e.element_x ? e.element_x : 0;
		e.element_y = e.element_y ? e.element_y : 0;
		e.locked = ((e.end_drag_x - e.start_drag_x == e.offsetWidth) && (e.end_drag_y - e.start_drag_y == e.offsetHeight));
		e.vertical = (!e.locked && e.end_drag_x - e.start_drag_x == e.offsetWidth);
		e.horisontal = (!e.locked && e.end_drag_y - e.start_drag_y == e.offsetHeight);
		u.e.addStartEvent(e, this._inputStart);
	}
	this._pick = function(event) {
		var init_speed_x = Math.abs(this.start_event_x - u.eventX(event));
		var init_speed_y = Math.abs(this.start_event_y - u.eventY(event));
		u.e.resetNestedEvents(this);
		if(init_speed_x > init_speed_y && this.horisontal || init_speed_x < init_speed_y && this.vertical || !this.vertical && !this.horisontal) {
		    u.e.kill(event);
			this.move_timestamp = new Date().getTime();
			this.current_xps = 0;
			this.current_yps = 0;
			this.start_input_x = u.eventX(event) - this.element_x; // - u.absLeft(this);//(event.targetTouches ? event.targetTouches[0].pageX : event.pageX);
			this.start_input_y = u.eventY(event) - this.element_y; // - u.absTop(this);//.targetTouches ? event.targetTouches[0].pageY : event.pageY);
			u.a.transition(this, "none");
			if(typeof(this.picked) == "function") {
				this.picked(event);
			}
			u.e.addMoveEvent(this, u.e._drag);
			u.e.addEndEvent(this, u.e._drop);
		}
	}
	this._drag = function(event) {
			this.new_move_timestamp = new Date().getTime();
				var offset = false;
				this.current_x = u.eventX(event) - this.start_input_x;
				this.current_y = u.eventY(event) - this.start_input_y;
					this.current_xps = Math.round(((this.current_x - this.element_x) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
					this.current_yps = Math.round(((this.current_y - this.element_y) / (this.new_move_timestamp - this.move_timestamp)) * 1000);
				this.move_timestamp = this.new_move_timestamp;
				if(this.vertical) {
					this.element_y = this.current_y;
				}
				else if(this.horisontal) {
					this.element_x = this.current_x;
				}
				else if(!this.locked) {
					this.element_x = this.current_x;
					this.element_y = this.current_y;
				}
				if(!this.locked) {
					if(u.e.overlap(this, new Array(this.start_drag_x, this.start_drag_y, this.end_drag_x, this.end_drag_y), true)) {
						if(this.current_xps && (Math.abs(this.current_xps) > Math.abs(this.current_yps) || this.horisontal)) {
							if(this.current_xps < 0) {
								this.swiped = "left";
							}
							else {
								this.swiped = "right";
							}
						}
						else if(this.current_yps && (Math.abs(this.current_xps) < Math.abs(this.current_yps) || this.vertical)) {
							if(this.current_yps < 0) {
								this.swiped = "up";
							}
							else {
								this.swiped = "down";
							}
						}
						u.a.translate(this, this.element_x, this.element_y);
					}
					else {
						this.swiped = false;
						this.current_xps = 0;
						this.current_yps = 0;
						if(this.element_x < this.start_drag_x && !this.vertical) {
							offset = this.element_x < this.start_drag_x - this.allowed_offset ? - this.allowed_offset : this.element_x - this.start_drag_x;
							this.element_x = this.start_drag_x;
							this.current_x = this.element_x + offset + (Math.round(Math.pow(offset, 2)/this.allowed_offset)/this.elastica);
						}
						else if(this.element_x + this.offsetWidth > this.end_drag_x && !this.vertical) {
							offset = this.element_x + this.offsetWidth > this.end_drag_x + this.allowed_offset ? this.allowed_offset : this.element_x + this.offsetWidth - this.end_drag_x;
							this.element_x = this.end_drag_x - this.offsetWidth;
							this.current_x = this.element_x + offset - (Math.round(Math.pow(offset, 2)/this.allowed_offset)/this.elastica);
						}
						else {
							this.current_x = this.element_x;
						}
						if(this.element_y < this.start_drag_y && !this.horisontal) {
							offset = this.element_y < this.start_drag_y - this.allowed_offset ? - this.allowed_offset : this.element_y - this.start_drag_y;
							this.element_y = this.start_drag_y;
							this.current_y = this.element_y + offset + (Math.round(Math.pow(offset, 2)/this.allowed_offset)/this.elastica);
						}
						else if(this.element_y + this.offsetHeight > this.end_drag_y && !this.horisontal) {
							offset = (this.element_y + this.offsetHeight > this.end_drag_y + this.allowed_offset) ? this.allowed_offset : (this.element_y + this.offsetHeight - this.end_drag_y);
							this.element_y = this.end_drag_y - this.offsetHeight;
							this.current_y = this.element_y + offset - (Math.round(Math.pow(offset, 2)/this.allowed_offset)/this.elastica);
						}
						else {
							this.current_y = this.element_y;
						}
						if(offset) {
							u.a.translate(this, this.current_x, this.current_y);
						}
					}
				}
			if(typeof(this.moved) == "function") {
				this.moved(event);
			}
	}
	this._drop = function(event) {
		u.e.resetEvents(this);
		if(this.e_swipe && this.swiped) {
			if(this.swiped == "left") {
				if(typeof(this.swipedLeft) == "function") {
					this.swipedLeft(event);
				}
			}
			else if(this.swiped == "right") {
				if(typeof(this.swipedRight) == "function") {
					this.swipedRight(event);
				}
			}
			else if(this.swiped == "down") {
				if(typeof(this.swipedDown) == "function") {
					this.swipedDown(event);
				}
			}
			else if(this.swiped == "up") {
				if(typeof(this.swipedUp) == "function") {
					this.swipedUp(event);
				}
			}
		}
		else if(!this.locked && this.start_input_x && this.start_input_y) {
			this.start_input_x = false;
			this.start_input_y = false;
			this.current_x = this.element_x + (this.current_xps/2);
			this.current_y = this.element_y + (this.current_yps/2);
			if(this.current_x < this.start_drag_x) {
				this.current_x = this.start_drag_x;
			}
			else if(this.current_x + this.offsetWidth > this.end_drag_x) {
				this.current_x = this.end_drag_x - this.offsetWidth;
			}
			if(this.current_y < this.start_drag_y) {
				this.current_y = this.start_drag_y;
			}
			else if(this.current_y + this.offsetHeight > this.end_drag_y) {
				this.current_y = this.end_drag_y - this.offsetHeight;
			}
			if(!this.strict && (this.current_xps || this.current_yps)) {
				u.a.transition(this, "all 1s cubic-bezier(0,0,0.25,1)");
			}
			else {
				u.a.transition(this, "all 0.1s cubic-bezier(0,0,0.25,1)");
			}
			u.a.translate(this, this.current_x, this.current_y);
		}
		if(typeof(this.dropped) == "function") {
			this.dropped(event);
		}
	}
	this.swipe = function(e, target, strict) {
		e.e_swipe = true;
		u.e.drag(e, target, strict);
	}
	this._swipe = function(event) {
	}
	this._snapback = function(event) {
	    u.e.kill(event);
		u.bug(2, "snap")
		if(this.start_input_x && this.start_input_y) {
			input_x = event.targetTouches ? event.targetTouches[0].pageX : event.pageX;
			input_y = event.targetTouches ? event.targetTouches[0].pageY : event.pageY;
			offset_x = 0;
			offset_y = 0;
			if(this.vertical) {
				offset_y = input_y - this.current_y;
			}
			else if(this.horisontal) {
				offset_x = input_x - this.current_x;
			}
			else {
				offset_x = input_x - this.current_x;
				offset_y = input_y - this.current_y;
			}
			u.a.translate(this, (this.element_x+offset_x), (this.element_y+offset_y));
		}
	}
}

Util.Form = u.f = new function() {
	this.init = function(form) {
		var i, o;
		form.onsubmit = function(event) {
			alert("bad submit!")
			return false;
		}
		form.setAttribute("novalidate", "novalidate");
		form._submit = this._submit;
		form.fields = new Object();
		form.field_order = new Array();
		form.actions = new Object();
		var fields = u.qsa(".field", form);
		for(i = 0; field = fields[i]; i++) {
			var abbr = u.qs("abbr", field);
			if(abbr) {
				abbr.parentNode.removeChild(abbr);
			}
			field.lN = u.qs("label", field);
			field._form = form;
			field._required = field.className.match(/required/);
			if(u.hasClass(field, "string|email|tel")) {
				field.iN = u.qs("input", field);
				field.iN.field = field;
				field.iN.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "keyup", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
				this.submitOnEnter(field.iN);
			}
			if(field.className.match(/numeric/)) {
				field.iN = u.qs("input", field);
				field.iN.field = field;
				field.iN.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "keyup", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
				this.submitOnEnter(field.iN);
			}
			if(field.className.match(/text/)) {
				field.iN = u.qs("textarea", field);
				field.iN.field = field;
				field.iN.val = function(value) {if(value !== undefined) {this.value = value;} else {return this.value;}}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "keyup", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
				u.as(field.iN, "height", field.iN.scrollHeight+"px");
				field.iN.offset = 0;
				if(parseInt(u.gcs(field.iN, "height")) != field.iN.scrollHeight) {
					field.iN.offset = field.iN.scrollHeight - parseInt(u.gcs(field.iN, "height"));
				}
				u.as(field.iN, "height", (field.iN.scrollHeight - field.iN.offset) +"px");
				field.iN.setHeight = function() {
					var height = parseInt(u.gcs(this, "height")) + this.offset;
					if(this.value && this.scrollHeight > height) {
						u.as(this, "height", (this.scrollHeight - this.offset) +"px");
					}
				}
				u.e.addEvent(field.iN, "keyup", field.iN.setHeight);
			}
			if(field.className.match(/select/)) {
				field.iN = u.qs("select", field);
				field.iN.field = field;
				field.iN.val = function(value) {
					if(value !== undefined) {
						var i, option;
						for(i = 0; option = this.options[i]; i++) {
							if(option.value == value) {
								this.selectedIndex = i;
								return i;
							}
						}
						return false;
					}
					else {
						return this.options[this.selectedIndex].value;
					}
				}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "change", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
			}
			if(field.className.match(/checkbox|boolean/)) {
				field.iN = u.qs("input[type=checkbox]", field);
				field.iN.field = field;
				field.iN.val = function(value) {
					if(value) {
						this.checked = true
					}
					else {
						if(this.checked) {
							return this.value;
						}
					}
					return false;
				}
				form.fields[field.iN.name] = field.iN;
				field.iN.field_order = form.field_order.length;
				form.field_order[form.field_order.length] = field.iN;
				this.activate(field.iN);
				this.validate(field.iN);
				u.e.addEvent(field.iN, "change", this._update);
				u.e.addEvent(field.iN, "change", this._changed);
			}
			if(field.className.match(/radio/)) {
				field.iNs = u.qsa("input", field);
				var j, radio;
				for(j = 0; radio = field.iNs[j]; j++) {
					radio.field = field;
					radio.val = function(value) {
						if(value) {
							for(i = 0; option = this.field._form[this.name][i]; i++) {
								if(option.value == value) {
									option.checked = true;
								}
							}
						}
						else {
							var i, option;
							for(i = 0; option = this.field._form[this.name][i]; i++) {
								if(option.checked) {
									return option.value;
								}
							}
						}
						return false;
					}
					form.fields[radio.name] = radio;
					radio.field_order = form.field_order.length;
					form.field_order[form.field_order.length] = radio;
					this.activate(radio);
					this.validate(radio);
					u.e.addEvent(radio, "change", this._update);
					u.e.addEvent(radio, "change", this._changed);
				}
			}
			if(field.className.match(/date/)) {
				if(typeof(this.customInit) == "object" && typeof(this.customInit["date"]) == "function") {
					this.customInit["date"](field);
				}
				else {
					field.iNs = u.qsa("select,input", field);
					var date = field.iNs[0];
					this.submitOnEnter(date);
					date.field = field;
					var month = field.iNs[1];
					this.submitOnEnter(month);
					month.field = field;
					var year = field.iNs[2];
					this.submitOnEnter(year);
					year.field = field;
					this.activate(date);
					this.activate(month);
					this.activate(year);
					u.e.addEvent(date, "change", this._validateInput);
					u.e.addEvent(month, "change", this._validateInput);
					u.e.addEvent(year, "change", this._validateInput);
					this.validate(date)
					this.validate(month)
					this.validate(year)
				}
			}
		}
		var hidden_fields = u.qsa("input[type=hidden]", form);
		for(i = 0; hidden_field = hidden_fields[i]; i++) {
			if(!form.fields[hidden_field.name]) {
				form.fields[hidden_field.name] = hidden_field;
				hidden_field.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
			}
		}
		var actions = u.qsa(".actions li", form);
		for(i = 0; action = actions[i]; i++) {
			action.iN = u.qs("input,a", action);
			if(typeof(action.iN) == "object" && action.iN.type == "submit") {
				action.iN.onclick = function(event) {u.e.kill(event ? event : window.event);}
				u.e.click(action.iN);
				action.iN.clicked = function(event) {
					u.e.kill(event);
					if(!u.hasClass(this, "disabled")) {
						this.form.submitButton = this;
						this.form.submitInput = false;
						this.form._submit(event);
					}
				}
			}
			if(typeof(action.iN) == "object" && action.iN.name) {
				form.actions[action.iN.name] = action;
			}
		}
	}
	this._changed = function(event) {
		if(typeof(this.changed) == "function") {
			this.changed(this);
		}
		if(typeof(this.field._form.changed) == "function") {
			this.field._form.changed(this);
		}
	}
	this._update = function(event) {
		if(event.keyCode != 9 && event.keyCode != 13 && event.keyCode != 16 && event.keyCode != 17 && event.keyCode != 18) {
			if(typeof(this.updated) == "function") {
				this.updated(this);
			}
			if(typeof(this.field._form.updated) == "function") {
				this.field._form.updated(this);
			}
		}
	}
	this._submit = function(event, iN) {
		for(name in this.fields) {
			if(this.fields[name].field) {
				this.fields[name].used = true;
				u.f.validate(this.fields[name]);
			}
		}
		if(u.qs(".field.error", this)) {
			if(typeof(this.validationFailed) == "function") {
				this.validationFailed();
			}
		}
		else {
			if(typeof(this.submitted) == "function") {
				this.submitted(iN);
			}
			else {
				this.submit();
			}
		}
	}
	this._validate = function() {
		u.f.validate(this);
	}
	this.submitOnEnter = function(iN) {
		iN.onkeydown = function(event) {
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.field._form.submitInput = this;
				this.field._form.submitButton = false;
				this.field._form._submit(event);
			}
		}
	}
	this.activate = function(iN) {
		this._focus = function(event) {
			this.field.focused = true;
			u.ac(this.field, "focus");
			u.ac(this, "focus");
			this.used = true;
		}
		this._blur = function(event) {
			this.field.focused = false;
			u.rc(this.field, "focus");
			u.rc(this, "focus");
		}
		u.e.addEvent(iN, "focus", this._focus);
		u.e.addEvent(iN, "blur", this._blur);
		u.e.addEvent(iN, "blur", this._validate);
	}
	this.isDefault = function(iN) {
		if(iN.field.default_value && iN.val() == iN.field.default_value) {
			return true;
		}
		return false;
	}
	this.fieldError = function(iN) {
		u.rc(iN, "correct");
		u.rc(iN.field, "correct");
		if(iN.used || !this.isDefault(iN) && iN.val()) {
			u.ac(iN, "error");
			u.ac(iN.field, "error");
			if(typeof(iN.validationFailed) == "function") {
				iN.validationFailed();
			}
		}
	}
	this.fieldCorrect = function(iN) {
		if(!this.isDefault(iN) && iN.val()) {
			u.ac(iN, "correct");
			u.ac(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
		else {
			u.rc(iN, "correct");
			u.rc(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
	}
	this.validate = function(iN) {
		if(u.hc(iN.field, "string")) {
			if((iN.value.length > 1 && !this.isDefault(iN)) || !iN.field._required) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "numeric")) {
			if((iN.value && !isNaN(iN.value) && !this.isDefault(iN)) || (!iN.field._required && !iN.value)) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "tel")) {
			if((iN.value.match(/^([\+0-9\-\.\s]){5,14}$/) && !this.isDefault(iN)) || (!iN.field._required && !iN.value)) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "email")) {
			if((iN.value.match(/^([^<>\\\/%$])+\@([^<>\\\/%$])+\.([^<>\\\/%$]{2,20})$/) && !this.isDefault(iN)) || (!iN.field._required && !iN.value)) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "text")) {
			if((iN.value.length > 2 && !this.isDefault(iN)) || !iN.field._required) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "select")) {
			if(iN.options[iN.selectedIndex].value != "" || !iN.field._required) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "checkbox|radio|boolean")) {
			if(iN.val() != "" || !iN.field._required) {
				this.fieldCorrect(iN);
			}
			else {
				this.fieldError(iN);
			}
		}
		if(u.hc(iN.field, "date")) {
			if(typeof(u.f.customValidate) == "object" && typeof(u.f.customValidate["date"]) == "function") {
				u.f.customValidate["date"](iN);
			}
			else {
			}
		}
		if(u.hc(iN.field, "error")) {
			return false;
		}
		else {
			return true;
		}
	}
	this.getParams = function(form) {
		var type = "parameters";
		var ignore = false;
		if(arguments.length > 1 && typeof(arguments[1]) == "object") {
			for(argument in arguments[1]) {
				switch(argument) {
					case "type": type = arguments[1][argument]; break;
					case "ignore" : ignore = new RegExp("(^|\\s)" + arguments[1][argument] + "(\\s|$)"); break;
				}
			}
		}
		var i, input, select, textarea, param;
		params = new Object();
		if(form.submitButton && form.submitButton.name) {
			params[form.submitButton.name] = form.submitButton.value;
		}
		var inputs = u.qsa("input", form);
		var selects = u.qsa("select", form)
		var textareas = u.qsa("textarea", form)
		for(i = 0; input = inputs[i]; i++) {
			if(!input.className.match(/ignoreinput/i) && (!ignore || !input.className.match(ignore))) {
				if((input.type == "checkbox" || input.type == "radio") && input.checked) {
					params[input.name] = input.value;
				}
				else if(!input.type.match(/button|submit|checkbox|radio/i)) {
					params[input.name] = input.value;
				}
			}
		}
		for(i = 0; select = selects[i]; i++) {
			if(!select.className.match(/ignoreinput/i) && (!ignore || !select.className.match(ignore))) {
				params[select.name] = select.options[select.selectedIndex].value;
			}
		}
		for(i = 0; textarea = textareas[i]; i++) {
			if(!textarea.className.match(/ignoreinput/i) && (!ignore || !textarea.className.match(ignore))) {
				params[textarea.name] = textarea.value;
			}
		}
		if(typeof(this.customSend) == "object" && typeof(this.customSend[type]) == "function") {
			return this.customSend[type](params, form);
		}
		else if(type == "parameters") {
			var string = "";
			for(param in params) {
				string += param + "=" + encodeURIComponent(params[param]) + "&";
			}
			return string;
		}
		else if(type == "json") {
			object = u.f.convertNamesToJsonObject(params);
			return JSON.stringify(object);
		}
		else if(type == "object") {
			return params;
		}
	}
}
u.f.convertNamesToJsonObject = function(params) {
 	var indexes, root, indexes_exsists;
	var object = new Object();
	for(param in params) {
	 	indexes_exsists = param.match(/\[/);
		if(indexes_exsists) {
			root = param.split("[")[0];
			indexes = param.replace(root, "");
			if(typeof(object[root]) == "undefined") {
				object[root] = new Object();
			}
			object[root] = this.recurseName(object[root], indexes, params[param]);
		}
		else {
			object[param] = params[param];
		}
	}
	return object;
}
u.f.recurseName = function(object, indexes, value) {
	var index = indexes.match(/\[([a-zA-Z0-9\-\_]+)\]/);
	var current_index = index[1];
	indexes = indexes.replace(index[0], "");
 	if(indexes.match(/\[/)) {
		if(object.length !== undefined) {
			var i;
			var added = false;
			for(i = 0; i < object.length; i++) {
				for(exsiting_index in object[i]) {
					if(exsiting_index == current_index) {
						object[i][exsiting_index] = this.recurseName(object[i][exsiting_index], indexes, value);
						added = true;
					}
				}
			}
			if(!added) {
				temp = new Object();
				temp[current_index] = new Object();
				temp[current_index] = this.recurseName(temp[current_index], indexes, value);
				object.push(temp);
			}
		}
		else if(typeof(object[current_index]) != "undefined") {
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
		else {
			object[current_index] = new Object();
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
	}
	else {
		object[current_index] = value;
	}
	return object;
}
Util.Image = u.i = new function() {
	this.load = function(e, src) {
		var image = new Image();
		image.e = e;
		u.addClass(e, "loading");
	    u.e.addEvent(image, 'load', u.i._loaded);
		image.src = src;
	}
	this._loaded = function(event) {
		u.removeClass(this.e, "loading");
		if(typeof(this.e.loaded) == "function") {
			this.e.loaded(event);
		}
	}
	this._progress = function(event) {
		u.bug("progress")
		if(typeof(this.e.progress) == "function") {
			this.e.progress(event);
		}
	}
	this._debug = function(event) {
		u.bug("event:" + event.type);
	}
}

Util.link = function(e) {
	var a = u.qs("a", e);
	u.addClass(e, "link");
	e.url = a.href;
	a.removeAttribute("href");
	u.e.click(e);
}

Util.absoluteX = u.absX = function(e) {
	if(e.offsetParent) {
		return e.offsetLeft + u.absX(e.offsetParent);
	}
	return e.offsetLeft;
}
Util.absoluteY = u.absY = function(e) {
	if(e.offsetParent) {
		return e.offsetTop + u.absY(e.offsetParent);
	}
	return e.offsetTop;
}
Util.relativeX = u.relX = function(e) {
	if(u.gcs(e, "position").match(/absolute/) == null && e.offsetParent && u.gcs(e.offsetParent, "position").match(/relative|absolute/) == null) {
		return e.offsetLeft + u.relX(e.offsetParent);
	}
	return e.offsetLeft;
}
Util.relativeY = u.relY = function(e) {
	if(u.gcs(e, "position").match(/relative|absolute/) == null && e.offsetParent && u.gcs(e.offsetParent, "position").match(/relative|absolute/) == null) {
		return e.offsetTop + u.relY(e.offsetParent);
	}
	return e.offsetTop;
}
Util.relativeOffsetX = u.relOffsetX = function(e) {
	if(e.offsetParent && u.gcs(e.offsetParent, "position").match(/relative|absoute/) != null) {
		return u.absX(e.offsetParent); // - e.offsetLeft u.relOffsetX(e.offsetParent);
	}
	return 0; //u.absX(e) - e.offsetLeft;
}
Util.relativeOffsetY = u.relOffsetY = function(e) {
	if(e.offsetParent && u.gcs(e.offsetParent, "position").match(/relative|absoute/) != null) {
		return u.absY(e.offsetParent);
	}
	return 0; // u.absY(e) - e.offsetTop;
}
Util.actualWidth = function(e) {
	return parseInt(u.gcs(e, "width"));
}
Util.actualHeight = function(e) {
	return parseInt(u.gcs(e, "height"));
}
Util.eventX = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageX : event.pageX);
}
Util.eventY = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageY : event.pageY);
}
Util.browserWidth = u.browserW = function() {
	return document.documentElement.clientWidth;
}
Util.browserHeight = u.browserH = function() {
	return document.documentElement.clientHeight;
}
Util.htmlWidth = u.htmlW = function() {
	return document.documentElement.offsetWidth;
}
Util.htmlHeight = u.htmlH = function() {
	return document.documentElement.offsetHeight;
}
Util.pageScrollX = u.scrollX = function() {
	return window.pageXOffset;
}
Util.pageScrollY = u.scrollY = function() {
	return window.pageYOffset;
}

Util.createRequestObject = function(type) {
	var request_object = false;
		try {
			request_object = new XMLHttpRequest();
		}
		catch(e){
			request_object = new ActiveXObject("Microsoft.XMLHTTP");
		}
	if(request_object) {
		return request_object;
	}
	u.bug("Could not create HTTP Object");
	return false;
}
Util.Request = function(node, url, parameters, method, async) {
	if(typeof(node) != "object") {
		var node = new Object();
	}
	node.url = url;
	node.parameters = parameters ? parameters : "";
	node.method = method ? method : "GET";
	node.async = async ? async : false;
	if(node.method.match(/GET|POST|PUT|PATCH/i)) {
		node.HTTPRequest = this.createRequestObject();
		node.HTTPRequest.node = node;
		if(node.async) {
			node.HTTPRequest.onreadystatechange = function() {
				if(node.HTTPRequest.readyState == 4) {
					u.validateResponse(this);
				}
			}
		}
		try {
			if(node.method.match(/GET/i)) {
				node.url += node.parameters ? ((!node.url.match(/\?/g) ? "?" : "&") + node.parameters) : "";
				node.HTTPRequest.open(node.method, node.url, node.async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				node.HTTPRequest.send();
			}
			else if(node.method.match(/POST|PUT|PATCH/i)) {
				node.HTTPRequest.open(node.method, node.url, node.async);
				node.HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node.HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				node.HTTPRequest.send(node.parameters);
			}
		}
		catch(e) {
			u.bug("request exception:" + e);
			u.validateResponse(node.HTTPRequest);
			return;
		}
		if(!async) {
			u.validateResponse(node.HTTPRequest);
		}
	}
	else if(node.method.match(/SCRIPT/i)) {
		node.url = url;
		var key = u.randomString();
		document[key] = new Object();
		document[key].node = node;
		document[key].responder = function(response) {
			var response_object = new Object();
			response_object.node = this.node;
			response_object.responseText = response;
			u.validateResponse(response_object);
		}
		u.ae(u.qs("head"), "script", ({"type":"text/javascript", "src":node.url + "?" + parameters + "&callback=document."+key+".responder"}));
	}
}
Util.requestParameters = function() {
	u.bug("params:" + arguments.length)
}
Util.testResponseForJSON = function(responseText) {
	if(responseText.trim().substr(0, 1).match(/[\{\[]/i) && responseText.trim().substr(-1, 1).match(/[\}\]]/i)) {
		try {
			var test = eval("("+responseText+")");
			if(typeof(test) == "object") {
				test.isJSON = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.testResponseForHTML = function(responseText) {
	if(responseText.trim().substr(0, 1).match(/[\<]/i) && responseText.trim().substr(-1, 1).match(/[\>]/i)) {
		try {
			var test = document.createElement("div");
			test.innerHTML = responseText;
			if(test.childNodes.length) {
				var body_class = responseText.match(/<body class="([a-z0-9A-Z_ ]+)"/);
				test.body_class = body_class ? body_class[1] : "";
				var head_title = responseText.match(/<title>([^$]+)<\/title>/);
				test.head_title = head_title ? head_title[1] : "";
				test.isHTML = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.evaluateResponse = function(responseText) {
	var object;
	if(typeof(responseText) == "object") {
		responseText.isJSON = true;
		return responseText;
	}
	else {
		if(responseText.trim().substr(0, 1).match(/[\"\']/i) && responseText.trim().substr(-1, 1).match(/[\"\']/i)) {
				response_string = responseText.trim();
				var json = u.testResponseForJSON(response_string.substr(1, response_string.length-2));
				if(json) {
					return json;
				}
				var html = u.testResponseForHTML(response_string.substr(1, response_string.length-2));
				if(html) {
					return html;
				}
				return responseText;
		}
		var json = u.testResponseForJSON(responseText);
		if(json) {
			return json;
		}
		var html = u.testResponseForHTML(responseText);
		if(html) {
			return html;
		}
		return responseText;
	}
}
Util.validateResponse = function(response){
	var object;
	if(response) {
		try {
			if(response.status) {
				if(!response.status.toString().match(/403|404|500/)) {
					object = u.evaluateResponse(response.responseText);
				}
			}
			else {
				if(response.responseText) {
					object = u.evaluateResponse(response.responseText);
				}
			}
		}
		catch(exception) {
			u.bug("HTTPRequest exection:" + e);
		}
	}
	if(typeof(response.node.Response) == "function") {
		response.node.Response(object);
	}
}

Util.cutString = function(string, length) {
	var matches, i;
	if(string.length <= length) {
		return string;
	}
	else {
	length = length-3;
	}
	matches = string.match(/\&[\w\d]+\;/g);
	if(matches) {
		for(i = 0; match = matches[i]; i++){
			if(string.indexOf(match) < length){
				length += match.length-1;
			}
		}
	}
	return string.substring(0, length) + (string.length > length ? "..." : "");
}
Util.random = function(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}
Util.randomKey = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "1234567890abcdefghijklmnopqrstuvwxyz".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.randomString = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.uuid = function() {
	var chars = '0123456789abcdef'.split('');
	var uuid = [], rnd = Math.random, r, i;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4';
	for(i = 0; i < 36; i++) {
		if(!uuid[i]) {
			r = 0 | rnd()*16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
 	}
	return uuid.join('');
}
Util.stringOr = function(value, replacement) {
	if(value !== undefined && value !== null) {
		return value;
	}
	else {
		return replacement ? replacement : "";
	}	
}
Util.Timer = u.t = new function() {
	this.actions = new Array();
	this.objects = new Array();
	this.timers = new Array();
	this.setTimer = function(object, action, timeout) {
		var id = this.actions.length;
		this.actions[id] = action;
		this.objects[id] = object;
		this.timers[id] = setTimeout("u.t.execute("+id+")", timeout);
		return id;
	}
	this.resetTimer = function(id) {
		clearTimeout(this.timers[id]);
		this.objects[id] = false;
	}
	this.execute = function(id) {
		this.objects[id].exe = this.actions[id];
		this.objects[id].exe();
		this.objects[id].exe = null;
		this.actions[id] = null;
		this.objects[id] = false;
		this.timers[id] = null;
	}
	this.valid = function(id) {
		return this.objects[id] ? true : false;
	}
}

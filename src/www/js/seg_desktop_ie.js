
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
if(String.prototype.trim == undefined) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	};
}
if(Object.prototype.textContent == undefined && Object.defineProperty) {
	Object.defineProperty(Element.prototype, "textContent",
		{get: function() {
			return this.innerText;
			}
		}
	);
}
else if(Object.prototype.textContent == undefined) {
}
if(String.prototype.substr == undefined || "ABC".substr(-1,1) == "A") {
	String.prototype.substr = function(start_index, length) {
		start_index = start_index < 0 ? this.length + start_index : start_index;
		start_index = start_index < 0 ? 0 : start_index;
		length = length ? start_index + length : this.length;
		return this.substring(start_index, length);
	};
}
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
Util.getComputedStyle = u.gcs = function(e, attribute) {
	e.offsetHeight;
	if(document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(e, null).getPropertyValue(attribute);
	}
	else if(document.body.currentStyle && attribute != "opacity") {
		attribute = attribute.replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()});
		return e.currentStyle[attribute].replace("px", "");
	}
	else if(document.body.currentStyle && attribute == "opacity" && e.currentStyle["filter"]) {
		var match = e.currentStyle["filter"].match(/Opacity=([0-9]+)/);
		if(match) {
			return match[1]/100;
		}
	}
	return false;
}
Util.appendElement = u.ae = function(e, node_type, attributes) {
	try {
		var node = e.appendChild(document.createElement(node_type));
		if(attributes) {
			if(typeof(attributes) == "object") {
				for(attribute in attributes) {
					if(!document.all || (attribute != "class" && attribute != "type")) {
						node.setAttribute(attribute, attributes[attribute]);
					}
				}
				if(document.all && attributes["class"]) {
					u.addClass(node, attributes["class"]);
				}
				if(document.all && attributes["type"]) {
					node.type = attributes["type"];
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
		u.bug("e="+e + ":nodename="+e.nodeName + ":"+(e.id ? ("id="+e.id) : ("classname="+e.className)) + ":node_type="+node_type+":attributes=" + attributes);
	}
}
Util.insertElement = u.ie = function(e, node_type, attributes) {
	var node = e.insertBefore(document.createElement(node_type), e.firstChild);
	if(attributes) {
		if(typeof(attributes) == "object") {
			for(attribute in attributes) {
				node.setAttribute(attribute, attributes[attribute]);
			}
			if(document.all && attributes["class"]) {
				u.addClass(node, attributes["class"]);
			}
		}
		else {
			u.addClass(node, attributes)
		}
	}
	return node;
}
if(document.querySelector == undefined) {
	(function(){
	var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
		expando = "sizcache" + (Math.random() + '').replace('.', ''),
		done = 0,
		toString = Object.prototype.toString,
		hasDuplicate = false,
		baseHasDuplicate = true,
		rBackslash = /\\/g,
		rReturn = /\r\n/g,
		rNonWord = /\W/;
	[0, 0].sort(function() {
		baseHasDuplicate = false;
		return 0;
	});
	var Sizzle = function( selector, context, results, seed ) {
		results = results || [];
		context = context || document;
		var origContext = context;
		if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
			return [];
		}
		if ( !selector || typeof selector !== "string" ) {
			return results;
		}
		var m, set, checkSet, extra, ret, cur, pop, i,
			prune = true,
			contextXML = Sizzle.isXML( context ),
			parts = [],
			soFar = selector;
		do {
			chunker.exec( "" );
			m = chunker.exec( soFar );
			if ( m ) {
				soFar = m[3];
				parts.push( m[1] );
				if ( m[2] ) {
					extra = m[3];
					break;
				}
			}
		} while ( m );
		if ( parts.length > 1 && origPOS.exec( selector ) ) {
			if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
				set = posProcess( parts[0] + parts[1], context, seed );
			} else {
				set = Expr.relative[ parts[0] ] ?
					[ context ] :
					Sizzle( parts.shift(), context );
				while ( parts.length ) {
					selector = parts.shift();
					if ( Expr.relative[ selector ] ) {
						selector += parts.shift();
					}
					set = posProcess( selector, set, seed );
				}
			}
		} else {
			if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
					Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
				ret = Sizzle.find( parts.shift(), context, contextXML );
				context = ret.expr ?
					Sizzle.filter( ret.expr, ret.set )[0] :
					ret.set[0];
			}
			if ( context ) {
				ret = seed ?
					{ expr: parts.pop(), set: makeArray(seed) } :
					Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
				set = ret.expr ?
					Sizzle.filter( ret.expr, ret.set ) :
					ret.set;
				if ( parts.length > 0 ) {
					checkSet = makeArray( set );
				} else {
					prune = false;
				}
				while ( parts.length ) {
					cur = parts.pop();
					pop = cur;
					if ( !Expr.relative[ cur ] ) {
						cur = "";
					} else {
						pop = parts.pop();
					}
					if ( pop == null ) {
						pop = context;
					}
					Expr.relative[ cur ]( checkSet, pop, contextXML );
				}
			} else {
				checkSet = parts = [];
			}
		}
		if ( !checkSet ) {
			checkSet = set;
		}
		if ( !checkSet ) {
			Sizzle.error( cur || selector );
		}
		if ( toString.call(checkSet) === "[object Array]" ) {
			if ( !prune ) {
				results.push.apply( results, checkSet );
			} else if ( context && context.nodeType === 1 ) {
				for ( i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
						results.push( set[i] );
					}
				}
			} else {
				for ( i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
						results.push( set[i] );
					}
				}
			}
		} else {
			makeArray( checkSet, results );
		}
		if ( extra ) {
			Sizzle( extra, origContext, results, seed );
			Sizzle.uniqueSort( results );
		}
		return results;
	};
	Sizzle.uniqueSort = function( results ) {
		if ( sortOrder ) {
			hasDuplicate = baseHasDuplicate;
			results.sort( sortOrder );
			if ( hasDuplicate ) {
				for ( var i = 1; i < results.length; i++ ) {
					if ( results[i] === results[ i - 1 ] ) {
						results.splice( i--, 1 );
					}
				}
			}
		}
		return results;
	};
	Sizzle.matches = function( expr, set ) {
		return Sizzle( expr, null, null, set );
	};
	Sizzle.matchesSelector = function( node, expr ) {
		return Sizzle( expr, null, null, [node] ).length > 0;
	};
	Sizzle.find = function( expr, context, isXML ) {
		var set, i, len, match, type, left;
		if ( !expr ) {
			return [];
		}
		for ( i = 0, len = Expr.order.length; i < len; i++ ) {
			type = Expr.order[i];
			if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
				left = match[1];
				match.splice( 1, 1 );
				if ( left.substr( left.length - 1 ) !== "\\" ) {
					match[1] = (match[1] || "").replace( rBackslash, "" );
					set = Expr.find[ type ]( match, context, isXML );
					if ( set != null ) {
						expr = expr.replace( Expr.match[ type ], "" );
						break;
					}
				}
			}
		}
		if ( !set ) {
			set = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( "*" ) :
				[];
		}
		return { set: set, expr: expr };
	};
	Sizzle.filter = function( expr, set, inplace, not ) {
		var match, anyFound,
			type, found, item, filter, left,
			i, pass,
			old = expr,
			result = [],
			curLoop = set,
			isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );
		while ( expr && set.length ) {
			for ( type in Expr.filter ) {
				if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
					filter = Expr.filter[ type ];
					left = match[1];
					anyFound = false;
					match.splice(1,1);
					if ( left.substr( left.length - 1 ) === "\\" ) {
						continue;
					}
					if ( curLoop === result ) {
						result = [];
					}
					if ( Expr.preFilter[ type ] ) {
						match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );
						if ( !match ) {
							anyFound = found = true;
						} else if ( match === true ) {
							continue;
						}
					}
					if ( match ) {
						for ( i = 0; (item = curLoop[i]) != null; i++ ) {
							if ( item ) {
								found = filter( item, match, i, curLoop );
								pass = not ^ found;
								if ( inplace && found != null ) {
									if ( pass ) {
										anyFound = true;
									} else {
										curLoop[i] = false;
									}
								} else if ( pass ) {
									result.push( item );
									anyFound = true;
								}
							}
						}
					}
					if ( found !== undefined ) {
						if ( !inplace ) {
							curLoop = result;
						}
						expr = expr.replace( Expr.match[ type ], "" );
						if ( !anyFound ) {
							return [];
						}
						break;
					}
				}
			}
			if ( expr === old ) {
				if ( anyFound == null ) {
					Sizzle.error( expr );
				} else {
					break;
				}
			}
			old = expr;
		}
		return curLoop;
	};
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	var getText = Sizzle.getText = function( elem ) {
	    var i, node,
			nodeType = elem.nodeType,
			ret = "";
		if ( nodeType ) {
			if ( nodeType === 1 || nodeType === 9 ) {
				if ( typeof elem.textContent === 'string' ) {
					return elem.textContent;
				} else if ( typeof elem.innerText === 'string' ) {
					return elem.innerText.replace( rReturn, '' );
				} else {
					for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText( elem );
					}
				}
			} else if ( nodeType === 3 || nodeType === 4 ) {
				return elem.nodeValue;
			}
		} else {
			for ( i = 0; (node = elem[i]); i++ ) {
				if ( node.nodeType !== 8 ) {
					ret += getText( node );
				}
			}
		}
		return ret;
	};
	var Expr = Sizzle.selectors = {
		order: [ "ID", "NAME", "TAG" ],
		match: {
			ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
			ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
			TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
			CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
			POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
			PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
		},
		leftMatch: {},
		attrMap: {
			"class": "className",
			"for": "htmlFor"
		},
		attrHandle: {
			href: function( elem ) {
				return elem.getAttribute( "href" );
			},
			type: function( elem ) {
				return elem.getAttribute( "type" );
			}
		},
		relative: {
			"+": function(checkSet, part){
				var isPartStr = typeof part === "string",
					isTag = isPartStr && !rNonWord.test( part ),
					isPartStrNotTag = isPartStr && !isTag;
				if ( isTag ) {
					part = part.toLowerCase();
				}
				for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
					if ( (elem = checkSet[i]) ) {
						while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}
						checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
							elem || false :
							elem === part;
					}
				}
				if ( isPartStrNotTag ) {
					Sizzle.filter( part, checkSet, true );
				}
			},
			">": function( checkSet, part ) {
				var elem,
					isPartStr = typeof part === "string",
					i = 0,
					l = checkSet.length;
				if ( isPartStr && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					for ( ; i < l; i++ ) {
						elem = checkSet[i];
						if ( elem ) {
							var parent = elem.parentNode;
							checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
						}
					}
				} else {
					for ( ; i < l; i++ ) {
						elem = checkSet[i];
						if ( elem ) {
							checkSet[i] = isPartStr ?
								elem.parentNode :
								elem.parentNode === part;
						}
					}
					if ( isPartStr ) {
						Sizzle.filter( part, checkSet, true );
					}
				}
			},
			"": function(checkSet, part, isXML){
				var nodeCheck,
					doneName = done++,
					checkFn = dirCheck;
				if ( typeof part === "string" && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}
				checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
			},
			"~": function( checkSet, part, isXML ) {
				var nodeCheck,
					doneName = done++,
					checkFn = dirCheck;
				if ( typeof part === "string" && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}
				checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
			}
		},
		find: {
			ID: function( match, context, isXML ) {
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);
					return m && m.parentNode ? [m] : [];
				}
			},
			NAME: function( match, context ) {
				if ( typeof context.getElementsByName !== "undefined" ) {
					var ret = [],
						results = context.getElementsByName( match[1] );
					for ( var i = 0, l = results.length; i < l; i++ ) {
						if ( results[i].getAttribute("name") === match[1] ) {
							ret.push( results[i] );
						}
					}
					return ret.length === 0 ? null : ret;
				}
			},
			TAG: function( match, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( match[1] );
				}
			}
		},
		preFilter: {
			CLASS: function( match, curLoop, inplace, result, not, isXML ) {
				match = " " + match[1].replace( rBackslash, "" ) + " ";
				if ( isXML ) {
					return match;
				}
				for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
					if ( elem ) {
						if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
							if ( !inplace ) {
								result.push( elem );
							}
						} else if ( inplace ) {
							curLoop[i] = false;
						}
					}
				}
				return false;
			},
			ID: function( match ) {
				return match[1].replace( rBackslash, "" );
			},
			TAG: function( match, curLoop ) {
				return match[1].replace( rBackslash, "" ).toLowerCase();
			},
			CHILD: function( match ) {
				if ( match[1] === "nth" ) {
					if ( !match[2] ) {
						Sizzle.error( match[0] );
					}
					match[2] = match[2].replace(/^\+|\s*/g, '');
					var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
						match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
						!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);
					match[2] = (test[1] + (test[2] || 1)) - 0;
					match[3] = test[3] - 0;
				}
				else if ( match[2] ) {
					Sizzle.error( match[0] );
				}
				match[0] = done++;
				return match;
			},
			ATTR: function( match, curLoop, inplace, result, not, isXML ) {
				var name = match[1] = match[1].replace( rBackslash, "" );
				if ( !isXML && Expr.attrMap[name] ) {
					match[1] = Expr.attrMap[name];
				}
				match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );
				if ( match[2] === "~=" ) {
					match[4] = " " + match[4] + " ";
				}
				return match;
			},
			PSEUDO: function( match, curLoop, inplace, result, not ) {
				if ( match[1] === "not" ) {
					if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
						match[3] = Sizzle(match[3], null, null, curLoop);
					} else {
						var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
						if ( !inplace ) {
							result.push.apply( result, ret );
						}
						return false;
					}
				} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
					return true;
				}
				return match;
			},
			POS: function( match ) {
				match.unshift( true );
				return match;
			}
		},
		filters: {
			enabled: function( elem ) {
				return elem.disabled === false && elem.type !== "hidden";
			},
			disabled: function( elem ) {
				return elem.disabled === true;
			},
			checked: function( elem ) {
				return elem.checked === true;
			},
			selected: function( elem ) {
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
				return elem.selected === true;
			},
			parent: function( elem ) {
				return !!elem.firstChild;
			},
			empty: function( elem ) {
				return !elem.firstChild;
			},
			has: function( elem, i, match ) {
				return !!Sizzle( match[3], elem ).length;
			},
			header: function( elem ) {
				return (/h\d/i).test( elem.nodeName );
			},
			text: function( elem ) {
				var attr = elem.getAttribute( "type" ), type = elem.type;
				return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
			},
			radio: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
			},
			checkbox: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
			},
			file: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
			},
			password: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
			},
			submit: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "submit" === elem.type;
			},
			image: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
			},
			reset: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "reset" === elem.type;
			},
			button: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && "button" === elem.type || name === "button";
			},
			input: function( elem ) {
				return (/input|select|textarea|button/i).test( elem.nodeName );
			},
			focus: function( elem ) {
				return elem === elem.ownerDocument.activeElement;
			}
		},
		setFilters: {
			first: function( elem, i ) {
				return i === 0;
			},
			last: function( elem, i, match, array ) {
				return i === array.length - 1;
			},
			even: function( elem, i ) {
				return i % 2 === 0;
			},
			odd: function( elem, i ) {
				return i % 2 === 1;
			},
			lt: function( elem, i, match ) {
				return i < match[3] - 0;
			},
			gt: function( elem, i, match ) {
				return i > match[3] - 0;
			},
			nth: function( elem, i, match ) {
				return match[3] - 0 === i;
			},
			eq: function( elem, i, match ) {
				return match[3] - 0 === i;
			}
		},
		filter: {
			PSEUDO: function( elem, match, i, array ) {
				var name = match[1],
					filter = Expr.filters[ name ];
				if ( filter ) {
					return filter( elem, i, match, array );
				} else if ( name === "contains" ) {
					return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
				} else if ( name === "not" ) {
					var not = match[3];
					for ( var j = 0, l = not.length; j < l; j++ ) {
						if ( not[j] === elem ) {
							return false;
						}
					}
					return true;
				} else {
					Sizzle.error( name );
				}
			},
			CHILD: function( elem, match ) {
				var first, last,
					doneName, parent, cache,
					count, diff,
					type = match[1],
					node = elem;
				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}
						if ( type === "first" ) {
							return true;
						}
						node = elem;
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}
						return true;
					case "nth":
						first = match[2];
						last = match[3];
						if ( first === 1 && last === 0 ) {
							return true;
						}
						doneName = match[0];
						parent = elem.parentNode;
						if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
							count = 0;
							for ( node = parent.firstChild; node; node = node.nextSibling ) {
								if ( node.nodeType === 1 ) {
									node.nodeIndex = ++count;
								}
							}
							parent[ expando ] = doneName;
						}
						diff = elem.nodeIndex - last;
						if ( first === 0 ) {
							return diff === 0;
						} else {
							return ( diff % first === 0 && diff / first >= 0 );
						}
				}
			},
			ID: function( elem, match ) {
				return elem.nodeType === 1 && elem.getAttribute("id") === match;
			},
			TAG: function( elem, match ) {
				return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
			},
			CLASS: function( elem, match ) {
				return (" " + (elem.className || elem.getAttribute("class")) + " ")
					.indexOf( match ) > -1;
			},
			ATTR: function( elem, match ) {
				var name = match[1],
					result = Sizzle.attr ?
						Sizzle.attr( elem, name ) :
						Expr.attrHandle[ name ] ?
						Expr.attrHandle[ name ]( elem ) :
						elem[ name ] != null ?
							elem[ name ] :
							elem.getAttribute( name ),
					value = result + "",
					type = match[2],
					check = match[4];
				return result == null ?
					type === "!=" :
					!type && Sizzle.attr ?
					result != null :
					type === "=" ?
					value === check :
					type === "*=" ?
					value.indexOf(check) >= 0 :
					type === "~=" ?
					(" " + value + " ").indexOf(check) >= 0 :
					!check ?
					value && result !== false :
					type === "!=" ?
					value !== check :
					type === "^=" ?
					value.indexOf(check) === 0 :
					type === "$=" ?
					value.substr(value.length - check.length) === check :
					type === "|=" ?
					value === check || value.substr(0, check.length + 1) === check + "-" :
					false;
			},
			POS: function( elem, match, i, array ) {
				var name = match[2],
					filter = Expr.setFilters[ name ];
				if ( filter ) {
					return filter( elem, i, match, array );
				}
			}
		}
	};
	var origPOS = Expr.match.POS,
		fescape = function(all, num){
			return "\\" + (num - 0 + 1);
		};
	for ( var type in Expr.match ) {
		Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
		Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
	}
	Expr.match.globalPOS = origPOS;
	var makeArray = function( array, results ) {
		array = Array.prototype.slice.call( array, 0 );
		if ( results ) {
			results.push.apply( results, array );
			return results;
		}
		return array;
	};
	try {
		Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;
	} catch( e ) {
		makeArray = function( array, results ) {
			var i = 0,
				ret = results || [];
			if ( toString.call(array) === "[object Array]" ) {
				Array.prototype.push.apply( ret, array );
			} else {
				if ( typeof array.length === "number" ) {
					for ( var l = array.length; i < l; i++ ) {
						ret.push( array[i] );
					}
				} else {
					for ( ; array[i]; i++ ) {
						ret.push( array[i] );
					}
				}
			}
			return ret;
		};
	}
	var sortOrder, siblingCheck;
	if ( document.documentElement.compareDocumentPosition ) {
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
			if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
				return a.compareDocumentPosition ? -1 : 1;
			}
			return a.compareDocumentPosition(b) & 4 ? -1 : 1;
		};
	} else {
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			} else if ( a.sourceIndex && b.sourceIndex ) {
				return a.sourceIndex - b.sourceIndex;
			}
			var al, bl,
				ap = [],
				bp = [],
				aup = a.parentNode,
				bup = b.parentNode,
				cur = aup;
			if ( aup === bup ) {
				return siblingCheck( a, b );
			} else if ( !aup ) {
				return -1;
			} else if ( !bup ) {
				return 1;
			}
			while ( cur ) {
				ap.unshift( cur );
				cur = cur.parentNode;
			}
			cur = bup;
			while ( cur ) {
				bp.unshift( cur );
				cur = cur.parentNode;
			}
			al = ap.length;
			bl = bp.length;
			for ( var i = 0; i < al && i < bl; i++ ) {
				if ( ap[i] !== bp[i] ) {
					return siblingCheck( ap[i], bp[i] );
				}
			}
			return i === al ?
				siblingCheck( a, bp[i], -1 ) :
				siblingCheck( ap[i], b, 1 );
		};
		siblingCheck = function( a, b, ret ) {
			if ( a === b ) {
				return ret;
			}
			var cur = a.nextSibling;
			while ( cur ) {
				if ( cur === b ) {
					return -1;
				}
				cur = cur.nextSibling;
			}
			return 1;
		};
	}
	(function(){
		var form = document.createElement("div"),
			id = "script" + (new Date()).getTime(),
			root = document.documentElement;
		form.innerHTML = "<a name='" + id + "'/>";
		root.insertBefore( form, root.firstChild );
		if ( document.getElementById( id ) ) {
			Expr.find.ID = function( match, context, isXML ) {
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);
					return m ?
						m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
							[m] :
							undefined :
						[];
				}
			};
			Expr.filter.ID = function( elem, match ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return elem.nodeType === 1 && node && node.nodeValue === match;
			};
		}
		root.removeChild( form );
		root = form = null;
	})();
	(function(){
		var div = document.createElement("div");
		div.appendChild( document.createComment("") );
		if ( div.getElementsByTagName("*").length > 0 ) {
			Expr.find.TAG = function( match, context ) {
				var results = context.getElementsByTagName( match[1] );
				if ( match[1] === "*" ) {
					var tmp = [];
					for ( var i = 0; results[i]; i++ ) {
						if ( results[i].nodeType === 1 ) {
							tmp.push( results[i] );
						}
					}
					results = tmp;
				}
				return results;
			};
		}
		div.innerHTML = "<a href='#'></a>";
		if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
				div.firstChild.getAttribute("href") !== "#" ) {
			Expr.attrHandle.href = function( elem ) {
				return elem.getAttribute( "href", 2 );
			};
		}
		div = null;
	})();
	if ( document.querySelectorAll ) {
		(function(){
			var oldSizzle = Sizzle,
				div = document.createElement("div"),
				id = "__sizzle__";
			div.innerHTML = "<p class='TEST'></p>";
			if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
				return;
			}
			Sizzle = function( query, context, extra, seed ) {
				context = context || document;
				if ( !seed && !Sizzle.isXML(context) ) {
					var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
					if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
						if ( match[1] ) {
							return makeArray( context.getElementsByTagName( query ), extra );
						} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
							return makeArray( context.getElementsByClassName( match[2] ), extra );
						}
					}
					if ( context.nodeType === 9 ) {
						if ( query === "body" && context.body ) {
							return makeArray( [ context.body ], extra );
						} else if ( match && match[3] ) {
							var elem = context.getElementById( match[3] );
							if ( elem && elem.parentNode ) {
								if ( elem.id === match[3] ) {
									return makeArray( [ elem ], extra );
								}
							} else {
								return makeArray( [], extra );
							}
						}
						try {
							return makeArray( context.querySelectorAll(query), extra );
						} catch(qsaError) {}
					} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
						var oldContext = context,
							old = context.getAttribute( "id" ),
							nid = old || id,
							hasParent = context.parentNode,
							relativeHierarchySelector = /^\s*[+~]/.test( query );
						if ( !old ) {
							context.setAttribute( "id", nid );
						} else {
							nid = nid.replace( /'/g, "\\$&" );
						}
						if ( relativeHierarchySelector && hasParent ) {
							context = context.parentNode;
						}
						try {
							if ( !relativeHierarchySelector || hasParent ) {
								return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
							}
						} catch(pseudoError) {
						} finally {
							if ( !old ) {
								oldContext.removeAttribute( "id" );
							}
						}
					}
				}
				return oldSizzle(query, context, extra, seed);
			};
			for ( var prop in oldSizzle ) {
				Sizzle[ prop ] = oldSizzle[ prop ];
			}
			div = null;
		})();
	}
	(function(){
		var html = document.documentElement,
			matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;
		if ( matches ) {
			var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
				pseudoWorks = false;
			try {
				matches.call( document.documentElement, "[test!='']:sizzle" );
			} catch( pseudoError ) {
				pseudoWorks = true;
			}
			Sizzle.matchesSelector = function( node, expr ) {
				expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
				if ( !Sizzle.isXML( node ) ) {
					try {
						if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
							var ret = matches.call( node, expr );
							if ( ret || !disconnectedMatch ||
									node.document && node.document.nodeType !== 11 ) {
								return ret;
							}
						}
					} catch(e) {}
				}
				return Sizzle(expr, null, null, [node]).length > 0;
			};
		}
	})();
	(function(){
		var div = document.createElement("div");
		div.innerHTML = "<div class='test e'></div><div class='test'></div>";
		if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
			return;
		}
		div.lastChild.className = "e";
		if ( div.getElementsByClassName("e").length === 1 ) {
			return;
		}
		Expr.order.splice(1, 0, "CLASS");
		Expr.find.CLASS = function( match, context, isXML ) {
			if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
				return context.getElementsByClassName(match[1]);
			}
		};
		div = null;
	})();
	function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];
			if ( elem ) {
				var match = false;
				elem = elem[dir];
				while ( elem ) {
					if ( elem[ expando ] === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}
					if ( elem.nodeType === 1 && !isXML ){
						elem[ expando ] = doneName;
						elem.sizset = i;
					}
					if ( elem.nodeName.toLowerCase() === cur ) {
						match = elem;
						break;
					}
					elem = elem[dir];
				}
				checkSet[i] = match;
			}
		}
	}
	function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];
			if ( elem ) {
				var match = false;
				elem = elem[dir];
				while ( elem ) {
					if ( elem[ expando ] === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}
					if ( elem.nodeType === 1 ) {
						if ( !isXML ) {
							elem[ expando ] = doneName;
							elem.sizset = i;
						}
						if ( typeof cur !== "string" ) {
							if ( elem === cur ) {
								match = true;
								break;
							}
						} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
							match = elem;
							break;
						}
					}
					elem = elem[dir];
				}
				checkSet[i] = match;
			}
		}
	}
	if ( document.documentElement.contains ) {
		Sizzle.contains = function( a, b ) {
			return a !== b && (a.contains ? a.contains(b) : true);
		};
	} else if ( document.documentElement.compareDocumentPosition ) {
		Sizzle.contains = function( a, b ) {
			return !!(a.compareDocumentPosition(b) & 16);
		};
	} else {
		Sizzle.contains = function() {
			return false;
		};
	}
	Sizzle.isXML = function( elem ) {
		var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};
	var posProcess = function( selector, context, seed ) {
		var match,
			tmpSet = [],
			later = "",
			root = context.nodeType ? [context] : context;
		while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
			later += match[0];
			selector = selector.replace( Expr.match.PSEUDO, "" );
		}
		selector = Expr.relative[selector] ? selector + "*" : selector;
		for ( var i = 0, l = root.length; i < l; i++ ) {
			Sizzle( selector, root[i], tmpSet, seed );
		}
		return Sizzle.filter( later, tmpSet );
	};
	window.Sizzle = Sizzle;
	})();
	Util.querySelector = u.qs = function(query, target) {
		var res = Sizzle(query, target);
		return res[0];
	}
	Util.querySelectorAll = u.qsa = function(query, target) {
		var res = Sizzle(query, target);
		return res;
	}
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
u.a.setOpacity = function(e, opacity) {
	if(u.explorer()) {
		if(opacity < 0.5) {
			u.as(e, "visibility", "hidden");
		}
		else {
			u.as(e, "visibility", "visible");
		}
		if(e.duration && typeof(e.transitioned) == "function") {
			e.transitioned();
		}
	}
	else if(e.duration && !this.support()) {
		e.o_start = e._opacity ? e._opacity : u.gcs(e, "opacity");
		e.o_transitions = e.duration/100;
		e.o_change = (opacity - e.o_start) / e.o_transitions;
		e.o_progress = 0;
		e.o_transitionTo = function() {
			++this.o_progress;
			var new_opacity = (Number(this.o_start) + Number(this.o_progress * this.o_change));
			u.as(this, "opacity", new_opacity);
		}
		for(var i = 0; i < e.o_transitions; i++) {
			u.t.setTimer(e, e.o_transitionTo, 100 * i);
		}
		if(typeof(e.transitioned) == "function") {
			u.t.setTimer(e, e.transitioned, e.duration);
		}
	}
	else {
		e.style.opacity = opacity;
	}
	e._opacity = opacity;
	e.transition_timestamp = new Date().getTime();
	e.offsetHeight;
}
u.a.setWidth = function(e, width) {
	if(e.duration && !this.support()) {
		e.w_start = e._width ? e._width : u.gcs(e, "width").replace("px", "");
		e.w_transitions = e.duration/100;
		e.w_change = (width - e.w_start) / e.w_transitions;
		e.w_progress = 0;
		e.w_transitionTo = function() {
			++this.w_progress;
			var new_width = (Number(this.w_start) + Number(this.w_progress * this.w_change));
			if(new_width >= 0) {
				u.as(this, "width", new_width+"px");
			}
		}
		for(var i = 0; i < e.w_transitions; i++) {
			u.t.setTimer(e, e.w_transitionTo, 100 * i);
		}
		if(typeof(e.transitioned) == "function") {
			u.t.setTimer(e, e.transitioned, e.duration);
		}
	}
	else {
		var width_px = (width == "auto" ? width : width+"px");
		u.as(e, "width", width_px);
	}
	e._width = width;
	e.transition_timestamp = new Date().getTime();
	e.offsetHeight;
}
u.a.setHeight = function(e, height) {
	if(e.duration && !this.support()) {
		e.h_start = e._height ? e._height : u.gcs(e, "height").replace("px", "");
		e.h_transitions = e.duration/100;
		e.h_change = (height - e.h_start) / e.h_transitions;
		e.h_progress = 0;
		e.h_transitionTo = function() {
			++this.h_progress;
			var new_height = (Number(this.h_start) + Number(this.h_progress * this.h_change));
			if(new_height >= 0) {
				u.as(this, "height", new_height+"px");
			}
		}
		for(var i = 0; i < e.h_transitions; i++) {
			u.t.setTimer(e, e.h_transitionTo, 100 * i);
		}
		if(typeof(e.transitioned) == "function") {
			u.t.setTimer(e, e.transitioned, e.duration);
		}
	}
	else {
		var height_px = (height == "auto" ? height : height+"px");
		u.as(e, "height", height_px);
	}
	e._height = height;
	e.transition_timestamp = new Date().getTime();
	e.offsetHeight;
}
u.a.translate = function(e, x, y) {
	var i;
	if(e.t_offset_x == undefined) {
		e.t_offset_x = u.relX(e);
		e.t_offset_y = u.relY(e);
		e.element_x = e.element_x ? e.element_x : 0;
		e.element_y = e.element_y ? e.element_y : 0;
		if(this.support()) {
			e.style[this.variant()+"Transition"] = "none";
		}
		u.as(e, "left", e.t_offset_x+"px");
		u.as(e, "top", e.t_offset_y+"px");
		u.as(e, "position", "absolute");
	}
	if(e.duration) {
		e.x_start = e.element_x;
		e.y_start = e.element_y;
		e.t_transitions = e.duration/100;
		e.t_progress = 0;
		e.x_change = (x - e.x_start) / e.t_transitions;
		e.y_change = (y - e.y_start) / e.t_transitions;
		e.t_transitionTo = function() {
			++this.t_progress;
			var new_x = (Number(this.x_start) + Number(this.t_progress * this.x_change) + this.t_offset_x);
			var new_y = (Number(this.y_start) + Number(this.t_progress * this.y_change) + this.t_offset_y);
			u.as(e, "left", new_x + "px");
			u.as(e, "top", new_y + "px");
		}
		for(i = 0; i < e.t_transitions; i++) {
			u.t.setTimer(e, e.t_transitionTo, 100 * i);
		}
		if(typeof(e.transitioned) == "function") {
			u.t.setTimer(e, e.transitioned, e.duration);
		}
	}
	else {
		u.as(e, "left", (e.t_offset_x + x)+"px");
		u.as(e, "top", (e.t_offset_y + y)+"px");
	}
	e.element_x = x;
	e.element_y = y;
	e.transition_timestamp = new Date().getTime();
	e.offsetHeight;
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
if(document.all) {
	window.attachedEvents = new Array();
	window.eventHandler = function() {
		var element, eid, i;
		element = window.event.srcElement;
		while(element && element.nodeName != "HTML") {
			eid = u.getIJ(element, "eid");
			if(eid && window.attachedEvents[eid] && window.attachedEvents[eid][window.event.type]) {
				var i, attachedAction;
				for(i = 0; attachedAction = window.attachedEvents[eid][window.event.type][i]; i++) {
					window.event.target = element;
					element.ie_event_action = attachedAction;
					element.ie_event_action(window.event);
				}
				return;
			}
			element = element.parentNode;
		}
		if(window.attachedEvents["window"] && window.attachedEvents["window"][window.event.type]) {
			var i, attachedAction;
			for(i = 0; attachedAction = window.attachedEvents["window"][window.event.type][i]; i++) {
				window.event.target = window;
				window.ie_event_action = attachedAction;
				window.ie_event_action(window.event);
			}
			return;
		}
	}
	u.e.event_pref = "mouse";
	u.e.kill = function(event) {
		if(event) {
			event.cancelBubble = true;
			event.returnValue = false;
		}
	}
	u.e.addEvent = function(e, type, action) {
		if(e != window) {
			var eid = u.getIJ(e, "eid");
			if(!eid) {
				var eid = u.randomKey();
				u.ac(e, "eid:"+eid)
			}
		}
		else {
			eid = "window";
		}
		if(!window.attachedEvents[eid]) {
			window.attachedEvents[eid] = new Array();
		}
		if(!window.attachedEvents[eid][type]) {
			window.attachedEvents[eid][type] = new Array();
		}
		if(window.attachedEvents[eid][type].indexOf(action) == -1) {
			window.attachedEvents[eid][type][window.attachedEvents[eid][type].length] = action;
		}
		e.attachEvent("on"+type, window.eventHandler);
	}
	u.e.removeEvent = function(e, type, action) {
		if(e != window) {
			var eid = u.getIJ(e, "eid");
		}
		else {
			eid = "window";
		}
		if(eid) {
			if(window.attachedEvents[eid] && window.attachedEvents[eid][type]) {
				for(i in window.attachedEvents[eid][type]) {
					if(window.attachedEvents[eid][type][i] == action) {
						window.attachedEvents[eid][type].splice(i,1);
					}
				}
			}
		}
		e.detachEvent("on"+type, window.eventHandler);
	}
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
if(window.pageXOffset == undefined && Object.defineProperty) {
	Object.defineProperty(window, "pageXOffset",
		{get: function() {
			return document.documentElement.scrollLeft;
			}
		}
	);
}
if(window.pageYOffset == undefined && Object.defineProperty) {
	Object.defineProperty(window, "pageYOffset",
		{get: function() {
			return document.documentElement.scrollTop;
			}
		}
	);
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
Util.link = function(e) {
	var a = u.qs("a", e);
	u.addClass(e, "link");
	e.url = a.href;
	a.removeAttribute("href");
	u.e.click(e);
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
Util.Objects = u.o = new Array();
Util.init = function() {
	var i, e, elements, ij_value;
	elements = u.ges("i\:([_a-zA-Z0-9])+");
	for(i = 0; e = elements[i]; i++) {
		if(!u.isTemplateChild(e)) {
			while((ij_value = u.getIJ(e, "i"))) {
				u.removeClass(e, "i:"+ij_value);
				if(ij_value && typeof(u.o[ij_value]) == "object") {
					u.o[ij_value].init(e);
				}
			}
		}
	}
}
u.e.addEvent(window, "load", u.init);

u.notify = function(message, type, target) {
	if(message) {
		var page = u.qs("#page");
		target = target ? target : page.cN;
		var notification = u.ie(target, "div", ({"class":"notice "+type, "style":"height: 0;"}));
		var notification_inner = u.ae(notification, "div", ({"class":"inner"}));
		notification_inner.message = u.ae(notification_inner, "p");
		notification_inner.message.innerHTML = message;
		u.a.setOpacity(notification, 1);
		u.a.transition(notification, "none");
		u.a.setHeight(notification, notification_inner.message.offsetHeight+Number(u.gcs(notification_inner, "margin-bottom").replace("px", "")));
		u.e.click(notification);
		notification.clicked = function(event) {
			this.transitioned = function(event) {
				this.transitioned = function(event) {
					this.transitioned = null;
					this.parentNode.removeChild(this);
				}
				u.a.setHeight(this, 0);
			}
			u.a.transition(this, "all 0.00000001s ease-in");
			u.a.setOpacity(this, 0);
		}
		if(u.e.event_pref == "mouse") {
			notification.onmouseover = function(event) {
				u.t.resetTimer(this.t_hide);
			}
			notification.onmouseout = function(event) {
				this.t_hide = u.t.setTimer(this, this.clicked, 2000);
			}
		}
		notification.t_hide = u.t.setTimer(notification, notification.clicked, 7000);
	}
}
u.loading = function(node) {
	node.transitioned = function(event) {
		this.transitioned = null;
		u.a.transition(this, "none");
	}
	u.a.transition(node, "all 0.3s ease-in");
	u.a.setOpacity(node, 0.5);
}
u.loaded = function(node) {
	node.transitioned = function(event) {
		this.transitioned = null;
		u.a.transition(this, "none");
	}
	u.a.transition(node, "all 0.3s ease-in");
	u.a.setOpacity(node, 1);
}
u.template = function(node, response) {
	var html = "";
	var clone = "";
	var container = "";
	var template = "";
	var item_template = "";
	if(response) {
		if (response.length == undefined || (response.length && response.length > 0)) {
			clone = node.cloneNode(true);
			u.rc(clone, "template");
			container = document.createElement("div");
			container.appendChild(clone);
			template = container.innerHTML;
			template = template.replace(/href\=\"([^\"]+)\"/g, function(string) {return decodeURIComponent(string);});
			template = template.replace(/src\=\"([^\"]+)\"/g, function(string) {return decodeURIComponent(string);});
			item_template;
		}
		if(response.length) {
			for(item in response) {
				item_template = template;
				html += item_template.replace(/\{(.+?)\}/g, 
					function(string) {
						if(string == "{children}") {
							if(response[item].children && response[item].children.length) {
								var parent_node = node.parentNode.nodeName.toLowerCase();
								var parent_class = node.parentNode.className;
								return '<'+parent_node+' class="'+parent_class+'">'+u.template(node, response[item].children)+'</'+parent_node+'>';
							}
							else {
								return "";
							}
						}
						else if(response[item][string.replace(/[\{\}]/g, "")]) {
							if(response[item][string.replace(/[\{\}]/g, "")] === true) {
								return "true";
							}
							return response[item][string.replace(/[\{\}]/g, "")];
						}
						else if(response[item][string.replace(/[\{\}]/g, "")] === false) {
							return "false";
						}
						else {
							return "";
						}
					}
				);
			}
		}
		else {
			html += template.replace(/\{(.+?)\}/g, function(string) {if(response[string.replace(/[\{\}]/g, "")]) {return response[string.replace(/[\{\}]/g, "")]}else{return ""}});
		}
	}
	return html;
}
u.loadContent = function(url) {
	var content = u.qs("#content");
	if(content) {
		content.url = url;
		u.o.syncLoader = new function() {
			this.init = function(content) {
				u.loading(content);
				content.Response = function(response) {
					var new_content = u.qs("#content", response);
					if(new_content) {
						u.sc(this, new_content.className);
						this.innerHTML = new_content.innerHTML;
						u.init();
						u.loaded(this);
					}
					else {
						alert("missing #content in response");
					}
				}
				u.Request(content, url);
			}
		}
		u.sc(content, "i:syncLoader");
	}
}
u.formStateChanged = function() {
	document.body.onbeforeunload = function(event) {
		event.returnValue = "check?";
	}
}
u.formStateUnChanged = function() {
	document.body.onbeforeunload = null;
}
u.isTemplateChild = function(node) {
	var in_template = false;
	while(node != null) {
		if(u.hasClass(node, "template")) {
			in_template = true;
			break;
		}
		node = node.parentNode;
	}
	return in_template;
}
u.cleanParams = function(params, form) {
	var new_params = new Object();
	for(param in params) {
		if(form[param] && !u.isTemplateChild(form[param])) {
			new_params[param] = params[param];
		}
	}
	return new_params;
}
Util.Form.customSend = new Object();
Util.Form.customSend["parameters"] = function(params, form) {
	params = u.cleanParams(params, form);
	var string = "";
	for(param in params) {
		string += param + "=" + encodeURIComponent(params[param]) + "&";
	}
	return string;
}
Util.Form.customSend["json"] = function(params, form) {
	params = u.cleanParams(params, form);
	object = u.f.convertNamesToJsonObject(params);
	return JSON.stringify(object);
}
Util.Form.customSend["object"] = function(params, form) {
	return u.cleanParams(params, form);
}
Util.Form.customSend["jdata"] = function(params, form) {
	params = u.cleanParams(params, form);
	object = u.f.convertNamesToJsonObject(params);
	return "jdata=" + encodeURIComponent(JSON.stringify(object));
}
Util.Form.customInit = new Object();
Util.Form.customInit["date"] = function(field) {
	var form = field._form;
	field.iN = u.qs("input", field);
	field.iN.field = field;
	field.iN.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
	u.as(field.iN, "display", "none");
	form.fields[field.iN.name] = field.iN;
	var date = parseInt(field.iN.value);
	var day = "";
	var month = "";
	var year = "";
	if(date) {
		day = u.date("d", date);
		month = u.date("m", date);
		year = u.date("Y", date);
	}
	var date_ui = u.ae(field, "div");
	field.insertBefore(date_ui, field.iN);
	field.year = u.ae(date_ui, "input", {"name":"year","maxlength":"4","class":"ignoreinput year","value":year})
	field.year.field = field;
	field.year.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
	field.year.field_order = form.field_order.length;
	form.field_order[form.field_order.length] = field.year;
	field.year.done = function() {
		if(!isNaN(this.val()) && this.val().length == 4 && u.f.validate(this)) {
			if(this.field._form.field_order[this.field_order+1]) {
				this.field._form.field_order[this.field_order+1].focus();
			}
		}
	}
	u.e.addEvent(field.year, "keyup", field.year.done);
	u.ae(date_ui, "span").innerHTML = ".";
	field.month = u.ae(date_ui, "input", {"name":"month","maxlength":"2","class":"ignoreinput month","value":month})
	field.month.field = field;
	field.month.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
	field.month.field_order = form.field_order.length;
	form.field_order[form.field_order.length] = field.month;
	field.month.done = function() {
		if(!isNaN(this.val()) && this.val().length == 2 && u.f.validate(this)) {
			if(this.field._form.field_order[this.field_order+1]) {
				this.field._form.field_order[this.field_order+1].focus();
			}
		}
	}
	u.e.addEvent(field.month, "keyup", field.month.done);
	u.ae(date_ui, "span").innerHTML = ".";
	field.day = u.ae(date_ui, "input", {"name":"day","maxlength":"2","class":"ignoreinput day","value":day})
	field.day.field = field;
	field.day.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
	field.day.field_order = form.field_order.length;
	form.field_order[form.field_order.length] = field.day;
	field.day.done = function() {
		if(!isNaN(this.val()) && this.val().length == 2 && u.f.validate(this)) {
			if(this.field._form.field_order[this.field_order+1]) {
				this.field._form.field_order[this.field_order+1].focus();
			}
		}
	}
	u.e.addEvent(field.day, "keyup", field.day.done);
	u.f.submitOnEnter(field.year);
	u.f.submitOnEnter(field.month);
	u.f.submitOnEnter(field.day);
	u.f.activate(field.year);
	u.f.activate(field.month);
	u.f.activate(field.day);
	u.f.validate(field.year);
	u.f.validate(field.month);
	u.f.validate(field.day);
	u.e.addEvent(field.day, "keyup", u.f._update);
	u.e.addEvent(field.month, "keyup", u.f._update);
	u.e.addEvent(field.year, "keyup", u.f._update);
	u.e.addEvent(field.day, "change", u.f._validateInput);
	u.e.addEvent(field.month, "change", u.f._validateInput);
	u.e.addEvent(field.year, "change", u.f._validateInput);
}
Util.Form.customValidate = new Object();
Util.Form.customValidate["date"] = function(iN) {
	var field = iN.field;
	u.rc(field.iN, "error");
	if(u.hc(iN, "year")) {
		if(((!isNaN(iN.value) && iN.value > 1970) || (!field._required && !iN.value))) {
			u.f.fieldCorrect(iN);
		}
		else {
			u.f.fieldError(iN);
		}
	}
	if(u.hc(iN, "month")) {
		if(((!isNaN(iN.value) && (iN.value > 0 && iN.value <= 12)) || (!field._required && !iN.value))) {
			u.f.fieldCorrect(iN);
		}
		else {
			u.f.fieldError(iN);
		}
	}
	if(u.hc(iN, "day")) {
		if(((!isNaN(iN.value) && (iN.value > 0 && ((iN.field.year.value && iN.field.month.value && iN.value <= new Date(iN.field.year.value, iN.field.month.value, 0).getDate()) || (!iN.field.year.value || !iN.field.month.value && iN.value <= 31)))) || (!field._required && !iN.value))) {
			u.f.fieldCorrect(iN);
		}
		else {
			u.f.fieldError(iN);
		}
	}
	if(u.qs("input.error", field)) {
		u.f.fieldError(field.iN);
	}
	else {
		if(new Date(Number(field.year.val()), Number(field.month.val())-1, Number(field.day.val())).getTime() > 0) {
			field.iN.value = new Date(Number(field.year.val()), Number(field.month.val())-1, Number(field.day.val())).getTime();
			var after = u.getIJ(field, "after");
			if(after) {
				if(Number(field.iN.value) > Number(field._form.fields[after].value)) {
					u.f.fieldCorrect(field.iN);
				}
				else {
					u.f.fieldError(field.iN);
				}
			}
			else {
				u.f.fieldCorrect(field.iN);
			}
		}
		else {
			u.f.fieldError(field.iN);
		}
	}
}
Util.Objects["form"] = new function() {
	this.init = function(content) {
		var form;
		if(content.nodeName.toLowerCase() == "form") {
			form = content;
		}
		else {
			var form = u.qs("form", content);
		}
		form._content = content;
		form._type = u.getIJ(form, "type");
		form._type = form._type ? form._type : "manual";
		form._send = u.getIJ(form, "send");
		form._send = form._send ? form._send : "parameters";
		form.Response = function(response) {
			if(response.isJSON) {
				var template = u.qs(".template", this._content);
				if(template && response && response.result) {
					var i, node;
					for(i = 0; node = template.parentNode.childNodes[i]; i++) {
						if(!node.className || !node.className.match(/header|template/i)) {
							template.parentNode.removeChild(node);
							i--;
						}
					}
					var html = u.template(template, response.result);
					var temp = document.createElement(template.parentNode.nodeName);
					temp.innerHTML = html;
					var child;
					while(child = temp.firstChild) {
						template.parentNode.appendChild(child);
					}
					u.init();
				}
				else if(form.fields && form.fields.response_success_forward_url) {
					var forward_url = form.fields.response_success_forward_url.value;
					if(response.success) {
						u.formStateUnChanged();
						if(form.fields.response_success_forward_parameters) {
							forward_url += "?";
							var params = form.fields.response_success_forward_parameters.value.split(",");
							var i, param;
							for(i = 0; param = params[i]; i++) {
								param = param.trim();
								if(response[param]) {
									forward_url += param+"="+response[param]+"&";
								}
								else if(form.fields[param]) {
									forward_url += param+"="+form.fields[param].val()+"&";
								}
							}
						}
						location.href = forward_url;
					}
				}
				else if(response && response.success_msg) {
					u.notify(response.success_msg, "receipt", response.message_target ? response.message_target : false);
				}
			}
			else if(response.isHTML) {
				u.bug("response HTML")
			}
			if(typeof(this.loaded) == "function") {
				this.loaded(response);
			}
			u.loaded(this._content);
		}
		u.f.init(form);
		if(typeof(form.submitted) != "function" && form._type != "html") {
			form.submitted = function(iN) {
				u.loading(this._content);
				u.Request(this, this.action, u.f.getParams(this, {"type":this._send}), this.method);
				if(typeof(form.isSubmitted) == "function") {
					form.isSubmitted(iN);
				}
			}
		}
		if(form._type == "auto") {
			u.loading(content);
			u.Request(form, form.action, u.f.getParams(form, {"type":form._send}), form.method);
		}
	}
}
Util.Objects["tabs"] = new function() {
	this.init = function(tabset) {
		var i, tab, pane;
		tabset.tabs = u.qsa("li.tab", tabset);
		tabset.selectTab = function(id) {
			var i, tab, pane;
			for(i = 0; tab = this.tabs[i]; i++) {
				if(tab.tab_id != id) {
					u.rc(tab, "selected");
				}
				else {
					u.ac(tab, "selected");
				}
			}
			for(i = 0; pane = this.panes[i]; i++) {
				if(pane.tab_id != id) {
					u.rc(pane, "selected");
				}
				else {
					u.ac(pane, "selected");
				}
			}
		}
		var panes = u.ae(tabset, "li", "tab_panes");
		var selected_tab = false;
		for(i = 0; tab = tabset.tabs[i]; i++) {
			tab.tab_id  = tab.className.replace(/tab |tab|selected |selected/, "");
			if(tab.tab_id) {
				tab.tabset = tabset;
				pane  = panes.appendChild(u.qs(".body", tab));
				pane.tab_id = tab.tab_id;
				u.ac(pane, tab.tab_id);
				u.e.click(tab);
				tab.clicked = function() {
					this.tabset.selectTab(this.tab_id);
				}
			}
			else {
				alert("No tab identifier class for:" + u.qs(".header", tab).innerHTML);
			}
		}
		tabset.panes = u.qsa(".body", panes);
		var selected_tab = u.qs("li.tab.selected", tabset);
		if(selected_tab) {
			tabset.selectTab(selected_tab.tab_id);
		}
		else {
			tabset.selectTab(tabset.tabs[0].tab_id);
		}
	}
}
Util.Objects["nestedchecking"] = new function() {
	this.init = function(e) {
		var checkboxes = u.qsa("input[type=checkbox]", e);
		var checkbox, i;
		for(i = 0; checkbox = checkboxes[i]; i++) {
			if(checkbox.getAttribute("checked") == "false") {
				checkbox.removeAttribute("checked");
			}
			if(u.hc(checkbox, "is_disabled_true")) {
				checkbox.disabled = "disabled";
			}
			checkbox.clicked = function() {
				var nested_checkboxes = u.qsa("input[type=checkbox]", this.parentNode);
				var nested_checkbox, i;
				for(i = 0; nested_checkbox = nested_checkboxes[i]; i++) {
					if(nested_checkbox != this && !nested_checkbox.disabled) {
						if(!this.checked) {
							nested_checkbox.checked = false;
						}
						else {
							nested_checkbox.checked = true;
						}
					}
				}
			}
			u.e.addEvent(checkbox, "change", checkbox.clicked);
		}
	}
}
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

Util.Objects["page"] = new function() {
	this.init = function(e) {
		var i, node;
		e.hints = function() {
			var hints = u.qsa("[title]", this);
		}
		e.overlay = function(content) {
			if(!this.overlay) {
				this.overlay = u.ae(document.body, "div", ({"class":"overlay"}));
				this.overlay.page = this;
				this.overlay.appendChild(content.cloneNode(true));
				this.overlay.close = u.qs(".header .close");
				this.overlay.close.layover = this.layover;
				u.link(this.overlay.close);
				this.overlay.close.clicked = function(event) {
					this.overlay.transitioned = function(event) {
						u.as(this, "display", "none");
					}
					u.a.transition(this.overlay, "all 0.5s ease-out");
					u.a.setOpacity(this.overlay, 0);
					if(typeof(this.overlay.closed) == "function") {
						this.overlay.closed(event);
					}
				}
			}
		}
		e._showOptions = function() {
			u.t.resetTimer(this.t_hide);
			this.open = true;
			u.ac(this.bn, "open");
			u.a.transition(this, "none");
			this.transitioned = null;
			u.a.setOpacity(this, 0);
			u.as(this, "display", "block");
			u.a.transition(this, "all 0.1s ease-in");
			u.a.setOpacity(this, 1);
			if(u.e.event_pref == "mouse") {
				this.onmouseout = function(event) {
					this.t_hide = u.t.setTimer(this, this.hide, "1000");
				}
				this.onmouseover = function(event) {
					u.t.resetTimer(this.t_hide);
				}
				var nodes = u.qs("li", this);
				var i, node;
				for(i = 0; node = nodes[i]; i++) {
					node.list = this;
					this.onmouseover = function(event) {
						u.t.resetTimer(this.list.t_hide);
					}
				}
			}
		}
		e._hideOptions = function() {
			u.t.resetTimer(this.t_hide);
			this.open = false;
			u.rc(this.bn, "open");
			u.a.transition(this, "all 0.2s ease-out");
			u.a.setOpacity(this, 0);
			this.transitioned = function(event) {
				u.a.transition(this, "none");
				this.transitioned = null;
				u.as(this, "display", "none");
			}
		}
		e.setupOptions = function(node) {
			node.menu = u.qs("ul", node);
			node.menu.bn = node;
			node.menu.hide = this._hideOptions;
			node.menu.show = this._showOptions;
			u.e.click(node);
			node.clicked = function(event) {
				u.e.kill(event);
				if(!this.menu.open) {
					this.menu.show();
				}
				else {
					this.menu.hide();
				}
			}
			u.e.click(node.menu);
			node.menu.clicked = function(event) {
				u.e.kill(event);
			}
			var nodes = u.qsa("li", node);
			var i, menuitem;
			for(i = 0; menuitem = nodes[i]; i++) {
				var notification = u.qs(".notification", menuitem);
				if(notification) {
					u.qs("a", menuitem).appendChild(notification);
				}
			}
		}
		e.hN = u.qs("#header", e);
		e.hN.page = e;
		e.cN = u.qs("#content", e);
		e.cN.page = e;
		e.hN.user = u.qs(".user", e.hN);
		if(e.hN.user) {
			e.hN.user.page = e;
			e.setupOptions(e.hN.user);
			e.hN.user.clicked = function(event) {
				u.e.kill(event);
				if(!this.menu.open) {
					this.menu.show();
					if(this.page.nN && this.page.nN.menu.open) {
						e.nN.menu.hide();
					}
				}
				else {
					this.menu.hide();
				}
			}
		}
		e.nN = u.qs("#navigation", e);
		if(e.nN) {
			e.nN.page = e;
			e.setupOptions(e.nN);
			e.nN.clicked = function(event) {
				u.e.kill(event);
				if(!this.menu.open) {
					this.menu.show();
					if(this.page.hN.user && this.page.hN.user.menu.open) {
						e.hN.user.menu.hide();
					}
				}
				else {
					this.menu.hide();
				}
			}
		}
		e._scrollHandler = function(event) {
			var page = u.qs("#page");
			if(u.scrollY() > 0) {
				u.ac(page, "scrolled")
			}
			else {
				u.rc(page, "scrolled")
			}
		}
		u.e.addEvent(window, "scroll", e._scrollHandler);
		e._scrollHandler();
	}
}

Util.Sort = u.s = new function() {
	this.sortable = function(e) {
		var i, j, node;
		var target_class = u.getIJ(e, "targets");
		e.targets = target_class ? "."+target_class : "li";
		e.nodes = u.qsa(e.targets, e);
		for(i = 0; node = e.nodes[i]; i++) {
			node.e = e;
			node.dragme = true;
			node.rel_ox = u.relOffsetX(node);
			node.rel_oy = u.relOffsetY(node);
			node.drag = u.qs(".drag", node);
			if(!node.drag) {
				node.drag = node;
			}
			node.drag.node = node;
			var drag_children = u.qsa("*", node.drag);
			if(drag_children) {
				for(j = 0; child = drag_children[j]; j++) {
					child.node = node;
				}
			}
			u.e.addStartEvent(node.drag , this._pick);
		}
		e.injectTarget = function(node) {
			var i, node, nodes;
			if(!this.tN.parentNode || (this.tN.parentNode && this.tN.i > node.i)) {
				this.insertBefore(this.tN, node);
			}
			else {
				this.appendChild(this.tN);
			}
			nodes = u.qsa(this.targets, this);
			for(i = 0; node = nodes[i]; i++) {
				node.i = i;
			}
		}
		e._scrollWindowY = function() {
			if((u.pageScrollY() + this.scroll_speed) >= 0 && (u.pageScrollY() + this.scroll_speed) <= u.htmlH() - u.browserH()) {
				window.scrollBy(0, this.scroll_speed);
				this.t_scroller = u.t.setTimer(this, this._scrollWindowY, 50);
			}
		}
	}
	this._pick = function(event) {
		u.e.kill(event);
		if(this.node.e.t_scroller) {
			u.t.resetTimer(this.node.e.t_scroller);
			this.node.e.scroll_speed = 0;
		}
		if(!this.node.e.dragged) {
			var node = this.node.e.dragged = this.node;
			node.start_opacity = u.gcs(node, "opacity");
			node.start_position = u.gcs(node, "position");
			if(!node.e.tN) {
				node.e.tN = document.createElement(node.nodeName);
			}
			u.sc(node.e.tN, "target " + node.className);
			u.as(node.e.tN, "height", u.actualHeight(node)+"px");
			u.as(node.e.tN, "width", u.actualWidth(node)+"px");
			u.as(node.e.tN, "opacity", node.start_opacity - 0.5);
			node.e.tN.innerHTML = node.innerHTML;
			u.as(node, "width", u.actualWidth(node) + "px");
			u.as(node, "height", u.actualHeight(node) + "px");
			u.as(node, "opacity", node.start_opacity - 0.3);
			u.as(node.e, "width", u.actualWidth(node.e) + "px");
			u.as(node.e, "height", u.actualHeight(node.e) + "px");
			node.mouse_ox = u.eventX(event) - u.absX(node);
			node.mouse_oy = u.eventY(event) - u.absY(node);
			u.as(node, "left", (u.eventX(event) - node.rel_ox) - node.mouse_ox+"px");
			u.as(node, "top", (u.eventY(event) - node.rel_oy) - node.mouse_oy+"px");
			u.as(node, "bottom", "auto");
			u.as(node, "right", "auto");
			u.ac(node, "dragged");
			u.as(node, "position", "absolute");
			u.e.addMoveEvent(document.body , u.s._drag);
			u.e.addEndEvent(document.body , u.s._drop);
			document.body.e = node.e;
			node.e.injectTarget(node);
			if(typeof(node.e.picked) == "function") {
				node.e.picked(event);
			}
		}
	}
	this._drag = function(event) {
		var i, node;
		u.e.kill(event);
		if(this.e.t_scroller) {
			u.t.resetTimer(this.e.t_scroller);
			this.e.scroll_speed = 0;
		}
		if(this.e.dragged) {
			var m_left = u.eventX(event);
			var m_top = u.eventY(event);
			var d_left = m_left - this.e.dragged.mouse_ox;
			var d_top = m_top - this.e.dragged.mouse_oy;
			u.as(this.e.dragged, "left", d_left - this.e.dragged.rel_ox+"px");
			u.as(this.e.dragged, "top", d_top - this.e.dragged.rel_oy+"px");
			for(i = 0; node = this.e.nodes[i]; i++) {
				if(node != this.e.dragged && node != this.e.tN) {
					var o_left = u.absX(node);
					var o_top = u.absY(node);
					var o_width = node.offsetWidth;
					var o_height = node.offsetHeight;
				 	if(o_left < m_left && (o_left + o_width) > m_left && o_top < m_top && (o_top + o_height) > m_top) {
						this.e.injectTarget(node);
						break;
					}
				}
			}
			if(u.browserH() < u.htmlH()) {
				if(u.scrollY() >= d_top - 10) {
					this.e.scroll_speed = -5;
					this.e._scrollWindowY();
				}
				else if(u.browserH() + u.scrollY() < d_top + this.e.dragged.offsetHeight + 10) {
					this.e.scroll_speed = 5;
					this.e._scrollWindowY();
				}
				else {
					u.t.resetTimer(this.e.t_scroller);
				}
			}
		}
		if(typeof(this.e.dragged) == "function") {
			this.e.dragged(event);
		}
	}
	this._drop = function(event) {
		u.e.kill(event);
		u.e.removeMoveEvent(document.body , u.s._drag);
		u.e.removeEndEvent(document.body , u.s._drop);
		this.e.tN = this.e.replaceChild(this.e.dragged, this.e.tN);
		u.as(this.e.dragged, "position", this.e.dragged.start_position);
		u.as(this.e.dragged, "opacity", this.e.dragged.start_opacity);
		u.as(this.e.dragged, "left", "");
		u.as(this.e.dragged, "top", "");
		u.as(this.e.dragged, "bottom", "");
		u.as(this.e.dragged, "width", "");
		u.as(this.e, "width", "");
		u.as(this.e, "height", "");
		u.rc(this.e.dragged, "dragged");
		this.e.dragged = false;
		u.t.resetTimer(this.e.t_scroller);
		this.e.scroll_speed = 0;
		this.e.nodes = u.qsa(this.e.targets, this.e);
		if(typeof(this.e.dropped) == "function") {
			this.e.dropped(event);
		}
	}
}

Util.Objects["widgets"] = new function() {
	this.init = function(e) {
		e.page = u.qs("#page");
		e.adjustWidths = function() {
			var i;
			var use_width = this.page.cN.offsetWidth - this.page.cN.offsetWidth%2;
			u.a.setWidth(e, use_width + 20);
			for(i = 0; widget = this.widgets[i]; i++) {
				if(u.hc(widget, "half")) {
					u.a.setWidth(widget, (use_width/2) - 10);
				}
				else {
					u.a.setWidth(widget, (use_width));
				}
			}
		}
		e.resized = function() {
			var w = u.qs("#content ul.widgets");
			w.adjustWidths();
		}
		u.e.addEvent(window, "resize", e.resized);
		e.widgets = u.qsa(".widget", e);
		for(i = 0; widget = e.widgets[i]; i++) {
			widget.settings = u.qs(".header .settings", widget);
			e.page.setupOptions(widget.settings);
			widget.settings.menu.remove = u.qs(".remove", widget.settings.menu);
			widget.settings.menu.remove.widget = widget;
			widget.settings.menu.remove.form = u.qs("form", widget.settings.menu.remove);
			if(widget.settings.menu.remove.form) {
				widget.settings.menu.remove.form.onsubmit = function() {return false;}
				u.e.click(widget.settings.menu.remove);
				widget.settings.menu.remove.clicked = function(event) {
					this.Response = function(response) {
						this.app_id = u.qs("input", this);
						if(response && response.success) {
							u.notify("App removed", "receipt");
							this.widget.transitioned = function() {
								u.as(this, "display", "none");
							}
							u.a.transition(this.widget, "all 0.3s ease-out");
							u.a.setOpacity(this.widget, 0);
							if (this.app_id) {
								this.app_id = "#nav_" + this.app_id.value;
								this.nav_li = u.qs(this.app_id);
								if (this.nav_li) {
									this.nav_li.parentNode.removeChild(this.nav_li);
								}
							}
						}
						else {
							if(response) {
								u.notify(response.error_msg, "error");
							}
							else {
								u.notify("Unknown error", "error");
							}
						}
					}
					u.Request(this, this.form.action, u.f.getParams(this.form, "string"), this.form.method);
				}
			}
			widget.header = u.qs(".header", widget);
			u.ac(widget, "dwidget");
			u.ie(widget.header, "div", ({"class":"drag"}));
			e.adjustWidths(widget);
		}
		u.ac(e, "targets:dwidget");
		u.s.sortable(e);
		e.dropped = function() {
			this.adjustWidths();
		}
		e.transitioned = function(event) {
			this.transitioned = null;
			u.a.transition(this, "none");
		}
		u.a.transition(e, "all 0.3s ease-in");
		u.a.setOpacity(e, 1);
	}
}
Util.Objects["widgetIM"] = new function() {
	this.init = function(e) {
		var i, node;
		var nodes = u.qsa("tr", e);
		for(i = 1; node = nodes[i]; i++) {
			u.link(node);
			node.clicked = function() {
				window.open(this.url, "_blank");
			}
		}
	}
}

Util.Objects["logon"] = new function() {
	this.init = function(e) {
		e.page = u.qs("#page");
		var overlay = u.qs(".overlay");
		e.signin = u.qs(".box.signin", e);
		e.signin.e = e;
		e.signin.form = u.qs("form", e.signup)
		e.signin.form.onsubmit = function() {return false;}
		e.signin.logonuidfield = u.qs("#logonuidfield", e.signin);
		e.signin.field_username = u.qs("div.username", e.signin);
		e.signin.field_username.iN = u.qs("input", e.signin.field_username);
		e.signin.field_username.iN.e = e;
			e.signin.field_username.iN.focus();
		e.signin.field_username.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.signin.checkUser();
			}
		}
		e.signin.field_password = u.qs("div.password", e.signin);
		e.signin.field_password.iN = u.qs("input", e.signin.field_password);
		e.signin.field_password.iN.e = e;
		e.signin.field_password.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.signin.checkUser();
			}
		}
		e.signin.bn_submit = u.qs(".submit .button", e.signin);
		e.signin.bn_submit.e = e;
		e.signin.bn_submit.type = "button";
		u.e.click(e.signin.bn_submit);
		e.signin.bn_submit.clicked = function(event) {
			u.e.kill(event);
			this.e.signin.checkUser();
		}
		e.signin.checkUser = function() {
			u.rc(this.e.signin.field_username, "error");
			u.rc(this.e.signin.field_password, "error");
			this.e.signin.error = false;
			if(!this.e.signin.field_username.iN.value) {
				this.e.signin.error = true;
				u.ac(this.e.signin.field_username, "error");
			}
			if(!this.e.signin.field_password.iN.value) {
				this.e.signin.error = true;
				u.ac(this.e.signin.field_password, "error");
			}
			if(this.e.signin.error) {
				this.e.signin.field_username.iN.focus();
			}
			else if(!this.e.signin.error) {
				this.Response = function(response) {
					this.response = response;
					if(response.success) {
						this.logonuidfield.value = response.userid
						this.form.submit();
					}
					else {
						if(response.terms_accepted === false) {
							this.Response = function(response) {
								var overlay = u.qs(".overlay", response)
								if(overlay) {
									document.body.appendChild(overlay);
									overlay.terms_error_msg = this.terms_error_msg;
									var box = u.qs(".box", overlay);
									u.a.setOpacity(overlay, 0);
									u.as(overlay, "display", "block");
									u.a.setHeight(overlay, e.page.offsetHeight);
									u.as(box, "top", ((u.browserH()-box.offsetHeight)/2 + u.scrollY()) + "px")
									u.a.transition(overlay, "all 0.3s ease-out");
									u.a.setOpacity(overlay, 1);
									overlay.close = u.qs(".header .close", overlay);
									overlay.close.overlay = overlay;
									u.link(overlay.close);
									overlay.close.clicked = function(event) {
										u.e.kill(event);
										this.overlay.transitioned = function(event) {
											this.parentNode.removeChild(this);
										}
										u.a.transition(this.overlay, "all 0.5s ease-out");
										u.a.setOpacity(this.overlay, 0);
									}
									overlay.cancel = u.qs(".cancel .button", overlay);
									overlay.cancel.overlay = overlay;
									overlay.cancel.removeAttribute("href");
									u.e.click(overlay.cancel);
									overlay.cancel.clicked = function(event) {
										this.overlay.transitioned = function(event) {
											this.parentNode.removeChild(this);
										}
										u.a.transition(this.overlay, "all 0.5s ease-out");
										u.a.setOpacity(this.overlay, 0);
									}
									overlay.accept = u.qs(".accept .button", overlay);
									overlay.accept.removeAttribute("href");
									overlay.accept.e = this.e;
									u.e.click(overlay.accept);
									overlay.accept.clicked = function(event) {
										this.Response = function(response) {
											this.e.signin.logonuidfield.value = this.e.signin.response.userid;
											this.e.signin.form.submit();
										}
										u.Request(this, "/util/MDSetTermsAcceptedByUserId?userid="+this.e.signin.response.userid, false, "POST");
									}
								}
							}
							this.terms_error_msg = response.terms_error_msg;
							u.Request(this, "/ajax/terms.html");
						}
						else if(!response.logon_accepted) {
						}
					}
				}
				u.Request(this, "/util/SECCheckUser?userid=" + this.field_username.iN.value + "&password=" + encodeURIComponent(this.field_password.iN.value), false, "POST");
			}
		}
		e.signin.bn_reset = u.qs(".reset", e.signin);
		e.signin.bn_reset.e = e;
		e.signin.bn_reset.removeAttribute("href");
		u.e.click(e.signin.bn_reset);
		e.signin.bn_reset.clicked = function(event) {
			u.e.kill(event);
			this.e.signin.transitioned = function(event) {
				this.transitioned = null;
				u.a.setOpacity(this.e.reset, 0);
				u.as(this.e.reset, "display", "block");
				u.as(this, "display", "none");
				u.a.transition(this.e.reset, "all 0.3s ease-out");
				u.a.setOpacity(this.e.reset, 1);
				this.e.reset.field_email.iN.focus();
			}
			u.a.transition(this.e.signin, "all 0.3s ease-out");
			u.a.setOpacity(this.e.signin, 0);
		}
		e.reset = u.qs(".box.reset", e);
		e.reset.e = e;
		e.reset.form = u.qs("form", e.reset)
		e.reset.form.onsubmit = function() {return false;}
		e.reset.field_email = u.qs("div.email", e.reset);
		e.reset.field_email.iN = u.qs("input", e.reset.field_email);
		e.reset.field_email.iN.e = e;
		e.reset.field_email.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.reset.resetUser();
				return false;
			}
		}
		e.reset.bn_cancel = u.qs(".cancel .button", e.reset);
		e.reset.bn_cancel.e = e;
		e.reset.bn_cancel.removeAttribute("href");
		u.e.click(e.reset.bn_cancel);
		e.reset.bn_cancel.clicked = function(event) {
			u.e.kill(event);
			this.e.reset.transitioned = function(event) {
				this.transitioned = null;
				u.a.setOpacity(this.e.signin, 0);
				u.as(this.e.signin, "display", "block");
				u.as(this, "display", "none");
				u.a.transition(this.e.signin, "all 0.3s ease-out");
				u.a.setOpacity(this.e.signin, 1);
				this.e.signin.field_username.iN.focus();
			}
			u.a.transition(this.e.reset, "all 0.3s ease-out");
			u.a.setOpacity(this.e.reset, 0);
		}
		e.reset.bn_submit = u.qs(".submit .button", e.reset);
		e.reset.bn_submit.e = e;
		e.reset.bn_submit.type = "button";
		u.e.click(e.reset.bn_submit);
		e.reset.bn_submit.clicked = function(event) {
			u.e.kill(event);
			this.e.reset.resetUser();
		}
		e.reset.resetUser = function() {
			u.rc(this.e.reset.field_email, "error");
			this.e.reset.error = false;
			if(!this.e.reset.field_email.iN.value) {
				this.e.reset.error = true;
				u.ac(this.e.reset.field_email, "error");
			}
			if(!this.e.reset.error) {
				this.Response = function(response) {
					if(response.success) {
						u.notify("Mail sent, check email", "receipt");
						this.bn_cancel.clicked();
					}
					else {
						u.notify(response.error_msg, "error");
					}
				}
				u.Request(this, this.form.action, u.f.getParams(this.form, "string"), this.form.method);
			}
		}
	}
}
Util.Objects["createpassword"] = new function() {
	this.init = function(e) {
		e.page = u.qs("#page");
		e.box = u.qs(".box", e);
		e.box.e = e;
		e.box.form = u.qs("form", e.box)
		e.box.form.onsubmit = function() {return false;}
		e.box.sap_form = u.qs(".SAP form", e.box)
		e.box.field_oldpassword = u.qs("div.oldpassword", e.box);
		e.box.field_oldpassword.iN = u.qs("input", e.box.field_oldpassword);
		e.box.field_oldpassword.iN.e = e;
		e.box.field_oldpassword.iN.focus();
		e.box.field_oldpassword.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.box.submitted();
			}
		}
		e.box.field_newpassword = u.qs("div.newpassword", e.box);
		e.box.field_newpassword.iN = u.qs("input", e.box.field_newpassword);
		e.box.field_newpassword.iN.e = e;
		e.box.field_newpassword.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.box.submitted();
			}
		}
		e.box.field_confirmpassword = u.qs("div.confirmpassword", e.box);
		e.box.field_confirmpassword.iN = u.qs("input", e.box.field_confirmpassword);
		e.box.field_confirmpassword.iN.e = e;
		e.box.field_confirmpassword.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.box.submitted();
			}
		}
		e.box.bn_update = u.qs(".update .button", e.box);
		e.box.bn_update.e = e;
		e.box.bn_update.type = "button";
		u.e.click(e.box.bn_update);
		e.box.bn_update.clicked = function(event) {
			u.e.kill(event);
			this.e.box.submitted();
		}
		e.box.submitted = function() {
			u.rc(this.field_oldpassword, "error");
			u.rc(this.field_newpassword, "error");
			u.rc(this.field_confirmpassword, "error");
			this.error = false;
			if(!this.field_oldpassword.iN.value) {
				this.error = true;
				u.ac(this.field_oldpassword, "error");
			}
			if(!this.field_newpassword.iN.value) {
				this.error = true;
				u.ac(this.field_newpassword, "error");
			}
			if(!this.field_confirmpassword.iN.value) {
				this.error = true;
				u.ac(this.field_confirmpassword, "error");
			}
			if(this.field_confirmpassword.iN.value != this.field_newpassword.iN.value) {
				this.error = true;
				u.ac(this.field_newpassword, "error");
				u.ac(this.field_confirmpassword, "error");
			}
			if(this.error) {
				this.field_oldpassword.iN.focus();
			}
			else if(!this.error) {
				this.Response = function(response) {
					if(response && response.success) {
						u.qs("#logonoldpassfield", this.sap_form).value = this.field_oldpassword.iN.value;
						u.qs("#logonnewpassfield", this.sap_form).value = this.field_newpassword.iN.value;
						u.qs("#logonretypepassfield", this.sap_form).value = this.field_confirmpassword.iN.value;
						this.sap_form.submit();
					}
					else {
						if(response) {
						}
						else {
							u.notify("unknown error", "error");
						}
					}
				}
				u.Request(this, this.form.action, u.f.getParams(this.form, "string"), this.form.method);
			}
		}
	}
}

Util.Objects["add_apps"] = new function() {
	this.init = function(e) {
		e.page = u.qs("#page");
		var apps = u.qsa(".app", e);
		var i, app;
		for(i = 0; app = apps[i]; i++) {
			app.form = u.qs(".add form", app);
			if(app.form) {
				app.form.onsubmit = function() {return false;}
				var add_app = u.qs(".button", app.form);
				add_app.app = app;
				u.e.click(add_app);
				add_app.clicked = function(event) {
					u.e.kill(event);
					this.Response = function(response) {
						if(response && response.success) {
							u.rc(this, "primary");
							u.ac(this, "disabled");
							this.value = response.installed_btn_text;
							u.notify(response.installed_msg_text, "receipt");
							if (this.form.appurl.value && this.form.appname.value) {
								var add_app_li = u.qs("#navigation ul li.add");
								var li_tag = document.createElement("li");
								add_app_li.parentNode.insertBefore(li_tag, add_app_li);
								var li_html = '<h4><a href="' + this.form.appurl.value + '">' + this.form.appname.value + '</a></h4>';
								li_tag.innerHTML = li_html;
							}
						}
					}
					u.Request(this, this.app.form.action, u.f.getParams(this.app.form, "string"), this.app.form.method);
				}
			}
		}
	}
}

Util.Objects["apps_details"] = new function() {
	this.init = function(e) {
		e.page = u.qs("#page");
		var app = u.qs(".app", e);
		app.form = u.qs("form", app);
		if(app.form) {
			app.form.onsubmit = function() {return false;}
			var add_app = u.qs(".button", app.form);
			add_app.app = app;
			u.e.click(add_app);
			add_app.clicked = function(event) {
				u.e.kill(event);
				this.Response = function(response) {
					if(response && response.success) {
						u.rc(this, "primary");
						u.ac(this, "disabled");
						this.value = response.installed_btn_text;
						u.notify(response.installed_msg_text, "receipt");
					}
					else {
						if(response) {
							u.notify(response.error_msg, "error");
						}
						else {
							u.notify("unknown error", "error");
						}
					}
				}
				u.Request(this, this.app.form.action, u.f.getParams(this.app.form, "string"), this.app.form.method);
			}
		}
		var img_div = u.qs(".image_box .image");
		var thumbnail_links = u.qsa(".image_box ul.thumbs li", e);
		var link;
		for (var i = 0; link = thumbnail_links[i]; i++) {
			u.link(link);
			link.clicked = function(event) {
				u.e.kill(event);
				for (var i = 0; i < thumbnail_links.length; i++) {
					u.rc(thumbnail_links[i], "sel");
				}
				img_div.innerHTML = '<img src="' + this.url + '" alt="img" />';
				u.ac(this, "sel");
			}
		}
	}
}

Util.Objects["feedback"] = new function() {
	this.init = function(e) {
		e.page = u.qs("#page");
		e.bn_feedback_open = u.qs("a", e);
		e.bn_feedback_open.e = e;
		e.bn_feedback_open.url = e.bn_feedback_open.href;
		e.bn_feedback_open.removeAttribute("href");
		u.e.click(e.bn_feedback_open);
		e.bn_feedback_open.clicked = function(event) {
			this.Response = function(response) {
				var panel = u.qs(".panel.feedback", response);
				u.a.setOpacity(panel, 0);
				this.panel = this.e.page.appendChild(panel);
				this.panel.header = u.qs(".header", this.panel);
				this.panel.body = u.qs(".body", this.panel);
				this.panel.form = u.qs("form", this.panel.body);
				this.panel.form.onsubmit = function() {return false;}
				this.panel.field_pageurl = u.qs("#fb_url_string", this.panel.body);
				this.panel.field_pageurl.value = location.href;
				this.panel.field_message = u.qs(".field.text", this.panel.body);
				this.panel.field_message.iN = u.qs("textarea", this.panel.field_message);
				this.panel.field_message.iN.focus();
        this.panel.actions = u.qs("ul.actions", this.panel.body);
        this.panel.actions.text_counter_wrap = u.ae(this.panel.actions, "li", "text_counter_wrap");
				this.panel.field_message.iN.text_counter = u.ie(this.panel.actions.text_counter_wrap, "div", "text_counter");
				this.panel.field_message.iN.text_counter.innerHTML = this.panel.field_message.iN.getAttribute("maxlength");
				this.panel.field_message.iN.onkeydown = function(event) {
					u.t.setTimer(this, function() {
						if(this.getAttribute("maxlength") - this.value.length < 0) {
							u.e.kill(event);
							u.ac(this.text_counter, "error");
						}
						else {
							if(this.getAttribute("maxlength") - this.value.length == 0) {
								u.ac(this.text_counter, "error");
							}
							else {
								u.rc(this.text_counter, "error");
							}
							this.text_counter.innerHTML = (this.getAttribute("maxlength") - this.value.length);
						}
					}, 10);
				}
				this.panel.bn_close = u.qs(".close", this.panel.header);
				this.panel.bn_close.panel = this.panel;
				u.link(this.panel.bn_close);
				this.panel.bn_close.clicked = function() {
					this.panel.transitioned = function(event) {
						u.a.transition(this, "none");
						this.transitioned = null;
						u.as(this, "display", "none");
					}
					u.a.transition(this.panel, "all 0.2s ease-out");
					u.a.setOpacity(this.panel, 0);
				}
				this.panel.send = u.qs(".submit .button.primary", this.panel.form);
				this.panel.send.panel = this.panel;
				u.e.click(this.panel.send);
				this.panel.send.clicked = function(event) {
					u.e.kill(event);
					u.rc(this.panel.field_message, "error");
					this.panel.error = false;
					if(!this.panel.field_message.iN.value) {
						this.panel.error = true;
						u.ac(this.panel.field_message, "error");
					}
					if(this.panel.error) {
						this.panel.field_message.iN.focus();
					}
					else if(!this.panel.error) {
						this.Response = function(response) {
							if(response && response.success) {
								this.panel.field_message.iN.value = "";
								this.panel.field_message.iN.text_counter.innerHTML = this.panel.field_message.iN.getAttribute("maxlength");
								u.notify(response.success_msg, "receipt", this.panel.body);
							}
							else {
								if(response) {
									u.notify(response.error_msg, "error", this.panel.body);
								}
								else {
									u.notify("Unknown error", "error", this.panel.body);
								}
							}
						}
						u.Request(this, this.panel.form.action, u.f.getParams(this.panel.form, "string"), this.panel.form.method);
					}
				}
				u.a.transition(this.panel, "all 0.1s ease-in");
				u.a.setOpacity(this.panel, 1);
			}
			u.Request(this, this.url);
		}
	}
}

Util.Objects["sharepage"] = new function() {
	this.init = function(e) {
		e.page = u.qs("#page");
		e.bn_sharepage_open = u.qs("a", e);
		e.bn_sharepage_open.e = e;
		e.bn_sharepage_open.url = e.bn_sharepage_open.href;
		e.bn_sharepage_open.removeAttribute("href");
		u.e.click(e.bn_sharepage_open);
		e.bn_sharepage_open.clicked = function(event) {
			this.Response = function(response) {
				var panel = u.qs(".panel.sharepage", response);
				u.a.setOpacity(panel, 0);
				this.panel = this.e.page.appendChild(panel);
				this.panel.header = u.qs(".header", this.panel);
				this.panel.body = u.qs(".body", this.panel);
				this.panel.form = u.qs("form", this.panel.body);
				this.panel.form.onsubmit = function() {return false;}
				this.panel.field_pageurl = u.qs("#url_string", this.panel.body).parentNode;
				this.panel.field_pageurl.iN = u.qs("#url_string", this.panel.field_pageurl)
				this.panel.field_pageurl.iN.value = location.href;
				this.panel.field_message = u.qs(".field.text", this.panel.body);
				this.panel.field_message.iN = u.qs("textarea", this.panel.field_message);
				this.panel.field_message.iN.focus();
				this.panel.field_recipients = u.qs("#recipient_string", this.panel.body).parentNode;
				this.panel.field_recipients.iN = u.qs("#recipient_string", this.panel.field_recipients)
				this.panel.field_recipients.iN.panel = this.panel;
				this.panel.field_recipients.iN.onkeydown = function(event) {
					event ? event : window.event;
					if(event.keyCode == 13) {
						u.e.kill(event);
						this.panel.send.clicked(event);
					}
				}
				this.panel.bn_close = u.qs(".close", this.panel.header);
				this.panel.bn_close.panel = this.panel;
				u.link(this.panel.bn_close);
				this.panel.bn_close.clicked = function() {
					this.panel.transitioned = function(event) {
						u.a.transition(this, "none");
						this.transitioned = null;
						u.as(this, "display", "none");
					}
					u.a.transition(this.panel, "all 0.2s ease-out");
					u.a.setOpacity(this.panel, 0);
				}
				this.panel.bn_cancel = u.qs(".button", this.panel.form).parentNode;
				this.panel.bn_cancel.panel = this.panel;
				u.link(this.panel.bn_cancel);
				this.panel.bn_cancel.clicked = this.panel.bn_close.clicked;
				this.panel.send = u.qs(".button.primary", this.panel.form);
				this.panel.send.panel = this.panel;
				u.e.click(this.panel.send);
				this.panel.send.clicked = function(event) {
					u.e.kill(event);
					u.rc(this.panel.field_message, "error");
					u.rc(this.panel.field_recipients, "error");
					this.panel.error = false;
					if(!this.panel.field_message.iN.value) {
						this.panel.error = true;
						u.ac(this.panel.field_message, "error");
					}
					if(!this.panel.field_recipients.iN.value) {
						this.panel.error = true;
						u.ac(this.panel.field_recipients, "error");
					}
					if(this.panel.error) {
						this.panel.field_message.iN.focus();
					}
					else if(!this.panel.error) {
						this.Response = function(response) {
							if(response && response.success) {
								this.panel.field_message.iN.value = "";
								this.panel.field_recipients.iN.value = "";
								u.notify(response.success_msg, "receipt", this.panel.body);
							}
							else {
								if(response) {
									u.notify(response.error_msg, "error", this.panel.body);
								}
								else {
									u.notify("Unknown error", "error", this.panel.body);
								}
							}
						}
						u.Request(this, this.panel.form.action, u.f.getParams(this.panel.form, "string"), this.panel.form.method);
					}
				}
				u.a.transition(this.panel, "all 0.1s ease-in");
				u.a.setOpacity(this.panel, 1);
			}
			u.Request(this, this.url);
		}
	}
}

Util.Objects["backbutton"] = new function() {
	this.init = function(back_li) {
		u.link(back_li);
		back_li.clicked = function(event) {
			var referer_field = u.qs("#refererpage");
			if (referer_field && (referer_field.value != "" || referer_field.value != "null")) {
				history.back();
			}
			else {
				location.href = this.url;
			}
		};
	}
}
Util.Objects["filterSelector"] = new function() {
	this.init = function(field) {
		var i, option;
		field.ul = u.ie(field, "ul");
		field.selected_option = u.ie(field, "div", ({"class":"selected_option"}));
		field.selected_option.field = field;
		field.selected_option.innerHTML = field.iN.options[field.iN.selectedIndex].text;
		u.e.click(field.selected_option);
		field.selected_option.clicked = function(event) {
			if(u.hc(this.field, "open")) {
				this.field._close();
			}
			else {
				this.field._open();
			}
		}
		field._open = function() {
			u.ac(this, "open");
			u.a.transition(this.ul, "none");
			u.a.setOpacity(this.ul, 0);
			u.as(this.ul, "display", "block");
			this.ul.transitioned = function(event) {
				u.a.transition(this, "none");
				this.transitioned = null;
			}
			u.a.transition(this.ul, "all 0.2s ease-in");
			u.a.setOpacity(this.ul, 1);
		}
		field._select = function(li) {
			this.iN.val(li._value);
			this._close();
		}
		field._close = function() {
			u.rc(this, "open");
			u.a.transition(this.ul, "none");
			u.a.setOpacity(this.ul, 0);
			u.as(this.ul, "display", "none");
		}
		for(i = 0; option = field.iN.options[i]; i++) {
			option.li = u.ae(field.ul, "li");
			option.li.field = field;
			option.li.innerHTML = option.text
			option.li._value = option.value;
			u.e.click(option.li);
			option.li.clicked = function(event) {
				this.field._select(this);
				this.field._form.submitted();
			}
		}
		field.iN.val = function(value) {
			if(value !== undefined) {
				var i, option;
				for(i = 0; option = this.options[i]; i++) {
					if(option.value == value) {
						this.selectedIndex = i;
						this.field.selected_option.innerHTML = option.text
						return i;
					}
				}
				return false;
			}
			else {
				return this.options[this.selectedIndex].value;
			}
		}
	}
}
Util.Objects["tdExpand"] = new function() {
	this.init = function(td) {
		u.ac(td, "togglable");
		td.toggler = u.ie(td, "div", "toggler");
		td.toggler.td = td;
		td._description = u.qs(".description", td);
		td._description.td = td;
		td._description.full_height = td._description.offsetHeight;
		u.a.setHeight(td._description, 0);
		u.e.click(td.toggler);
		td.toggler.clicked = function(event) {
			this.td._description.transitioned = function(event) {
				u.a.transition(this, "none");
				this.transitioned = null;
			}
			u.a.transition(this.td._description, "all 0.3s ease-out");
			if(u.hc(this.td, "open")) {
				u.a.setHeight(this.td._description, 0);
				u.rc(this.td, "open");
			}
			else {
				u.a.setHeight(this.td._description, this.td._description.full_height);
				u.ac(this.td, "open");
			}
		}
	}
}
Util.Objects["IssueManagerList"] = new function() {
	this.init = function(form) {
		form._reset = function() {
			this.row_count = 0;
			this.fields.count.value = 10;
			this.fields.from.value = 0;
			this.fields.sort.value = "";
			this.fields.sort_column.value = "";
			this.fields.query.value = "";
			this.fields.filter.val("");
			this.submitted();
		}
		form.bn_reset = u.qs(".actions .reset", form);
		form.bn_reset._form = form;
		u.e.click(form.bn_reset);
		form.bn_reset.clicked = function(event) {
			u.e.kill(event);
			this._form._reset();
		}
		form.bn_load_more = u.qs(".actions .more input", form);
		form.bn_load_more._form = form;
		u.e.click(form.bn_load_more);
		form.bn_load_more.clicked = function() {
			if(!u.hc(this, "disabled")) {
				this._form.fields.from.value = this._form.row_count;
				this._form.fields.count.value = 10;
				u.loading(this._form);
				u.Request(this, this._form.action, u.f.getParams(this._form, "parameters"), this._form.method);
			}
		}
		form.bn_load_more.Response = function(response) {
			if(response && response.isJSON) {
				var template = u.qs(".template", this._form);
				if(template && response.result) {
					var html = u.template(template, response.result);
					var temp = document.createElement(template.parentNode.nodeName);
					temp.innerHTML = html;
					var child;
					while(child = temp.firstChild) {
						template.parentNode.appendChild(child);
					}
					u.init();
				}
				else {
					alert("no template or no result!");
				}
			}
			u.loaded(this._form);
			this._form.loaded(response);
		}
		form.loaded = function(response) {
			this.row_count = u.qs(".template", this._form).parentNode.childNodes.length - 2;
			this.fields.from.value = 0;
			location.hash = this.fields.count.value+"/"+this.fields.from.value+"/"+this.fields.sort.value+"/"+this.fields.sort_column.value+"/"+this.fields.query.val()+"/"+this.fields.filter.val();
			if(response.show_more) {
				u.rc(this.bn_load_more, "disabled");
			}
			else {
				u.ac(this.bn_load_more, "disabled");
			}
		}
		form.sortable_headers = u.qsa(".header th.sortby", form);
		for(i = 0; header = form.sortable_headers[i]; i++) {
			var toggler = u.ae(header, "span", {"class":"sort"});
			header._form = form;
			u.e.click(header);
			header.clicked = function(event) {
				this._form.fields.sort_column.value = u.getIJ(this, "sortby");
				this._form.fields.sort.value = u.tc(this, "asc", "desc");
				this._form.resetSortableHeaders(this);
				this._form.submitted(this);
			}
		}
		form.resetSortableHeaders = function(selected) {
			for(i = 0; header = this.sortable_headers[i]; i++) {
				if(header != selected) {
					u.rc(header, "asc|desc");
				}
			}
		}
		if(location.hash.length > 1) {
			var values = location.hash.replace(/^#/, "").split("/");
			form.fields.count.value = u.stringOr(values[0]);
			form.fields.from.value = u.stringOr(values[1]);
			form.fields.sort.value = u.stringOr(values[2]);
			form.fields.sort_column.value = u.stringOr(values[3]);
			form.fields.query.val(u.stringOr(values[4]));
			form.fields.filter.val(u.stringOr(values[5]));
		}
		if(form.fields.sort_column.value && form.fields.sort.value) {
			var sort_by = u.qs("th."+ form.fields.sort_column.value, form);
			if(sort_by) {
				u.ac(sort_by, form.fields.sort.value);
			}
		}
		form.submitted();
	}
}
Util.Objects["IssueManagerView"] = new function() {
	this.init = function(content) {
		var issue = u.qs(".issue", content);
		issue.h5 = u.qs("h5", issue);
		issue.init_description = u.qs(".initdescription", issue);
		issue.init_description.full_height = u.gcs(issue.init_description, "height").replace("px", "");
		u.a.setHeight(issue.init_description, 0);
		u.e.click(issue.h5);
		issue.h5.clicked = function(event) {
			u.a.transition(this.parentNode.init_description, "all 0.2s ease-in");
			if(u.hc(this.parentNode, "open")) {
				u.rc(this.parentNode, "open");
				u.a.setHeight(this.parentNode.init_description, 0);
			}
			else {
				u.ac(this.parentNode, "open");
				u.a.setHeight(this.parentNode.init_description, this.parentNode.init_description.full_height);
			}
		}
	}
};
Util.Objects["IssueManagerComments"] = new function() {
	this.init = function(form) {
		u.f.init(form);
		form.Response = function(response) {
			if(response.isJSON) {
				var template = u.qs(".template", this);
				if(template && response && response.issue_dialog) {
					var i, node;
					for(i = 0; node = template.parentNode.childNodes[i]; i++) {
						if(!node.className || !node.className.match(/header|template/i)) {
							template.parentNode.removeChild(node);
							i--;
						}
					}
					this.comments_count = response.issue_dialog.length;
					this.comments_show_on_init = this.comments_count > 5 ? 5 : this.comments_count;
					this.comments = response.issue_dialog;
					for(i = 0; i < this.comments_show_on_init; i++) {
						var dialogue_no = this.comments_count-1 - i;
						var html = u.template(template, this.comments[dialogue_no]);
						var temp = document.createElement(template.parentNode.nodeName);
						temp.innerHTML = html;
						var child;
						while(child = temp.firstChild) {
							template.parentNode.insertBefore(child, template.parentNode.firstChild);
						}
					}
					this.bn_showall = u.qs(".actions .more", this);
					u.qs("input", form.bn_showall).value = u.qs("input", form.bn_showall).value.replace(/[0-9]+/, this.comments_count);
					if(this.comments_count > 5) {
						this.bn_showall._form = this;
						u.ac(this.bn_showall, "active");
						u.e.click(this.bn_showall);
						this.bn_showall.clicked = function(event) {
							if(!this.initialized) {
								this.initialized = true;
								var template = u.qs(".template", this._form);
								this.slide = u.qs(".slide", this._form);
								this.slide.collapsed_height = this.slide.offsetHeight
								this.list = u.qs(".list", this.slide);
								u.as(this.slide, "position", "relative");
								u.as(this.slide, "overflow", "hidden");
								u.a.setHeight(this.slide, this.slide.collapsed_height);
								u.as(this.list, "width", "100%");
								u.as(this.list, "position", "absolute");
								u.as(this.list, "left", 0);
								u.as(this.list, "bottom", 0);
								for(i = this._form.comments_show_on_init; i < this._form.comments_count; i++) {
									var dialogue_no = this._form.comments_count-1 - i;
									var html = u.template(template, this._form.comments[dialogue_no]);
									var temp = document.createElement(template.parentNode.nodeName);
									temp.innerHTML = html;
									var child;
									while(child = temp.firstChild) {
										template.parentNode.insertBefore(child, template.parentNode.firstChild);
									}
								}
							}
							var state = u.tc(this, "open");
							var duration = this.list.offsetHeight - this.slide.collapsed_height;
							if(state == "open") {
								u.a.transition(this.slide, "all "+duration+"ms ease-in");
								u.a.setHeight(this.slide, this.list.offsetHeight);
							}
							else {
								u.a.transition(this.slide, "all "+duration+"ms ease-in");
								u.a.setHeight(this.slide, this.slide.collapsed_height);
							}
						}
					}
					u.init();
				}
				else {
					u.qs("input", form.bn_showall).value = u.qs("input", form.bn_showall).value.replace(/[0-9]+/, "0");
				}
			}
			u.loaded(this);
		}
		form.submitted = function(iN) {
			u.loading(this);
			u.Request(this, this.action, u.f.getParams(this, "parameters"), this.method);
		}
		form._submit();
	}
}
Util.Objects["IssueManagerAddComment"] = new function() {
	this.init = function(form) {
		u.f.init(form);
		form.Response = function(response) {
			if(response.isJSON) {
				var template = u.qs(".comments .template");
				if(template && response && response.success) {
					u.notify(response.success_msg, "receipt", u.qs(".addcomment"));
					var json = {
						"sender_name":this.fields.sender_name.val(),
						"sender_initials":this.fields.sender_initials.val(),
						"comment_date":u.date("d.m.Y"),
						"message":this.fields.comment.val()
					};
					var html = u.template(template, json);
					var temp = document.createElement(template.parentNode.nodeName);
					temp.innerHTML = html;
					template.parentNode.appendChild(temp);
					this.fields.comment.val("");
					u.qs(".comments .actions .more input").value = u.qs(".comments .actions .more input").value.replace(/[0-9]+/, parseInt(u.qs(".comments .actions .more input").value)+1);
				}
				else {
				}
			}
			u.loaded(this);
		}
		form.submitted = function() {
			u.loading(this);
			u.Request(this, this.action, u.f.getParams(this, "parameters"), this.method);
		}
	}
}
Util.Objects["UserManagementUsers"] = new function() {
	this.init = function(form) {
		form._buttons = u.qsa("input[type=submit]", form);
		var button;
		for(i = 0; button = form._buttons[i]; i++) {
			u.ac(button, "disabled");
			u.e.click(button);
			button.clicked = function(event) {
				u.e.kill(event);
				if(!u.hc(this, "disabled")) {
					var var_object = new Object();
					var_object["agreementid"] = this.form.agreementid.value;
					var checkboxes = u.qsa("td.select input[type=checkbox]", this.form);
					var checkbox;
					if (checkboxes.length) {
						var users = new Array();
						for(i = 0; checkbox = checkboxes[i]; i++) {
							if (checkbox.checked) {
								var val = new Object();
								val["userid"] = checkbox.name;
								users[users.length] = val;
							}
						}
						var_object["users"] = users;
					}
					var params = JSON.stringify(var_object);
					this.form.Response = function(response) {
						if(response && response.success) {
							location.href = location.href;
						}
						else {
							u.notify(response.error_msg, "error");
						}
					}
					u.Request(this.form, this.form.save_url.value, "jdata=" + encodeURIComponent(params), "post");
				}
			}
		}
		form.sortable_headers = u.qsa(".header th.sortby", form);
		for(i = 0; header = form.sortable_headers[i]; i++) {
			var toggler = u.ae(header, "span", {"class":"sort"});
			header._form = form;
			u.e.click(header);
			header.clicked = function(event) {
				this._form.fields.sort_column.value = u.getIJ(this, "sortby");
				this._form.fields.sort.value = u.tc(this, "asc", "desc");
				this._form.resetSortableHeaders(this);
				this._form.submitted(this);
				this._form.attach_checkbox_events(this);
			}
		}
		form.resetSortableHeaders = function(selected) {
			for(i = 0; header = this.sortable_headers[i]; i++) {
				if(header != selected) {
					u.rc(header, "asc|desc");
				}
			}
		}
		form.select_all_checkbox = u.qs("th.select_all input[type=checkbox]", form);
		form.select_all_checkbox.clicked = function(event) {
			form.content_checkboxes = u.qsa("td.select input[type=checkbox]", form);
			for (var i = 1; i < this.form.content_checkboxes.length; i++) {
				this.form.content_checkboxes[i].checked = this.form.select_all_checkbox.checked;
			}
			this.form.single_checkbox_clicked();
		}
		u.e.addEvent(form.select_all_checkbox, "change", form.select_all_checkbox.clicked);
		form.single_checkbox_clicked = function(event) {
			form.content_checkboxes = u.qsa("td.select input[type=checkbox]", form);
			var no_of_sel_checkboxes = 0;
			var checkbox, button;
			var form_ref = (this.nodeName.toLowerCase() == "form") ? this : this.form;
			for (var i = 1; checkbox = form_ref.content_checkboxes[i]; i++) {
				if (checkbox.checked) {
					no_of_sel_checkboxes++;
				}
			}
			for (var i = 0; button = form_ref._buttons[i]; i++) {
				if (no_of_sel_checkboxes > 0) {
					u.rc(button, "disabled");
				}
				else {
					u.ac(button, "disabled");
					form.select_all_checkbox.checked = false;
				}
			}
		};
		form.attach_checkbox_events = function(obj) {
			form.content_checkboxes = u.qsa("td.select input[type=checkbox]", form);
			var checkbox;
			for(var i = 1; checkbox = this.content_checkboxes[i]; i++) {
				u.e.addEvent(this.content_checkboxes[i], "change", this.single_checkbox_clicked);
			}
		}
		form.attach_checkbox_events(this);
	}
}
Util.Objects["UserManagementAccounts"] = new function() {
	this.init = function(form) {
		form.bn_submits = u.qsa("input[type=submit]", form);
		form.onsubmit = function() {
			return false;
		}
		form._changed = function() {
			var i, bn_submit;
			for(i = 0; bn_submit = this._form.bn_submits[i]; i++) {
				u.rc(bn_submit, "disabled");
			}
			u.formStateChanged();
		}
		form._save = function() {
			if(!u.hasClass(this, "disabled")) {
				if(confirm("Are you sure that you want to update the agreement settings. This could have impact on the agreements users?")) {
					var var_object = new Array();
					var_object["agreement_id"] = u.qs("input[name=agreement_id]", this._form).value;
					var checkboxes = u.qsa("input[type=checkbox]", this._form);
					var checkbox, i;
					if(checkboxes.length) {
						for(i = 0; checkbox = checkboxes[i]; i++) {
							if(!checkbox.parentNode.className.match(/template/g)) {
								var field_object = checkbox.name.split("[");
								if(field_object.length == 2) {
									if(!var_object[field_object[0]]) {
										var_object[field_object[0]] = new Array();
									}
									var_object[field_object[0]][field_object[1].replace(/]/g, "")] = (checkbox.checked ? checkbox.value : 0);
								}
							}
						}
					}
					var params = form.toJsonString(var_object);
					this._form.Response = function(response) {
						u.formStateUnChanged();
						if(response && response.success) {
							u.notify(response.success_msg, "receipt");
							var i, bn_submit;
							for(i = 0; bn_submit = this.bn_submits[i]; i++) {
								bn_submit.this = this;
								u.ac(bn_submit, "disabled");
								u.e.addEvent(bn_submit, "click", this._save);
							}
						}
						else {
							u.notify(response.error_msg, "error");
						}
					}
					u.Request(this._form, u.qs("input[name=save_url]", this._form).value, "jdata=" + encodeURIComponent(params));
				}
			}
		}
		form.toJsonString = function(object) {
			var s = "{";
			for(name in object) {
				if(typeof(object[name]) == "object") {
					s += '"'+name+'":['+this.toJsonString(object[name])+']';
				}
				else {
					s += '"' + name + '":"' + object[name] + '",';
				}
			}
			s += "}";
			return s;
		}
		var i, bn_submit;
		for(i = 0; bn_submit = form.bn_submits[i]; i++) {
			bn_submit._form = form;
			u.ac(bn_submit, "disabled");
			u.e.addEvent(bn_submit, "click", form._save);
		}
		form._content = form;
		form._type = u.getIJ(form, "type");
		form._type = form._type ? form._type : "manual";
		form._send = u.getIJ(form, "send");
		form._send = form._send ? form._send : "parameters";
		form.Response = function(response) {
			if(response.isJSON) {
				var template = u.qs(".template", this._content);
				if(template && response && response.result) {
					var i, node;
					for(i = 0; node = template.parentNode.childNodes[i]; i++) {
						if(!node.className || !node.className.match(/header|template/i)) {
							template.parentNode.removeChild(node);
							i--;
						}
					}
					var html = u.template(template, response.result);
					var temp = document.createElement(template.parentNode.nodeName);
					temp.innerHTML = html;
					var child;
					while(child = temp.firstChild) {
						template.parentNode.appendChild(child);
					}
					u.o.nestedchecking.init(this);
					var checkboxes = u.qsa("input[type=checkbox]", this);
					var checkbox, i;
					for(i = 0; checkbox = checkboxes[i]; i++) {
						checkbox._form = this;
						u.e.addEvent(checkbox, "change", this._changed);
					}
				}
			}
			else {
				alert("bad result - not JSON")
			}
			u.loaded(this._content);
		}
		u.loading(form._content);
		u.Request(form, form.action, u.f.getParams(form, form._send), form.method);
	}
}
Util.Objects["UserManagementApps"] = new function() {
	this.init = function(form) {
		form._buttons = u.qsa("input[type=submit]", form);
		for(i = 0; button = form._buttons[i]; i++) {
			button.clicked = function(event) {
				u.e.kill(event);
				if(!u.hasClass(this, "disabled")) {
					if(confirm("Are you sure that you want to update the agreement settings. This could have impact on the agreements users?")) {
						this.form.submitButton = this;
						this.form.submitInput = false;
						this.form._submit(event);
					}
				}
			}
		}
		form.unchanged = function() {
			var i, button;
			u.formStateUnChanged();
			for(i = 0; button = this._buttons[i]; i++) {
				u.ac(button, "disabled");
			}
		}
		form.changed = function() {
			var i, button;
			u.formStateChanged();
			for(i = 0; button = this._buttons[i]; i++) {
				u.rc(button, "disabled");
			}
		}
		form.isSubmitted = function() {
			this.unchanged();
		}
		form.unchanged();
	}
}
Util.Objects["UserManagementAgreementUsers"] = new function() {
	this.init = function(form) {
		form._buttons = u.qsa("input[type=submit]", form);
		for(i = 0; button = form._buttons[i]; i++) {
			u.ac(button, "disabled");
		}
		form.loaded = function() {
			u.o.nestedchecking.init(this);
			this.action = this.fields.save_url.value;
			this.method = u.getIJ(this.fields.save_url, "method") ? u.getIJ(this.fields.save_url, "method") : this.method;
			this._type = u.getIJ(this.fields.save_url, "type") ? u.getIJ(this.fields.save_url, "type") : this._type;
			this._send = u.getIJ(this.fields.save_url, "send") ? u.getIJ(this.fields.save_url, "send") : this._send;
			var template = u.qs(".template", this._content);
			var checkboxes = u.qsa("input[type=checkbox]", template.parentNode);
			for(i = 0; checkbox = checkboxes[i]; i++) {
				checkbox.changed = function() {
					this.form.changed();
				}
				u.e.addEvent(checkbox, "change", checkbox.changed);
			}
			template.parentNode.removeChild(template);
			this.loaded = null;
			this.changed = function() {
				var i, button;
				u.formStateChanged();
				for(i = 0; button = this._buttons[i]; i++) {
					u.rc(button, "disabled");
				}
			}
		}
	}
}
Util.Objects["SearchAgreements"] = new function() {
	this.init = function(form) {
		form._reset = function() {
			this.fields.sort.value = "";
			this.fields.sort_column.value = "";
			this.fields.query.value = "";
 			this.fields.filter.val("");
			this.submitted();
		}
		form.bn_reset = u.qs(".actions .reset", form);
		form.bn_reset._form = form;
		u.e.click(form.bn_reset);
		form.bn_reset.clicked = function(event) {
			u.e.kill(event);
			this._form._reset();
		}
		form.fields.query.updated = function(event) {
			if(this.value.length == 0) {
				this.form.submitted();
			}
		}
		form.fields.filter.changed = function(event) {
			this.form.submitted();
		}
		form.loaded = function(response) {
		}
		form.sortable_headers = u.qsa(".header th.sortby", form);
		for(i = 0; header = form.sortable_headers[i]; i++) {
			var toggler = u.ae(header, "span", {"class":"sort"});
			header._form = form;
			u.e.click(header)
			header.clicked = function(event) {
				this._form.fields.sort_column.value = u.getIJ(this, "sortby");
				this._form.fields.sort.value = u.tc(this, "asc", "desc");
				this._form.resetSortableHeaders(this);
				this._form.submitted(this);
			}
		}
		form.resetSortableHeaders = function(selected) {
			for(i = 0; header = this.sortable_headers[i]; i++) {
				if(header != selected) {
					u.rc(header, "asc|desc");
				}
			}
		}
		if(form.fields.sort_column.value && form.fields.sort.value) {
			var sort_by = u.qs("th."+ form.fields.sort_column.value, form);
			if(sort_by) {
				u.ac(sort_by, form.fields.sort.value);
			}
		}
	}
}

Util.Objects["MyAccountPer"] = new function() {
	this.init = function(content) {
		var form = u.qs("#perdetails", content);
		u.f.init(form);
		u.e.click(form.actions.save);
		form.actions.save.clicked = function(event) {
			var password_error = false;
			var error_msg;
			var old_password = u.qs("#pw_old").value;
			var new_password = u.qs("#pw_new1").value;
			var confirm_password = u.qs("#pw_new2").value;
			if (old_password != "" || new_password != "" || confirm_password != "") {
				if (old_password == "") {
					error_msg = "Old password cannot be empty";
					password_error = true;
				}
				else if (new_password == "") {
					error_msg = "New password cannot be empty";
					password_error = true;
				}
				else if (confirm_password == "") {
					error_msg = "Confirm password cannot be empty";
					password_error = true;
				}
				else if (new_password != confirm_password) {
					error_msg = "New passwords does not match";
					password_error = true;
				}
				if (password_error) {
					u.notify(error_msg, "error", "");
				}
				else {
					u.qs("input[name=pw_new]").value = new_password;
					u.loading(content);
					u.Request(form, form.action, u.f.getParams(form, "string"), form.method);
				}
			}
			else {
				u.loading(content);
				u.Request(form, form.action, u.f.getParams(form, "string"), form.method);
			}
		};
		form.Response = function(response) {
			u.loaded(content);
			if(response && response.success) {
				u.notify(response.success_msg, "receipt", "");
			}
		}
		var password_settings = u.qs(".password_settings", content);
		var pwchg = u.qs(".toggle_password", content);
		u.ac(password_settings, "closed");
		u.e.click(pwchg);
		pwchg.clicked = function() {
			u.tc(password_settings, "closed");
		};
	}
}
Util.Objects["MyAccountPerMessages"] = new function() {
	this.init = function(form) {
		form.loaded = function(response) {
			if (!response.show_more) {
				u.ac(this.actions.more, "hidden");
			}
		}
		u.e.click(form.actions.more);
		form.actions.more._form = form;
		form.actions.more.clicked = function(event) {
			this._form.fields.from.value = (parseInt(this._form.fields.from.value) + parseInt(this._form.fields.count.value));
			this._form.fields.count.value = "4";
			u.loading(this._form);
			location.hash = this._form.fields.from.value + "/" + this._form.fields.count.value+ "/" + this._form.fields.sort.value;
			u.Request(this, this._form.action, u.f.getParams(this._form, "string"), this._form.method);
		}
		form.actions.more.Response = function(response) {
			u.loaded(this._form);
			var template = u.qs(".template", this._form);
			var html = u.template(template, response.result);
			var temp = document.createElement(template.parentNode.nodeName);
			temp.innerHTML = html;
			var child;
			while (child = temp.firstChild) {
				template.parentNode.appendChild(child);
			}
			u.init();
			this._form.init_stars();
			this._form.init_high_priority();
			if (!response.show_more) {
				u.ac(this._form.actions.more, "hidden");
			}
		}
		form.sortable_headers = u.qsa(".header th.sortby", form);
		for(i = 0; header = form.sortable_headers[i]; i++) {
			var toggler = u.ae(header, "span", {"class":"sort"});
			header._form = form;
			u.e.click(header);
			header.clicked = function(event) {
				var sort_column = u.getIJ(this, "sortby");
				var sort_order = u.tc(this, "asc", "desc");
				this._form.fields.sort.value = sort_column + "_" + sort_order;
				this._form.fields.count.value = (parseInt(this._form.fields.from.value) + parseInt(this._form.fields.count.value));
				this._form.fields.from.value = "0";
				this._form.resetSortableHeaders(this);
				this._form.submitted(this);
				this._form.init_stars();
				this._form.init_high_priority();
			}
		}
		form.resetSortableHeaders = function(selected) {
			for(i = 0; header = this.sortable_headers[i]; i++) {
				if(header != selected) {
					u.rc(header, "asc|desc");
				}
			}
		}
		form.init_stars = function() {
			var stars = u.qsa("td.star");
			var star;
			for (var i = 0; star = stars[i]; i++) {
				u.e.click(star);
				star.clicked = function(event) {
					u.Request(this, "/my_account_be/SetMessageStar", "messageID=" + u.getIJ(this.parentNode, "id"), "post"); 
				}
				star.Response = function(response) {
					if(response && response.success) {
						var tr_elm = this.parentNode;
						u.tc(tr_elm, "is_starred_true");
					}
				};
			}
		};
		form.init_stars();
		form.init_high_priority = function() {
			var high_trs = u.qsa("tr.is_high_true");
			var msg, sender;
			for (var i = 0; msg = high_trs[i]; i++) {
				u.rc(msg, "is_high_true");
				sender = u.qs("td.sender", msg);
				sender.innerHTML += '<span class="high_prio">!</span>'
			}
		}
		form.init_high_priority();
		if(location.hash) {
			var values = location.hash.replace(/#/g, '').split("/");
			form.fields.from.value = "0";
			form.fields.count.value = parseInt(values[0]) + parseInt(values[1]);
			form.fields.sort.value = values[2];
		};
	}
}
Util.Objects["MyAccountPerGertBackup"] = new function() {
	this.init = function(content) {
		var form = u.qs("#perdetails", content);
		u.f.init(form);				
		u.e.click(form.actions.save);
		form.actions.save.clicked = function() {
			form.submitted();
		};
		form.submitted = function() {
			var submitPw = true;
			var var_pwobject = new Array();
			var_pwobject["old"] = u.qs("input[name=pw_old]", this).value;
			var_pwobject["new1"] = u.qs("#pw_new1", this).value;
			var_pwobject["new2"] = u.qs("#pw_new2", this).value;
			if (var_pwobject["old"] != "" || var_pwobject["new1"] != "" || var_pwobject["new2"] != "") {
				if (var_pwobject["old"]=="") {
					alert("Oldpassword cant be empty");
					submitPw = false; // do stuff to show error
				} else if (var_pwobject["new1"]=="") {
					alert("New 1 cant be empty");
					submitPw = false; // do stuff to show error
				} else if (var_pwobject["new2"]=="") {
					alert("New 2 cant be empty");
					submitPw = false; // do stuff to show error
				} else if (var_pwobject["new1"] != var_pwobject["new2"]){
					alert("New passwords doesn't match");
					submitPw = false; // do stuff to show error
				}
				if (submitPw) {
					u.qs("input[name=pw_new]", this).value = var_pwobject["new1"];
					u.loading(content);
					u.Request(this, this.action, u.f.getParams(this, "string"), this.method);
				}
			}
			else {
				u.loading(content);
				u.Request(this, this.action, u.f.getParams(this, "string"), this.method);
			}
		};
		form.Response = function(response) {
			u.loaded(content);
			if(response && response.success) {
				u.notify(response.success_msg, "receipt", "");
			}
		};
		var password_settings = u.qs(".password_settings", content);
		var pwchg = u.qs(".toggle_password", content);
		u.ac(password_settings, "closed");
		u.e.click(pwchg);
		pwchg.clicked = function() {
			u.tc(password_settings, "closed");
		};
		var formMsg = u.qs("#msgTable", content);
		u.f.init(formMsg);
		u.e.click(formMsg.actions.more);
		formMsg.actions.more.clicked = function() {
			formMsg.fields.from.value = (parseInt(formMsg.fields.from.value) + parseInt(formMsg.fields.count.value));
			formMsg.fields.count.value = "4";
			formMsg.submitted();
		};
		formMsg.submitted = function() {
			u.loading(content);
			location.hash = this.fields.from.value+"/"+this.fields.count.value+"/"+this.fields.sort.value;
			u.Request(this, this.action, u.f.getParams(this, "string"), this.method);
		};
		formMsg.Response = function(response) {
			u.loaded(content);
			if (response) {
				if (!response.show_more) {
					u.as(formMsg.actions.more, "display", "none");
				}
				else {
					u.as(formMsg.actions.more, "display", "inline-block");
				}
				var html = u.template(u.qs(".template", formMsg), response.result);
				u.qs("table tbody", formMsg).innerHTML += html;
				content.initList();
			}
		};
		content.initList = function() {
			var i, row;
			var th_date = u.qs("th.date", content);
			var th_read = u.qs("th.read", content);
			var th_star = u.qs("th.star", content);
			u.e.click(th_date);
			u.e.click(th_read);
			u.e.click(th_star);
			th_date.clicked = function(event) {
				u.bug("click");
				var state = u.tc(this, "date_asc", "date_desc");
				formMsg.fields.sort.value = state;
				formMsg.fields.count.value = (parseInt(formMsg.fields.from.value) + parseInt(formMsg.fields.count.value));
				formMsg.fields.from.value = "0";
				content.clearList();
				formMsg.submitted();
			};
			th_read.clicked = function(event) {
				u.bug("click");
				var state = u.tc(this, "read_asc", "read_desc");
				formMsg.fields.sort.value = state;
				formMsg.fields.count.value = (parseInt(formMsg.fields.from.value) + parseInt(formMsg.fields.count.value));
				formMsg.fields.from.value = "0";
				content.clearList();
				formMsg.submitted();
			};
			th_star.clicked = function(event) {
				u.bug("click");
				var state = u.tc(this, "star_asc", "star_desc");
				formMsg.fields.sort.value = state;
				formMsg.fields.count.value = (parseInt(formMsg.fields.from.value) + parseInt(formMsg.fields.count.value));
				formMsg.fields.from.value = "0";
				content.clearList();
				formMsg.submitted();
			};
			var rows = u.qsa("tr", content);
			for(i = 2; row = rows[i]; i++) {
				var td_star = u.qs("td.star", row);
				u.e.click(td_star);
				td_star.clicked = function(event) {
					alert("click star");
					u.Request(this, "/my_account_be/SetMessageStar", "messageID="+u.getIJ(this, "id"), "post"); 
				};
				td_star.Response = function(response) {
					if(response && response.success) {
						this.innerHTML=response.star;
					}
				};
			};
		};
		content.clearList = function() {
			var i, row;
			var rows = u.qsa("tr", content);
			for(i = 2; row = rows[i]; i++) {
				row.parentNode.removeChild(row);
			}
		};
		if(location.hash) {
			var values = location.hash.replace(/#/g, '').split("/");
			formMsg.fields.from.value = "0";
			formMsg.fields.count.value = parseInt(values[0])+parseInt(values[1]);
			formMsg.fields.sort.value = values[2];
		};
		formMsg.submitted();
	};
};
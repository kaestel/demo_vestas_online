u.notify = function(message, type, target) {
	if(message) {
		var page = u.qs("#page");

		target = target ? target : page.cN;
		var notification = u.ie(target, "div", ({"class":"notice "+type, "style":"height: 0;"}));
		var notification_inner = u.ae(notification, "div", ({"class":"inner"}));
		notification_inner.message = u.ae(notification_inner, "p");
		notification_inner.message.innerHTML = message;

		u.a.setOpacity(notification, 1);

		//u.a.transition(notification, "all 0.000000001s ease-in");
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
			//u.a.transition(this, "none");
			u.a.setOpacity(this, 0);
		}

		// adjust auto hide on mouseover
		if(u.e.event_pref == "mouse") {
			notification.onmouseover = function(event) {
				u.t.resetTimer(this.t_hide);
			}
			notification.onmouseout = function(event) {
				this.t_hide = u.t.setTimer(this, this.clicked, 2000);
			}
		}

		// autohide after 5 secs
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

		// No array in response means response.length == undefined
		// and the template function is used for something it wasn't intented to.
		// Therefore we let it clone the node.
		// Without this check responses with an empty result array will create a "ghost" node.
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
		
		// multiple results
		if(response.length) {
			for(item in response) {

				item_template = template;

				// look for functions
// 				if(item_template.match(/\{\{/)) {
// 
// 					
// 					// first get expression to evaluate
// //					look for ?
// //					 and :
// 
// //					alert(item_template)
// 					expression = item_template.match(/\{\{(.+?)\}/g);
// 
// 					//{{checked} ? checked="checked" : }
// 					
// //					expression = template.match(/\{\{(.+?)\}[\s\?]+(.+?)[\s\:]+(.+?)\}/);
// //					item_template = item_template.replace();
// 					
// 
// 					u.bug("contains if:" + expression)
// 
// 					
// 
// 					if(expression.length && response[item][expression[1]]) {
// 						u.bug("true")
// 					}
// 				}
				// item_template = template.replace(/\{{(.+?)\}/g, "");
				// 						u.bug("temp:" + string)
				// 						if(string.match("{{")) {
				// 							u.bug("function")
				// 						}

										//}
										//else 
				

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
		// only one result
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
//					u.bug("response")

					var new_content = u.qs("#content", response);
					if(new_content) {
						u.sc(this, new_content.className);
						this.innerHTML = new_content.innerHTML;
						u.init();
						u.loaded(this);
					}
					// temp bad response without #content
					else {
						alert("missing #content in response");
//						this.innerHTML = response.innerHTML;
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
//		return confirm("You have unsaved changes! Are you sure you want to leave this page without saving?")
	}
}

u.formStateUnChanged = function() {
	document.body.onbeforeunload = null;
}
u.isTemplateChild = function(node) {

	var in_template = false;
//	var node = node.parentNode;
	while(node != null) {
		if(u.hasClass(node, "template")) {
			in_template = true;
			break;
		}
		node = node.parentNode;
	}
	return in_template;
}
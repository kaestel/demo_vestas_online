Util.Objects["form"] = new function() {
	this.init = function(content) {
		var form;

		if(content.nodeName.toLowerCase() == "form") {
			form = content;
		}
		else {
			var form = u.qs("form", content);
		}

		// remember content reference for loading layer
		form._content = content;

		// get form type (auto/manual) - manual default
		form._type = u.getIJ(form, "type");
		form._type = form._type ? form._type : "manual";
		// get send format - json/parameters - parameters default
		form._send = u.getIJ(form, "send");
		form._send = form._send ? form._send : "parameters";

// message target? Thoughts?
//		form._message = u.getIJ(form, "message");
//		form._message = form._message ? u.ge(form._message) : false;

		// handle server response
		form.Response = function(response) {

//			u.bug("response:" + response)

			// JSON response
			if(response.isJSON) {

//				u.bug("response JSON")

				// template to receive response
				var template = u.qs(".template", this._content);

//				u.bug("template:" + template.nodeName);
				if(template && response && response.result) {

//					u.bug("template")

					// clean template parent - do not remove .header and .template
					var i, node;
					for(i = 0; node = template.parentNode.childNodes[i]; i++) {

						if(!node.className || !node.className.match(/header|template/i)) {
//							u.bug("remove node:" + u.nodeId(node));
							// remove node
							template.parentNode.removeChild(node);
							// decrement i to compesate for removal
							i--;
						}
					}

					// add new result
					var html = u.template(template, response.result);

					// doing innerHTML cancels events on header - instead use dom
					var temp = document.createElement(template.parentNode.nodeName);
					temp.innerHTML = html;

					var child;
					while(child = temp.firstChild) {
						template.parentNode.appendChild(child);
					}
					// init new content
					u.init();
				}
				// ajax submit, json response with redirect
				else if(form.fields && form.fields.response_success_forward_url) {

//					u.bug("response_success_forward_url")

					var forward_url = form.fields.response_success_forward_url.value;

					// if success
					if(response.success) {

						u.formStateUnChanged();

						// check for parameters to forward
						if(form.fields.response_success_forward_parameters) {

//							u.bug("response_success_forward_parameters")

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
				// return success message
				// errors needs to be handled by form.loaded
				else if(response && response.success_msg) {
					u.notify(response.success_msg, "receipt", response.message_target ? response.message_target : false);
				}

				
			}
			// HTML response
			else if(response.isHTML) {

				u.bug("response HTML")

				
			}

			// possibly callback to external loading extender
			if(typeof(this.loaded) == "function") {
				this.loaded(response);
			}

			u.loaded(this._content);
		}

//		else {
		u.f.init(form);



		if(typeof(form.submitted) != "function" && form._type != "html") {
			form.submitted = function(iN) {

//				u.bug("submitted")

				u.loading(this._content);
				u.Request(this, this.action, u.f.getParams(this, {"type":this._send}), this.method);

				// callback for more detailed handling when not wanting to override basic functionality
				if(typeof(form.isSubmitted) == "function") {
					form.isSubmitted(iN);
				}

			}
		}

		// auto submit form - submits form on load
		if(form._type == "auto") {
			u.loading(content);
			u.Request(form, form.action, u.f.getParams(form, {"type":form._send}), form.method);
		}

//		}

	}
}
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
					
					// Collect form data
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
					
					// Convert to JSON
					var params = JSON.stringify(var_object);
					//u.bug(params);
					
					this.form.Response = function(response) {
						if(response && response.success) {
							// Simple refresh of tabs
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

		// set header sort
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
		
		// Find all checkboxes
		form.select_all_checkbox = u.qs("th.select_all input[type=checkbox]", form);
		
		// Event for single "select all" checkbox
		form.select_all_checkbox.clicked = function(event) {
			form.content_checkboxes = u.qsa("td.select input[type=checkbox]", form);
			
			// Don't select tr.template checkbox
			for (var i = 1; i < this.form.content_checkboxes.length; i++) {
				this.form.content_checkboxes[i].checked = this.form.select_all_checkbox.checked;
			}
			
			this.form.single_checkbox_clicked();
		}
		u.e.addEvent(form.select_all_checkbox, "change", form.select_all_checkbox.clicked);
		
		// Events for content checkboxes
		form.single_checkbox_clicked = function(event) {
			form.content_checkboxes = u.qsa("td.select input[type=checkbox]", form);
			var no_of_sel_checkboxes = 0;
			var checkbox, button;
			
			// Checkbox element when single is clicked,
			// form element when "select all" is clicked
			var form_ref = (this.nodeName.toLowerCase() == "form") ? this : this.form;
			
			// Don't select tr.template checkbox
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
			
			// Don't select tr.template checkbox
			for(var i = 1; checkbox = this.content_checkboxes[i]; i++) {
				u.e.addEvent(this.content_checkboxes[i], "change", this.single_checkbox_clicked);
			}
		}
		
		form.attach_checkbox_events(this);
	}
}

Util.Objects["UserManagementAccounts"] = new function() {
	this.init = function(form) {

		// start by disabling bn_submits
		form.bn_submits = u.qsa("input[type=submit]", form);

		form.onsubmit = function() {
			return false;
		}

		// handle save form
		form._changed = function() {
			var i, bn_submit;
			for(i = 0; bn_submit = this._form.bn_submits[i]; i++) {
				u.rc(bn_submit, "disabled");
			}

			u.formStateChanged();

		}
		form._save = function() {

			// don't execute if button is disabled
			if(!u.hasClass(this, "disabled")) {
				if(confirm("Are you sure that you want to update the agreement settings. This could have impact on the agreements users?")) {

					var var_object = new Array();

					// get agreement id
					var_object["agreement_id"] = u.qs("input[name=agreement_id]", this._form).value;

					// index vars
					var checkboxes = u.qsa("input[type=checkbox]", this._form);
					var checkbox, i;

					if(checkboxes.length) {

		// 				var object = checkboxes[0].name.split("[");
		// 				
		// 				if(object.length) {
		// 					var root = object[0];
		// //					u.bug("root:" + root)
		// 				}
		// 				else {
		// 					alert("bad file names");
		// 				}

						for(i = 0; checkbox = checkboxes[i]; i++) {
							// do not include template item
							if(!checkbox.parentNode.className.match(/template/g)) {
								var field_object = checkbox.name.split("[");
								if(field_object.length == 2) {
									if(!var_object[field_object[0]]) {
		//								u.bug("new")
										var_object[field_object[0]] = new Array();
									}
			//						u.bug("1:" + field_object[1])
		//							u.bug("2:" + field_object[1].replace(/]/g, ""))
									var_object[field_object[0]][field_object[1].replace(/]/g, "")] = (checkbox.checked ? checkbox.value : 0);
								}
							}
						}
			//			var agreement_id = u.
					}

		//			u.bug(JSON.stringify(var_object));
		//			u.bug(var_object.toJSON());

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


		// start preparing form
//		u.f.init(form);

		// remember content reference for loading layer
		form._content = form;

		// get form type (auto/manual) - manual default
		form._type = u.getIJ(form, "type");
		form._type = form._type ? form._type : "manual";
		// get send format - json/parameters - parameters default
		form._send = u.getIJ(form, "send");
		form._send = form._send ? form._send : "parameters";


		// handle server response
		form.Response = function(response) {

//			u.bug("response")

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
//							u.bug("node:" + node.nodeName)
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

					// manual extension part
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

			// possibly callback to external extender

			u.loaded(this._content);
		}

		// get content
		u.loading(form._content);
		u.Request(form, form.action, u.f.getParams(form, form._send), form.method);


	}
}

Util.Objects["UserManagementApps"] = new function() {
	this.init = function(form) {

		// get buttons
		form._buttons = u.qsa("input[type=submit]", form);

		for(i = 0; button = form._buttons[i]; i++) {
			button.clicked = function(event) {
				u.e.kill(event);

				// don't execute if button is disabled
				if(!u.hasClass(this, "disabled")) {

					if(confirm("Are you sure that you want to update the agreement settings. This could have impact on the agreements users?")) {
						// store submit button info
						this.form.submitButton = this;
						// remove any previous submit info
						this.form.submitInput = false;
						this.form._submit(event);
					}
				}

			}
		}

		// form is not changed
		form.unchanged = function() {
			var i, button;
			u.formStateUnChanged();

			for(i = 0; button = this._buttons[i]; i++) {
				u.ac(button, "disabled");
			}
		}

		// form is changed
		form.changed = function() {
			var i, button;
			u.formStateChanged();

			for(i = 0; button = this._buttons[i]; i++) {
				u.rc(button, "disabled");
			}
		}

		// extended callback form form.submitted
		form.isSubmitted = function() {
			this.unchanged();
		}

		// set start state
		form.unchanged();

	}
}

Util.Objects["UserManagementAgreementUsers"] = new function() {
	this.init = function(form) {

		// get buttons
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

			// let checkboxes notify form on change
			var checkboxes = u.qsa("input[type=checkbox]", template.parentNode);
			for(i = 0; checkbox = checkboxes[i]; i++) {
				checkbox.changed = function() {
					this.form.changed();
				}
				u.e.addEvent(checkbox, "change", checkbox.changed);
			}

			// remove template to make way for url forwarding on next submit
			template.parentNode.removeChild(template);

			// do not repeat load sequence on next load
			this.loaded = null;

			// form is changed
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

		// reset form
		form._reset = function() {
			this.fields.sort.value = "";
			this.fields.sort_column.value = "";
			this.fields.query.value = "";
 			this.fields.filter.val("");
			this.submitted();
		}


		// set reset button
		form.bn_reset = u.qs(".actions .reset", form);
		form.bn_reset._form = form;
		u.e.click(form.bn_reset);
		form.bn_reset.clicked = function(event) {
			u.e.kill(event);
			this._form._reset();
		}


		// auto-submit on empty query
		form.fields.query.updated = function(event) {
			if(this.value.length == 0) {
				this.form.submitted();
			}
		}


		// auto-submit on filter change
		form.fields.filter.changed = function(event) {
			this.form.submitted();
		}


		// update anything when form reponds?
		form.loaded = function(response) {
			//u.bug("form loaded")
		}


		// set sortable headers
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


		// set column sort visuals
		if(form.fields.sort_column.value && form.fields.sort.value) {
			var sort_by = u.qs("th."+ form.fields.sort_column.value, form);
			if(sort_by) {
				u.ac(sort_by, form.fields.sort.value);
			}
		}

	}
}



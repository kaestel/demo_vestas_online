Util.Objects["IssueManagerList"] = new function() {
	this.init = function(form) {
//		u.bug("init IssueManagerList");


		// reset form
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

		// set reset button
		form.bn_reset = u.qs(".actions .reset", form);
		form.bn_reset._form = form;
		u.e.click(form.bn_reset);
		form.bn_reset.clicked = function(event) {
			u.e.kill(event);
			this._form._reset();
		}


		// load more
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

		// handle load more response - (does not remove existing rows)
		form.bn_load_more.Response = function(response) {
			// JSON response
			if(response && response.isJSON) {

				// template to receive response
				var template = u.qs(".template", this._form);

				if(template && response.result) {

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
				else {
					alert("no template or no result!");
				}
			}

			// element is loaded
			u.loaded(this._form);

			// content is loaded - set buttons and HASH
			this._form.loaded(response);
		}


		// form is loaded and response is handled - update HASH and button
		form.loaded = function(response) {

			this.row_count = u.qs(".template", this._form).parentNode.childNodes.length - 2;
			this.fields.from.value = 0;
//			this.fields.count.value = this.row_count;


			location.hash = this.fields.count.value+"/"+this.fields.from.value+"/"+this.fields.sort.value+"/"+this.fields.sort_column.value+"/"+this.fields.query.val()+"/"+this.fields.filter.val();
			if(response.show_more) {
				u.rc(this.bn_load_more, "disabled");
			}
			else {
				u.ac(this.bn_load_more, "disabled");
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
			}
		}

		form.resetSortableHeaders = function(selected) {
			for(i = 0; header = this.sortable_headers[i]; i++) {
				if(header != selected) {
					u.rc(header, "asc|desc");
				}
			}
		}



		// update values on page load if HASH value available
		if(location.hash.length > 1) {
			var values = location.hash.replace(/^#/, "").split("/");

			// update input values and submit form
			form.fields.count.value = u.stringOr(values[0]);
			form.fields.from.value = u.stringOr(values[1]);
			form.fields.sort.value = u.stringOr(values[2]);
			form.fields.sort_column.value = u.stringOr(values[3]);

			form.fields.query.val(u.stringOr(values[4]));
			form.fields.filter.val(u.stringOr(values[5]));
		}

		// set column sort visuals
		if(form.fields.sort_column.value && form.fields.sort.value) {
			var sort_by = u.qs("th."+ form.fields.sort_column.value, form);
			if(sort_by) {
				u.ac(sort_by, form.fields.sort.value);
			}
		}

		// invoke auto-submit to populate list
		form.submitted();
	}
}


Util.Objects["IssueManagerView"] = new function() {
	this.init = function(content) {

		// set up toggling of initial description
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

			// JSON response
			if(response.isJSON) {

//				u.bug("response JSON")

				// template to receive response
				var template = u.qs(".template", this);

//				u.bug("template:" + template.nodeName);
				if(template && response && response.issue_dialog) {

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

					this.comments_count = response.issue_dialog.length;
					this.comments_show_on_init = this.comments_count > 5 ? 5 : this.comments_count;
					this.comments = response.issue_dialog;

					for(i = 0; i < this.comments_show_on_init; i++) {
						
						var dialogue_no = this.comments_count-1 - i;

						// add new result
						var html = u.template(template, this.comments[dialogue_no]);

						// doing innerHTML cancels events on header - instead use dom
						var temp = document.createElement(template.parentNode.nodeName);
						temp.innerHTML = html;

						var child;
						while(child = temp.firstChild) {
							template.parentNode.insertBefore(child, template.parentNode.firstChild);
						}
					}

					// get reference for show-all button
					this.bn_showall = u.qs(".actions .more", this);

					// set comments count
//					u.qs("input", this.bn_showall).value = this.comments_count + " " + u.qs("input", this.bn_showall).value;
					u.qs("input", form.bn_showall).value = u.qs("input", form.bn_showall).value.replace(/[0-9]+/, this.comments_count);
					// more than 5 comments, set expand function
					if(this.comments_count > 5) {

						this.bn_showall._form = this;
						u.ac(this.bn_showall, "active");
						u.e.click(this.bn_showall);
						this.bn_showall.clicked = function(event) {

							if(!this.initialized) {
								this.initialized = true;

								// reference required nodes
								var template = u.qs(".template", this._form);
								this.slide = u.qs(".slide", this._form);
								this.slide.collapsed_height = this.slide.offsetHeight
								this.list = u.qs(".list", this.slide);

								// set proporties for invisible injection
								u.as(this.slide, "position", "relative");
								u.as(this.slide, "overflow", "hidden");
								u.a.setHeight(this.slide, this.slide.collapsed_height);
								u.as(this.list, "width", "100%");
								u.as(this.list, "position", "absolute");
								u.as(this.list, "left", 0);
								u.as(this.list, "bottom", 0);

								// inject remaining nodes
								for(i = this._form.comments_show_on_init; i < this._form.comments_count; i++) {

									// going through in an obsure manner to make it easy to adjust count by setting comments_show_on_init
									var dialogue_no = this._form.comments_count-1 - i;

									// add new result
									var html = u.template(template, this._form.comments[dialogue_no]);

									// doing innerHTML cancels events on header - instead use dom
									var temp = document.createElement(template.parentNode.nodeName);
									temp.innerHTML = html;

									var child;
									while(child = temp.firstChild) {
										// inject on top
										template.parentNode.insertBefore(child, template.parentNode.firstChild);
									}
								}
							}

							// open or close?
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


					// init new content
					u.init();
				}
				// no comments
				else {
					u.qs("input", form.bn_showall).value = u.qs("input", form.bn_showall).value.replace(/[0-9]+/, "0");
//					u.qs("input", form.bn_showall).value = "0 " + u.qs("input", form.bn_showall).value;
				}


			}

			u.loaded(this);
		}

		form.submitted = function(iN) {

//			u.bug("submitted")

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

			// JSON response
			if(response.isJSON) {

//				u.bug("response JSON")

				// template to receive response
				var template = u.qs(".comments .template");

//				u.bug("template:" + template.nodeName);
				if(template && response && response.success) {
					u.notify(response.success_msg, "receipt", u.qs(".addcomment"));

					var json = {
						"sender_name":this.fields.sender_name.val(),
						"sender_initials":this.fields.sender_initials.val(),
						"comment_date":u.date("d.m.Y"),
						"message":this.fields.comment.val()
					};
					var html = u.template(template, json);

					// doing innerHTML cancels events on header - instead use dom
					var temp = document.createElement(template.parentNode.nodeName);
					temp.innerHTML = html;
					template.parentNode.appendChild(temp);

					// reset field
					this.fields.comment.val("");
					
					// update count
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
Util.Objects["MyAccountPer"] = new function() {
	this.init = function(content) {
		
		// Find and init form (here instead of html because we are initializing the content div)
		var form = u.qs("#perdetails", content);
		u.f.init(form);
		
		// Hook up "Save changes" button
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
		
		// Handle response after submit
		form.Response = function(response) {
			u.loaded(content);
			if(response && response.success) {
				u.notify(response.success_msg, "receipt", "");
			}
		}
		
		// Toggle visibility of "change password"
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
		
		// Hide "load more" button onload if nessecary
		form.loaded = function(response) {
			if (!response.show_more) {
				u.ac(this.actions.more, "hidden");
			}
		}
		
		// Hook up "Show more" button
		u.e.click(form.actions.more);
		form.actions.more._form = form;
		form.actions.more.clicked = function(event) {
			this._form.fields.from.value = (parseInt(this._form.fields.from.value) + parseInt(this._form.fields.count.value));
			this._form.fields.count.value = "4";
			u.loading(this._form);
			location.hash = this._form.fields.from.value + "/" + this._form.fields.count.value+ "/" + this._form.fields.sort.value;
			u.Request(this, this._form.action, u.f.getParams(this._form, "string"), this._form.method);
		}
		
		// Handle "Load more" callback
		form.actions.more.Response = function(response) {
			u.loaded(this._form);
			
			// add new result
			var template = u.qs(".template", this._form);
			var html = u.template(template, response.result);

			// doing innerHTML cancels events on header - instead use dom
			var temp = document.createElement(template.parentNode.nodeName);
			temp.innerHTML = html;

			var child;
			while (child = temp.firstChild) {
				template.parentNode.appendChild(child);
			}
			
			// init new content
			u.init();
			this._form.init_stars();
			this._form.init_high_priority();
			
			if (!response.show_more) {
				u.ac(this._form.actions.more, "hidden");
			}
		}
		
		// Handle click events for headers
		// set header sort
		form.sortable_headers = u.qsa(".header th.sortby", form);
		for(i = 0; header = form.sortable_headers[i]; i++) {
			var toggler = u.ae(header, "span", {"class":"sort"});
			header._form = form;
			
			u.e.click(header);
			header.clicked = function(event) {
				var sort_column = u.getIJ(this, "sortby");
				var sort_order = u.tc(this, "asc", "desc");
				this._form.fields.sort.value = sort_column + "_" + sort_order;
				// this._form.fields.sort_column.value = u.getIJ(this, "sortby");
				// this._form.fields.sort.value = u.tc(this, "asc", "desc");
				
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
		
		// Handle click on stars
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
		
		// Add high priority messages
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
		//var pwlist = u.qs(".password_fields", content);
		u.ac(password_settings, "closed");
		//password_settings
		//u.as(pwlist, "display", "none");
		
		u.e.click(pwchg);
		pwchg.clicked = function() {
			u.tc(password_settings, "closed");
			//u.as(pwlist, "display", "inline-block");
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
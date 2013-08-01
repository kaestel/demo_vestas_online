Util.Objects["add_apps"] = new function() {
	this.init = function(e) {
		// e = #content node in dom

		e.page = u.qs("#page");

		// TODO: add real JSON request
		// dummy add app
		var apps = u.qsa(".app", e);
		var i, app;
		for(i = 0; app = apps[i]; i++) {
		  
			// does it contain a form for adding app
			app.form = u.qs(".add form", app);
			if(app.form) {
				app.form.onsubmit = function() {return false;}

				var add_app = u.qs(".button", app.form);
//				add_app.setAttribute("type", "button");
				add_app.app = app;

				u.e.click(add_app);
				add_app.clicked = function(event) {
					u.e.kill(event);

					this.Response = function(response) {

//						u.bug("respo")

						// checkUser is successfull
						if(response && response.success) {
							u.rc(this, "primary");
							u.ac(this, "disabled");
							
							this.value = response.installed_btn_text;
							u.notify(response.installed_msg_text, "receipt");
							
							// Add to navigation
							if (this.form.appurl.value && this.form.appname.value) {
								var add_app_li = u.qs("#navigation ul li.add");
								var li_tag = document.createElement("li");
								add_app_li.parentNode.insertBefore(li_tag, add_app_li);
								var li_html = '<h4><a href="' + this.form.appurl.value + '">' + this.form.appname.value + '</a></h4>';
								li_tag.innerHTML = li_html;
							}
						}
						// else {
						// 	if(response) {
						// 		u.notify(response.error_msg, "error");
						// 	}
						// 	else {
						// 		u.notify("unknown error", "error");
						// 	}
						// }
					}

					u.Request(this, this.app.form.action, u.f.getParams(this.app.form, "string"), this.app.form.method);
	//				this.Response({"success":true})

				}
			}

		}

		
	}
}

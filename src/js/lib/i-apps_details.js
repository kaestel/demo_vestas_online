Util.Objects["apps_details"] = new function() {
	this.init = function(e) {
		// e = feedback node in dom

		e.page = u.qs("#page");


		var app = u.qs(".app", e);
		app.form = u.qs("form", app);
		if(app.form) {
			app.form.onsubmit = function() {return false;}

			var add_app = u.qs(".button", app.form);
//			add_app.setAttribute("type", "button");
			add_app.app = app;

			u.e.click(add_app);
			add_app.clicked = function(event) {
				u.e.kill(event);

				this.Response = function(response) {

					// checkUser is successfull
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
	//			this.Response({"success":true})

			}
		}
		
		// Thumbnail clicks
		var img_div = u.qs(".image_box .image");
		var thumbnail_links = u.qsa(".image_box ul.thumbs li", e);
		var link;
		for (var i = 0; link = thumbnail_links[i]; i++) {
			u.link(link);
			
			link.clicked = function(event) {
				u.e.kill(event);
				
				// Remove all sel
				for (var i = 0; i < thumbnail_links.length; i++) {
					u.rc(thumbnail_links[i], "sel");
				}
				
				img_div.innerHTML = '<img src="' + this.url + '" alt="img" />';
				u.ac(this, "sel");
			}
		}
		
	}
}

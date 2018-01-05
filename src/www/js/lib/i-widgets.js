Util.Objects["widgets"] = new function() {
	this.init = function(e) {
		// e = widget list (ul) in dom

		e.page = u.qs("#page");


		// adjust widget widths
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

		// re-adjust on resize
		e.resized = function() {
			var w = u.qs("#content ul.widgets");
			w.adjustWidths();
		}
		u.e.addEvent(window, "resize", e.resized);


		e.widgets = u.qsa(".widget", e);


		for(i = 0; widget = e.widgets[i]; i++) {

			// enable menu
			widget.settings = u.qs(".header .settings", widget);
			// setup dropdown menu
			e.page.setupOptions(widget.settings);

			// TODO: add server callback
			// dummy remove
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
							
							// Remove widget
							this.widget.transitioned = function() {
								u.as(this, "display", "none");
							}
							u.a.transition(this.widget, "all 0.3s ease-out");
							u.a.setOpacity(this.widget, 0);
							
							// Remove list item in navigation
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

			// enable drag
			widget.header = u.qs(".header", widget);
			u.ac(widget, "dwidget");
			u.ie(widget.header, "div", ({"class":"drag"}));

			// adjust widget widths
			e.adjustWidths(widget);
		}


		u.ac(e, "targets:dwidget");

		u.s.sortable(e);
		e.dropped = function() {
			this.adjustWidths();


			// make request to save new position here

		}


		// fade in
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
		// e = Issue Manager widget table

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

Util.Objects["sharepage"] = new function() {
	this.init = function(e) {
		// e = feedback node in dom

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
//				this.panel = this.e.appendChild(panel);
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


				// set up panel

				// close button in header
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

				// cancel button
//				this.panel.bn_cancel = u.qs(".cancel", this.panel.form);
				this.panel.bn_cancel = u.qs(".button", this.panel.form).parentNode;
				this.panel.bn_cancel.panel = this.panel;
				u.link(this.panel.bn_cancel);
				this.panel.bn_cancel.clicked = this.panel.bn_close.clicked;

				// setup send
//				this.panel.send = u.qs(".submit .button.primary", this.panel.form);
				this.panel.send = u.qs(".button.primary", this.panel.form);
				this.panel.send.panel = this.panel;
				u.e.click(this.panel.send);
				this.panel.send.clicked = function(event) {
					u.e.kill(event);

					// dummy validation for now
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

					// if both fields are filled, run checkUser routine
					if(this.panel.error) {
						this.panel.field_message.iN.focus();
					}
					else if(!this.panel.error) {

						this.Response = function(response) {

							// checkUser is successfull
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

				// show panel
				u.a.transition(this.panel, "all 0.1s ease-in");
				u.a.setOpacity(this.panel, 1);

			}

			u.Request(this, this.url);

		}

	}
}

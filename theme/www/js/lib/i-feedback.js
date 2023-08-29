Util.Objects["feedback"] = new function() {
	this.init = function(e) {
		// e = feedback node in dom

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
//				this.panel.field_message.iN.text_counter = u.qs(".text_counter", this.panel.field_message);
//				this.panel.field_message.iN.text_counter.text_var = this.panel.field_message.iN.text_counter.innerHTML;
//				this.panel.field_message.iN.text_counter.innerHTML = this.panel.field_message.iN.text_counter.text_var + ": "+this.panel.field_message.iN.getAttribute("maxlength");
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
        // this.panel.bn_cancel = u.qs(".cancel", this.panel.form);
        // this.panel.bn_cancel.panel = this.panel;
        // u.link(this.panel.bn_cancel);
        // this.panel.bn_cancel.clicked = this.panel.bn_close.clicked;

				// setup send
				this.panel.send = u.qs(".submit .button.primary", this.panel.form);
				this.panel.send.panel = this.panel;
				u.e.click(this.panel.send);
				this.panel.send.clicked = function(event) {
					u.e.kill(event);

					// dummy validation for now
					u.rc(this.panel.field_message, "error");
					this.panel.error = false;

					if(!this.panel.field_message.iN.value) {
						this.panel.error = true;
						u.ac(this.panel.field_message, "error");
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

				// show panel
				u.a.transition(this.panel, "all 0.1s ease-in");
				u.a.setOpacity(this.panel, 1);
				
			}
			
			u.Request(this, this.url);
			
		}
		
	}
}

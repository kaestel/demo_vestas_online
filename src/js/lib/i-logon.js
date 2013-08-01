Util.Objects["logon"] = new function() {
	this.init = function(e) {
		// e = content node in dom

		e.page = u.qs("#page");


		// look for open layovers and append close function?
		// temporary solution 
		var overlay = u.qs(".overlay");
		/*
		var box = u.qs(".box", overlay);

		u.a.setOpacity(overlay, 0);
		u.as(overlay, "display", "block");
		u.a.setHeight(overlay, e.offsetHeight);

		u.as(box, "top", ((u.browserH()-box.offsetHeight)/2 + u.scrollY()) + "px")

		u.a.transition(overlay, "all 0.3s ease-out");
		u.a.setOpacity(overlay, 1);

		// TODO: add esc close

		// TODO: not like this - integrate in layover functions
		// quickly copied from layover function
		overlay.close = u.qs(".header .close", overlay);
		overlay.close.overlay = overlay;
		u.link(overlay.close);
		overlay.close.clicked = function() {

			this.overlay.transitioned = function(event) {
				u.as(this, "display", "none");
			}
			u.a.transition(this.overlay, "all 0.5s ease-out");
			u.a.setOpacity(this.overlay, 0);
			
		}
		
		var buttons = u.qsa(".button", overlay);
		var j, button;
		for(j = 0; button = buttons[j]; j++) {
			button.overlay = overlay;
			button.removeAttribute("href");
			u.e.click(button);
			button.clicked = overlay.close.clicked;
		}
		*/

		e.signin = u.qs(".box.signin", e);
		e.signin.e = e;

		e.signin.form = u.qs("form", e.signup)
		e.signin.form.onsubmit = function() {return false;}

		// hidden field used for final submit
		e.signin.logonuidfield = u.qs("#logonuidfield", e.signin);

		// username/email (only used for checkuser)
		e.signin.field_username = u.qs("div.username", e.signin);
		e.signin.field_username.iN = u.qs("input", e.signin.field_username);
		e.signin.field_username.iN.e = e;
//		if(!u.qs(".overlay.browsersuggestions")) {
			e.signin.field_username.iN.focus();
//		}

		e.signin.field_username.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.signin.checkUser();
			}
		}

		// password (used for both check and final login)
		e.signin.field_password = u.qs("div.password", e.signin);
		e.signin.field_password.iN = u.qs("input", e.signin.field_password);
		e.signin.field_password.iN.e = e;
		e.signin.field_password.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.signin.checkUser();
			}
		}

		e.signin.bn_submit = u.qs(".submit .button", e.signin);
		e.signin.bn_submit.e = e;
		e.signin.bn_submit.type = "button";
		u.e.click(e.signin.bn_submit);
		e.signin.bn_submit.clicked = function(event) {
			u.e.kill(event);
			this.e.signin.checkUser();
		}


		e.signin.checkUser = function() {

			// dummy validation for now
			u.rc(this.e.signin.field_username, "error");
			u.rc(this.e.signin.field_password, "error");
			this.e.signin.error = false;

			if(!this.e.signin.field_username.iN.value) {
				this.e.signin.error = true;
				u.ac(this.e.signin.field_username, "error");
			}
			if(!this.e.signin.field_password.iN.value) {
				this.e.signin.error = true;
				u.ac(this.e.signin.field_password, "error");
			}

			// if both fields are filled, run checkUser routine
			if(this.e.signin.error) {
				this.e.signin.field_username.iN.focus();
			}
			else if(!this.e.signin.error) {

				// make test request
				this.Response = function(response) {

					this.response = response;

//					u.bug("success:"+response.success)
//					u.bug("terms_accepted:"+response.terms_accepted)

					// checkUser is successfull
					if(response.success) {
						// insert correct userid value
						this.logonuidfield.value = response.userid
						this.form.submit();

					}
					// further action required
					else {

						// user needs to accept terms
						if(response.terms_accepted === false) {

							// request terms
							this.Response = function(response) {

								var overlay = u.qs(".overlay", response)
								if(overlay) {

									document.body.appendChild(overlay);

									overlay.terms_error_msg = this.terms_error_msg;

									var box = u.qs(".box", overlay);

									u.a.setOpacity(overlay, 0);
									u.as(overlay, "display", "block");
									u.a.setHeight(overlay, e.page.offsetHeight);

									u.as(box, "top", ((u.browserH()-box.offsetHeight)/2 + u.scrollY()) + "px")

									u.a.transition(overlay, "all 0.3s ease-out");
									u.a.setOpacity(overlay, 1);

									// TODO: not like this - integrate in layover functions
									// quickly copied from layover function
									overlay.close = u.qs(".header .close", overlay);
									overlay.close.overlay = overlay;
									u.link(overlay.close);
									overlay.close.clicked = function(event) {
										u.e.kill(event);
										this.overlay.transitioned = function(event) {
											this.parentNode.removeChild(this);
										}
										u.a.transition(this.overlay, "all 0.5s ease-out");
										u.a.setOpacity(this.overlay, 0);
										//u.notify(this.overlay.terms_error_msg, "error");
									}


									overlay.cancel = u.qs(".cancel .button", overlay);
									overlay.cancel.overlay = overlay;
									overlay.cancel.removeAttribute("href");
									u.e.click(overlay.cancel);
									overlay.cancel.clicked = function(event) {
										this.overlay.transitioned = function(event) {
											this.parentNode.removeChild(this);
										}
										u.a.transition(this.overlay, "all 0.5s ease-out");
										u.a.setOpacity(this.overlay, 0);
										//u.notify(this.overlay.terms_error_msg, "error");
									}

									overlay.accept = u.qs(".accept .button", overlay);
									overlay.accept.removeAttribute("href");
									overlay.accept.e = this.e;
									u.e.click(overlay.accept);
									overlay.accept.clicked = function(event) {

										this.Response = function(response) {
											this.e.signin.logonuidfield.value = this.e.signin.response.userid;
											this.e.signin.form.submit();
										}
										u.Request(this, "/util/MDSetTermsAcceptedByUserId?userid="+this.e.signin.response.userid, false, "POST");
//										this.Response(({"success":true}));
									}
									
								}
							}
							this.terms_error_msg = response.terms_error_msg;
							u.Request(this, "/ajax/terms.html");
						}
						else if(!response.logon_accepted) {
							//u.notify(response.logon_error_msg, "error");
						}
					}
				}
//				u.bug("/util/SECCheckUser?userid=" + this.field_username.iN.value + "&password=" + this.field_password.iN.value);
				u.Request(this, "/util/SECCheckUser?userid=" + this.field_username.iN.value + "&password=" + encodeURIComponent(this.field_password.iN.value), false, "POST");
//				this.Response({"success":true});
//				this.Response({"success":false, "terms_accepted":false});

			}
		}


		// setup reset button in signin screen
		e.signin.bn_reset = u.qs(".reset", e.signin);
		e.signin.bn_reset.e = e;
		e.signin.bn_reset.removeAttribute("href");
		u.e.click(e.signin.bn_reset);
		e.signin.bn_reset.clicked = function(event) {
			u.e.kill(event);

			this.e.signin.transitioned = function(event) {
				this.transitioned = null;
				u.a.setOpacity(this.e.reset, 0);
				u.as(this.e.reset, "display", "block");
				u.as(this, "display", "none");

				u.a.transition(this.e.reset, "all 0.3s ease-out");
				u.a.setOpacity(this.e.reset, 1);
				this.e.reset.field_email.iN.focus();
			}
			u.a.transition(this.e.signin, "all 0.3s ease-out");
			u.a.setOpacity(this.e.signin, 0);
		}

		// reset screen
		e.reset = u.qs(".box.reset", e);
		e.reset.e = e;
		e.reset.form = u.qs("form", e.reset)
		e.reset.form.onsubmit = function() {return false;}

		e.reset.field_email = u.qs("div.email", e.reset);
		e.reset.field_email.iN = u.qs("input", e.reset.field_email);
		e.reset.field_email.iN.e = e;
		e.reset.field_email.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.reset.resetUser();
				return false;
			}
		}

		// cancel button
		e.reset.bn_cancel = u.qs(".cancel .button", e.reset);
		e.reset.bn_cancel.e = e;
		e.reset.bn_cancel.removeAttribute("href");
		u.e.click(e.reset.bn_cancel);
		e.reset.bn_cancel.clicked = function(event) {
			u.e.kill(event);

			this.e.reset.transitioned = function(event) {
				this.transitioned = null;
				u.a.setOpacity(this.e.signin, 0);
				u.as(this.e.signin, "display", "block");
				u.as(this, "display", "none");

				u.a.transition(this.e.signin, "all 0.3s ease-out");
				u.a.setOpacity(this.e.signin, 1);
				this.e.signin.field_username.iN.focus();

			}
			u.a.transition(this.e.reset, "all 0.3s ease-out");
			u.a.setOpacity(this.e.reset, 0);
		}

		e.reset.bn_submit = u.qs(".submit .button", e.reset);
		e.reset.bn_submit.e = e;
		e.reset.bn_submit.type = "button";
		u.e.click(e.reset.bn_submit);
		e.reset.bn_submit.clicked = function(event) {
			u.e.kill(event);

			this.e.reset.resetUser();
		}

		e.reset.resetUser = function() {

			// dummy validation for now
			u.rc(this.e.reset.field_email, "error");
			this.e.reset.error = false;

			if(!this.e.reset.field_email.iN.value) {
				this.e.reset.error = true;
				u.ac(this.e.reset.field_email, "error");
			}

			// if both fields are filled, run checkUser routine
			if(!this.e.reset.error) {
			
				this.Response = function(response) {

					if(response.success) {

						u.notify("Mail sent, check email", "receipt");
						this.bn_cancel.clicked();
					}
					else {

						u.notify(response.error_msg, "error");
					}
				}
//				u.bug(this.form.action + "?email=" + this.field_email.iN.value);
				u.Request(this, this.form.action, u.f.getParams(this.form, "string"), this.form.method);
//				this.Response({"success":true});
			}

		}
		
	}
}

Util.Objects["createpassword"] = new function() {
	this.init = function(e) {
		// e = content node in dom

		e.page = u.qs("#page");

		e.box = u.qs(".box", e);
		e.box.e = e;

		e.box.form = u.qs("form", e.box)
		e.box.form.onsubmit = function() {return false;}

		e.box.sap_form = u.qs(".SAP form", e.box)


		e.box.field_oldpassword = u.qs("div.oldpassword", e.box);
		e.box.field_oldpassword.iN = u.qs("input", e.box.field_oldpassword);
		e.box.field_oldpassword.iN.e = e;
		e.box.field_oldpassword.iN.focus();
		e.box.field_oldpassword.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.box.submitted();
			}
		}

		e.box.field_newpassword = u.qs("div.newpassword", e.box);
		e.box.field_newpassword.iN = u.qs("input", e.box.field_newpassword);
		e.box.field_newpassword.iN.e = e;
		e.box.field_newpassword.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.box.submitted();
			}
		}

		e.box.field_confirmpassword = u.qs("div.confirmpassword", e.box);
		e.box.field_confirmpassword.iN = u.qs("input", e.box.field_confirmpassword);
		e.box.field_confirmpassword.iN.e = e;
		e.box.field_confirmpassword.iN.onkeydown = function(event) {
			event ? event : window.event;
			if(event.keyCode == 13) {
				u.e.kill(event);
				this.e.box.submitted();
			}
		}

		e.box.bn_update = u.qs(".update .button", e.box);
		e.box.bn_update.e = e;
		e.box.bn_update.type = "button";
		u.e.click(e.box.bn_update);
		e.box.bn_update.clicked = function(event) {
			u.e.kill(event);
			this.e.box.submitted();


		}
		
		e.box.submitted = function() {

			// dummy validation for now
			u.rc(this.field_oldpassword, "error");
			u.rc(this.field_newpassword, "error");
			u.rc(this.field_confirmpassword, "error");
			this.error = false;

			if(!this.field_oldpassword.iN.value) {
				this.error = true;
				u.ac(this.field_oldpassword, "error");
			}
			if(!this.field_newpassword.iN.value) {
				this.error = true;
				u.ac(this.field_newpassword, "error");
			}
			if(!this.field_confirmpassword.iN.value) {
				this.error = true;
				u.ac(this.field_confirmpassword, "error");
			}
			if(this.field_confirmpassword.iN.value != this.field_newpassword.iN.value) {
				this.error = true;
				u.ac(this.field_newpassword, "error");
				u.ac(this.field_confirmpassword, "error");
			}


			// if both fields are filled, run checkUser routine
			if(this.error) {
				this.field_oldpassword.iN.focus();
			}
			else if(!this.error) {

				this.Response = function(response) {

//					u.bug(this.field_oldpassword.iN.value + ":" + this.field_newpassword.iN.value + ":" + this.field_confirmpassword.iN.value)

					// checkUser is successfull
					if(response && response.success) {
						// transfer values
						u.qs("#logonoldpassfield", this.sap_form).value = this.field_oldpassword.iN.value;
						u.qs("#logonnewpassfield", this.sap_form).value = this.field_newpassword.iN.value;
						u.qs("#logonretypepassfield", this.sap_form).value = this.field_confirmpassword.iN.value;
						// submit actual form
						this.sap_form.submit();
					}
					// further action required
					else {
						if(response) {
							// Json has changed so this notification shows automatically
							//u.notify(response.error_msg, "error");
						}
						else {
							u.notify("unknown error", "error");
						}

					}
				}

				// make request
				u.Request(this, this.form.action, u.f.getParams(this.form, "string"), this.form.method);
			}
		}



	}
}

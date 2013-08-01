Util.Objects["page"] = new function() {
	this.init = function(e) {
		// e = page node in dom

		var i, node;




		// setup hints
		e.hints = function() {
			var hints = u.qsa("[title]", this);

			//u.bug("hints:" + hints.length)

			// if hints - inject hint node in body
			// set show/hide events on each node with title attribute
			// remove title to avoid default behaviour (but save title value on node)


		}
		// e.hints();

		// create overlay
		e.overlay = function(content) {

			// TODO - disable tabbing

			if(!this.overlay) {
				this.overlay = u.ae(document.body, "div", ({"class":"overlay"}));
				this.overlay.page = this;

				this.overlay.appendChild(content.cloneNode(true));

				this.overlay.close = u.qs(".header .close");
				this.overlay.close.layover = this.layover;
				u.link(this.overlay.close);
				this.overlay.close.clicked = function(event) {

					this.overlay.transitioned = function(event) {
						u.as(this, "display", "none");
					}
					u.a.transition(this.overlay, "all 0.5s ease-out");
					u.a.setOpacity(this.overlay, 0);
					
					if(typeof(this.overlay.closed) == "function") {
						this.overlay.closed(event);
					}
				}
			}
			

		}


		// options/fold down menus controller
		e._showOptions = function() {
			// this = ul

			u.t.resetTimer(this.t_hide);

			this.open = true;
			u.ac(this.bn, "open");

			u.a.transition(this, "none");
			this.transitioned = null;

			u.a.setOpacity(this, 0);
			u.as(this, "display", "block");

			u.a.transition(this, "all 0.1s ease-in");
			u.a.setOpacity(this, 1);

			// set up time based hiding
			if(u.e.event_pref == "mouse") {
				this.onmouseout = function(event) {
					this.t_hide = u.t.setTimer(this, this.hide, "1000");
				}
				this.onmouseover = function(event) {
					u.t.resetTimer(this.t_hide);
				}
				var nodes = u.qs("li", this);
				var i, node;
				for(i = 0; node = nodes[i]; i++) {
					node.list = this;
					this.onmouseover = function(event) {
						u.t.resetTimer(this.list.t_hide);
					}
				}

			}
		}

		e._hideOptions = function() {
			// this = ul

			u.t.resetTimer(this.t_hide);

			this.open = false;
			u.rc(this.bn, "open");

			u.a.transition(this, "all 0.2s ease-out");
			u.a.setOpacity(this, 0);

			this.transitioned = function(event) {
				u.a.transition(this, "none");
				this.transitioned = null;

				u.as(this, "display", "none");
			}
		}

		// setup options dropdown menu
		e.setupOptions = function(node) {
			node.menu = u.qs("ul", node);
			node.menu.bn = node;
			node.menu.hide = this._hideOptions;
			node.menu.show = this._showOptions;

			u.e.click(node);
			// set default event handling
			node.clicked = function(event) {
				u.e.kill(event);
				// is menu closed, then open
				if(!this.menu.open) {
					this.menu.show();
				}
				// else close
				else {
					this.menu.hide();
				}
			}

			// cancel javascript event on menu
			u.e.click(node.menu);
			node.menu.clicked = function(event) {
				u.e.kill(event);
			}

			// fix menu notification elements issue (you want entire node to be clickable)
			// moves notification node into <a>-tag
			var nodes = u.qsa("li", node);
			var i, menuitem;
			for(i = 0; menuitem = nodes[i]; i++) {
				var notification = u.qs(".notification", menuitem);
				if(notification) {
					u.qs("a", menuitem).appendChild(notification);
				}
			}

		}




		// MAIN ELEMENTS
		// header element
		e.hN = u.qs("#header", e);
		e.hN.page = e;
		// content element
		e.cN = u.qs("#content", e);
		e.cN.page = e;

		// HEADER elements
		e.hN.user = u.qs(".user", e.hN);
		if(e.hN.user) {
			e.hN.user.page = e;
			// setup dropdown
			e.setupOptions(e.hN.user);
			// overwrite default handling - user and navigation dropdowns should not be open at the same time
			e.hN.user.clicked = function(event) {
				u.e.kill(event);
				if(!this.menu.open) {
					this.menu.show();
					if(this.page.nN && this.page.nN.menu.open) {
						e.nN.menu.hide();
					}
				}
				else {
					this.menu.hide();
				}
			}
		}


		// NAVIGATION element
		e.nN = u.qs("#navigation", e);
		if(e.nN) {
			e.nN.page = e;
			// setup dropdown
			e.setupOptions(e.nN);
			// overwrite default handling - user and navigation dropdowns should not be open at the same time
			e.nN.clicked = function(event) {
				u.e.kill(event);
				if(!this.menu.open) {
					this.menu.show();
					if(this.page.hN.user && this.page.hN.user.menu.open) {
						e.hN.user.menu.hide();
					}
				}
				else {
					this.menu.hide();
				}
			}

		}


		// scrollhandler - add dropshadow when page is scrolled
		e._scrollHandler = function(event) {
			var page = u.qs("#page");
			if(u.scrollY() > 0) {
				u.ac(page, "scrolled")
			}
			else {
				u.rc(page, "scrolled")
			}
		}
		// update on page scroll
		u.e.addEvent(window, "scroll", e._scrollHandler);
		// run on initialization
		e._scrollHandler();

	}

	
}


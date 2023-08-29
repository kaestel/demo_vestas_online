Util.Objects["tdExpand"] = new function() {
	this.init = function(td) {

		u.ac(td, "togglable");

		// add toggler element
		td.toggler = u.ie(td, "div", "toggler");
		td.toggler.td = td;

		// description node
		td._description = u.qs(".description", td);
		td._description.td = td;


		// get full height for visual effects
		td._description.full_height = td._description.offsetHeight;
		// set initial collapsed height
		u.a.setHeight(td._description, 0);


		// set toggler action
		u.e.click(td.toggler);
		td.toggler.clicked = function(event) {

			this.td._description.transitioned = function(event) {
				u.a.transition(this, "none");
				this.transitioned = null;
			}
			u.a.transition(this.td._description, "all 0.3s ease-out");

			// if open already, close
			if(u.hc(this.td, "open")) {
				u.a.setHeight(this.td._description, 0);
				u.rc(this.td, "open");
			}
			// open
			else {
				u.a.setHeight(this.td._description, this.td._description.full_height);
				u.ac(this.td, "open");
			}
		}

	}
}
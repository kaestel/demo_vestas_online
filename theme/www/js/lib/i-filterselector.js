Util.Objects["filterSelector"] = new function() {
	this.init = function(field) {
		var i, option;

		// inject options ul
		field.ul = u.ie(field, "ul");


		// inject selected option node
		field.selected_option = u.ie(field, "div", ({"class":"selected_option"}));
		field.selected_option.field = field;
		field.selected_option.innerHTML = field.iN.options[field.iN.selectedIndex].text;

		u.e.click(field.selected_option);
		field.selected_option.clicked = function(event) {
			if(u.hc(this.field, "open")) {
				this.field._close();
			}
			else {
				this.field._open();
			}
		}


		// open dropdown
		field._open = function() {
			u.ac(this, "open");

			u.a.transition(this.ul, "none");
			u.a.setOpacity(this.ul, 0);
			u.as(this.ul, "display", "block");

			this.ul.transitioned = function(event) {
				u.a.transition(this, "none");
				this.transitioned = null;
			}

			u.a.transition(this.ul, "all 0.2s ease-in");
			u.a.setOpacity(this.ul, 1);

		}


		// select option
		field._select = function(li) {
			
			this.iN.val(li._value);
			this._close();
		}


		// close dropdown
		field._close = function() {
			u.rc(this, "open");

			u.a.transition(this.ul, "none");
			u.a.setOpacity(this.ul, 0);
			u.as(this.ul, "display", "none");
		}


		// create options
		for(i = 0; option = field.iN.options[i]; i++) {
			option.li = u.ae(field.ul, "li");
			option.li.field = field;
			option.li.innerHTML = option.text
			option.li._value = option.value;

			u.e.click(option.li);
			option.li.clicked = function(event) {
				this.field._select(this);
				this.field._form.submitted();
			}
		}


		// extend val function to also handle overlay
		field.iN.val = function(value) {
			if(value !== undefined) {
				var i, option;
				for(i = 0; option = this.options[i]; i++) {
					if(option.value == value) {
						this.selectedIndex = i;
						this.field.selected_option.innerHTML = option.text
						return i;
					}
				}
				return false;
			}
			else {
				return this.options[this.selectedIndex].value;
			}
		}

	}
}
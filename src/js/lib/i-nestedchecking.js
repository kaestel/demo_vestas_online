Util.Objects["nestedchecking"] = new function() {
	this.init = function(e) {

		var checkboxes = u.qsa("input[type=checkbox]", e);
		var checkbox, i;
		for(i = 0; checkbox = checkboxes[i]; i++) {

			// TODO: figure out which method to use to set disabled/checked

			if(checkbox.getAttribute("checked") == "false") {
				checkbox.removeAttribute("checked");
			}

			if(u.hc(checkbox, "is_disabled_true")) {
				checkbox.disabled = "disabled";
			}


			checkbox.clicked = function() {
				var nested_checkboxes = u.qsa("input[type=checkbox]", this.parentNode);
				var nested_checkbox, i;
				for(i = 0; nested_checkbox = nested_checkboxes[i]; i++) {
					if(nested_checkbox != this && !nested_checkbox.disabled) {
						if(!this.checked) {
							nested_checkbox.checked = false;
						}
						else {
							nested_checkbox.checked = true;
						}
					}
				}
//				u.bug(this.checked);
			}
			u.e.addEvent(checkbox, "change", checkbox.clicked);
			
		}

//		alert("cb:" + checkboxes.length)
	}
}
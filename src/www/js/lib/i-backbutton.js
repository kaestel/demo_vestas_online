Util.Objects["backbutton"] = new function() {
	this.init = function(back_li) {
		u.link(back_li);
		back_li.clicked = function(event) {
			var referer_field = u.qs("#refererpage");
			if (referer_field && (referer_field.value != "" || referer_field.value != "null")) {
				//location.href = referer_field.value;
				history.back();
			}
			else {
				location.href = this.url;
			}
		};
	}
}
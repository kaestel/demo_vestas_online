// clean parameter object for .template items
u.cleanParams = function(params, form) {
	var new_params = new Object();
	for(param in params) {
		// only include non .template fields
		if(form[param] && !u.isTemplateChild(form[param])) {
			new_params[param] = params[param];
		}
	}
	return new_params;
}

Util.Form.customSend = new Object();
// overwite default settings to remove .template inputs
Util.Form.customSend["parameters"] = function(params, form) {

	params = u.cleanParams(params, form);

	var string = "";

	for(param in params) {
		string += param + "=" + encodeURIComponent(params[param]) + "&";
	}
	return string;
}
Util.Form.customSend["json"] = function(params, form) {

	params = u.cleanParams(params, form);

	// convert to JSON object
	object = u.f.convertNamesToJsonObject(params);
	return JSON.stringify(object);
}
Util.Form.customSend["object"] = function(params, form) {

	return u.cleanParams(params, form);
}
// custom vestas type
Util.Form.customSend["jdata"] = function(params, form) {

	params = u.cleanParams(params, form);

	object = u.f.convertNamesToJsonObject(params);
	return "jdata=" + encodeURIComponent(JSON.stringify(object));
}



Util.Form.customInit = new Object();
Util.Form.customInit["date"] = function(field) {

	var form = field._form;
	// timestamp input
	field.iN = u.qs("input", field);
	field.iN.field = field;
	field.iN.val = function(value) {if(value) {this.value = value;} else {return this.value;}}
	u.as(field.iN, "display", "none");

	form.fields[field.iN.name] = field.iN;

	// get current date
	var date = parseInt(field.iN.value);
	var day = "";
	var month = "";
	var year = "";
	if(date) {
		day = u.date("d", date);
		month = u.date("m", date);
		year = u.date("Y", date);
	}

	var date_ui = u.ae(field, "div");
	field.insertBefore(date_ui, field.iN);

	// create inputs for UI extension
	// year
	field.year = u.ae(date_ui, "input", {"name":"year","maxlength":"4","class":"ignoreinput year","value":year})
	field.year.field = field;
	field.year.val = function(value) {if(value) {this.value = value;} else {return this.value;}}


	// know position in field-order
	field.year.field_order = form.field_order.length;
	form.field_order[form.field_order.length] = field.year;


	// automatic focus on month field when year is 4 chars
	field.year.done = function() {
		if(!isNaN(this.val()) && this.val().length == 4 && u.f.validate(this)) {
			if(this.field._form.field_order[this.field_order+1]) {
				this.field._form.field_order[this.field_order+1].focus();
			}
		}
	}
	u.e.addEvent(field.year, "keyup", field.year.done);


	// separator
	u.ae(date_ui, "span").innerHTML = ".";

	// month
	field.month = u.ae(date_ui, "input", {"name":"month","maxlength":"2","class":"ignoreinput month","value":month})
	field.month.field = field;
	field.month.val = function(value) {if(value) {this.value = value;} else {return this.value;}}


	// know position in field-order
	field.month.field_order = form.field_order.length;
	form.field_order[form.field_order.length] = field.month;


	// automatic focus on day field when month is 2 chars
	field.month.done = function() {
		if(!isNaN(this.val()) && this.val().length == 2 && u.f.validate(this)) {
			if(this.field._form.field_order[this.field_order+1]) {
				this.field._form.field_order[this.field_order+1].focus();
			}
		}
	}
	u.e.addEvent(field.month, "keyup", field.month.done);


	// separator
	u.ae(date_ui, "span").innerHTML = ".";

	// day
	field.day = u.ae(date_ui, "input", {"name":"day","maxlength":"2","class":"ignoreinput day","value":day})
	field.day.field = field;
	field.day.val = function(value) {if(value) {this.value = value;} else {return this.value;}}


	// know position in field-order
	field.day.field_order = form.field_order.length;
	form.field_order[form.field_order.length] = field.day;

	// automatic focus on day field when month is 2 chars
	field.day.done = function() {
		if(!isNaN(this.val()) && this.val().length == 2 && u.f.validate(this)) {
			if(this.field._form.field_order[this.field_order+1]) {
				this.field._form.field_order[this.field_order+1].focus();
			}
		}
	}
	u.e.addEvent(field.day, "keyup", field.day.done);


	u.f.submitOnEnter(field.year);
	u.f.submitOnEnter(field.month);
	u.f.submitOnEnter(field.day);
	u.f.activate(field.year);
	u.f.activate(field.month);
	u.f.activate(field.day);
	u.f.validate(field.year);
	u.f.validate(field.month);
	u.f.validate(field.day);


	u.e.addEvent(field.day, "keyup", u.f._update);
	u.e.addEvent(field.month, "keyup", u.f._update);
	u.e.addEvent(field.year, "keyup", u.f._update);
	u.e.addEvent(field.day, "change", u.f._validateInput);
	u.e.addEvent(field.month, "change", u.f._validateInput);
	u.e.addEvent(field.year, "change", u.f._validateInput);

}


Util.Form.customValidate = new Object();
Util.Form.customValidate["date"] = function(iN) {

	var field = iN.field;

	u.rc(field.iN, "error");

	// validate year
	if(u.hc(iN, "year")) {
		if(((!isNaN(iN.value) && iN.value > 1970) || (!field._required && !iN.value))) {
//			u.bug("valid year:" + iN.field.iN.name);
			u.f.fieldCorrect(iN);
		}
		else {
//			u.bug("invalid year:" + iN.field.iN.name);
			u.f.fieldError(iN);
		}
	}

	// validate month
	if(u.hc(iN, "month")) {
		if(((!isNaN(iN.value) && (iN.value > 0 && iN.value <= 12)) || (!field._required && !iN.value))) {
//			u.bug("valid month:" + iN.field.iN.name);
			u.f.fieldCorrect(iN);
		}
		else {
//			u.bug("invalid month:" + iN.field.iN.name);
			u.f.fieldError(iN);
		}
	}

	// validate day
	if(u.hc(iN, "day")) {

		if(((!isNaN(iN.value) && (iN.value > 0 && ((iN.field.year.value && iN.field.month.value && iN.value <= new Date(iN.field.year.value, iN.field.month.value, 0).getDate()) || (!iN.field.year.value || !iN.field.month.value && iN.value <= 31)))) || (!field._required && !iN.value))) {
//			u.bug("valid day:" + iN.field.iN.name);
			u.f.fieldCorrect(iN);
		}
		else {
//			u.bug("invalid day:" + iN.field.iN.name);
			u.f.fieldError(iN);
		}
	}

	// any errors in year, month, day
	if(u.qs("input.error", field)) {
//		u.bug("errors found:" + u.qs("input.error", field))
		// set field error on original field
		u.f.fieldError(field.iN);
	}
	// check date 
	else {
//		u.bug(field.month.val() + ":" + Number(field.month.val()) + ":" + parseInt(field.month.val()));

		if(new Date(Number(field.year.val()), Number(field.month.val())-1, Number(field.day.val())).getTime() > 0) {

//			u.bug("valid date:"  + field.year.val() +"::"+ new Date(field.year.val(), field.month.val()-1, field.day.val()))
//			u.bug("after:" + after + ":" + field.iN.name);

			field.iN.value = new Date(Number(field.year.val()), Number(field.month.val())-1, Number(field.day.val())).getTime();

			// validate before/after clause
			var after = u.getIJ(field, "after");
			if(after) {
//				u.bug("after:" + field.iN.value + "::" + field._form.fields[after].value);
				if(Number(field.iN.value) > Number(field._form.fields[after].value)) {
//					u.bug("correct")
					u.f.fieldCorrect(field.iN);
				}
				else {
//					u.bug("incorrect")
					u.f.fieldError(field.iN);
				}
			}

			else {
				u.f.fieldCorrect(field.iN);
			}
		}

		// bad date
		else {
			u.f.fieldError(field.iN);
		}
	}

}
// Simple validation of response
// automatically executes script elements
// state = true = process complete
// state = false = process error
// returns content element
Util.validateResponse = function(response){

//	u.bug("Validate:" + response)
//	u.bug("Validate node:" + response.node)
//	u.listObjectContent(response);

	var object;

// u.bug("response:" + response);
// var div = document.createElement("div");
	
	if(response) {
		// alert(request.responseHTML);
		// u.bug("status:" + response.status);
		// u.bug("responseText:" + response.responseText);

		// HTTP object from GET/POST
		if(response.status) {

			// Accaptable response (Exclude knows bads)
			if(!response.status.toString().match(/403|404|500/)) {
				object = u.evaluateResponse(response.responseText);
				// u.bug("response:" + object);
			}
			else {
				object = false;
			}
		}
		// SCRIPT
		else {
			if(response.responseText) {
				object = u.evaluateResponse(response.responseText);
			}
			// u.bug(typeof(response));
			// if(typeof(response) == "") {
		}
	}

	if(!object || (object.isJSON && !object.success)) {
		var message = "";
		
		// If object.error_msg is a string but returns false in an if-check
		// then it's because it's in the json response but empty and
		// we leave it as-is.
		if (object) {
			if (object.error_msg) {
				message = object.error_msg;
			}
			else if (typeof(object.error_msg) == "string") {
				message = "";
			}
			else {
				message = "Unknown error";
			}
		}
		//var message = (object && object.error_msg) ? object.error_msg : "Unknown error";
		u.notify(message, "error", response.node.message_target ? response.node.message_target : false);
	}

	if(typeof(response.node.Response) == "function") {
		response.node.Response(object);
	}

}
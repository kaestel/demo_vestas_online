// Sorts li-nodes within a ul

Util.Sort = u.s = new function() {

	this.sortable = function(e) {
		var i, j, node;

		// get all possible targets
		// TODO: needs to be extended to handle nested draggable list and drag between multiple lists
		// INFO: map possible targets by classname
		//       - mulitple lists would be enabled by setting sort on wrapping div
		//       - nested list would be separated by different classnames
		var target_class = u.getIJ(e, "targets");
		e.targets = target_class ? "."+target_class : "li";
		e.nodes = u.qsa(e.targets, e);


		// set up targets
		for(i = 0; node = e.nodes[i]; i++) {

			// remember wrapper
			node.e = e;

			// uniquely identify element as target
			node.dragme = true;

			// get relative offset coords for nodes
			// if node is absolute positioned or placed inside relative or absolute container,
			// this must be reflected in its positioning when being dragged
			node.rel_ox = u.relOffsetX(node);
			node.rel_oy = u.relOffsetY(node);
//			u.bug(u.nodeId(node) + ":node.rel_ox = " + node.rel_ox + ", node.rel_oy = " + node.rel_oy)


			// look for specific drag-node
			node.drag = u.qs(".drag", node);
			// if no drag area, use entire node
			if(!node.drag) {
				node.drag = node;
			}

			// remember which is actual drag node
			node.drag.node = node;
			// cross-reference all drag children, so every event.target knows node
			var drag_children = u.qsa("*", node.drag);
			if(drag_children) {
				for(j = 0; child = drag_children[j]; j++) {
					child.node = node;
				}
			}

			// set start drag event handler
			u.e.addStartEvent(node.drag , this._pick);
		}


		// inject target correctly in relation to node
		e.injectTarget = function(node) {
			var i, node, nodes;

			// if target does not exist or is after node, insert target before node
			if(!this.tN.parentNode || (this.tN.parentNode && this.tN.i > node.i)) {
				this.insertBefore(this.tN, node);
			}
			// if target exist before node in list, target needs to be injected after node,
			// because node will shift when target is removed from original position
			else {
				this.appendChild(this.tN);
			}

			// update node i(ndex) values
			nodes = u.qsa(this.targets, this);
			for(i = 0; node = nodes[i]; i++) {
				node.i = i;
			}

		}


		// window scroller
		// based on document body event
		// scrolls page (if possible) when node is dragged out of visible area
		e._scrollWindowY = function() {
			if((u.pageScrollY() + this.scroll_speed) >= 0 && (u.pageScrollY() + this.scroll_speed) <= u.htmlH() - u.browserH()) {
				window.scrollBy(0, this.scroll_speed);
				this.t_scroller = u.t.setTimer(this, this._scrollWindowY, 50);
			}
		}

	}


	// node picked ("this" is specific drag-node or entire node) - use this.node securely points to entire node
	this._pick = function(event) {
		u.e.kill(event);

		// u.bug("_pick:" + u.nodeId(this.node))

		// reset window scroller
		if(this.node.e.t_scroller) {
			u.t.resetTimer(this.node.e.t_scroller);
			this.node.e.scroll_speed = 0;
		}


		// don't pick unless last element was correctly dropped
		if(!this.node.e.dragged) {

			// dragging has begun
			var node = this.node.e.dragged = this.node;

			// dragged element start settings
			node.start_opacity = u.gcs(node, "opacity");
			node.start_position = u.gcs(node, "position");


			// drag target - create node based on dragged node
			if(!node.e.tN) {
				node.e.tN = document.createElement(node.nodeName);
			}
			u.sc(node.e.tN, "target " + node.className);
			u.as(node.e.tN, "height", u.actualHeight(node)+"px");
			u.as(node.e.tN, "width", u.actualWidth(node)+"px");
			u.as(node.e.tN, "opacity", node.start_opacity - 0.5);
			node.e.tN.innerHTML = node.innerHTML;


			// set fixed dragged element width and lower opacity
			u.as(node, "width", u.actualWidth(node) + "px");
			u.as(node, "height", u.actualHeight(node) + "px");
			u.as(node, "opacity", node.start_opacity - 0.3);

			// set fixed list width and height to avoid shapeshifting when inserting and removing nodes
			// do this on _pick because content may change realtime
			u.as(node.e, "width", u.actualWidth(node.e) + "px");
			u.as(node.e, "height", u.actualHeight(node.e) + "px");


			// dragged element mouse offsets
			// when dragging you click somewhere on the element, but position left/top
			// - this is the offset from left/top to actual click position
			node.mouse_ox = u.eventX(event) - u.absX(node);
			node.mouse_oy = u.eventY(event) - u.absY(node);
//			u.bug("m_ox:" + u.eventX(event) + "-" + u.absX(node) + " = " + node.mouse_ox);
//			u.bug("m_oy:" + u.eventY(event) + "-" + u.absY(node) + " = " + node.mouse_oy);


			// position dragged element
			u.as(node, "left", (u.eventX(event) - node.rel_ox) - node.mouse_ox+"px");
			u.as(node, "top", (u.eventY(event) - node.rel_oy) - node.mouse_oy+"px");
			u.as(node, "bottom", "auto");
			u.as(node, "right", "auto");
			u.ac(node, "dragged");
			// when everything is set up, position absolute, ready to be dragged around
			u.as(node, "position", "absolute");


			// set drag and end events on body, to make sure events are captured even when away from list
			u.e.addMoveEvent(document.body , u.s._drag);
			u.e.addEndEvent(document.body , u.s._drop);

			// remember current drag scope
			document.body.e = node.e;


			// and insert target
			node.e.injectTarget(node);


			// notify picked
			if(typeof(node.e.picked) == "function") {
				node.e.picked(event);
			}
		}

	}


	// drag element
	// event handling on document.body
	// this.e is a reference to current list
	this._drag = function(event) {
		var i, node;
		u.e.kill(event);

//		u.bug("_drag:" + u.nodeId(event.target))


		// reset window scroller
		if(this.e.t_scroller) {
			u.t.resetTimer(this.e.t_scroller);
			this.e.scroll_speed = 0;
		}


		// only execute drag if dragged flag is set
		if(this.e.dragged) {


			// pre-calculate vars for better performance in following calulations
			// left/top is event x/y - mouse offset
			var m_left = u.eventX(event);
			var m_top = u.eventY(event);

			var d_left = m_left - this.e.dragged.mouse_ox;
			var d_top = m_top - this.e.dragged.mouse_oy;
//			u.bug("d:" + d_left + "x" + d_top);


			// set dragged element properties
			u.as(this.e.dragged, "left", d_left - this.e.dragged.rel_ox+"px");
			u.as(this.e.dragged, "top", d_top - this.e.dragged.rel_oy+"px");

			// check for overlap
			for(i = 0; node = this.e.nodes[i]; i++) {

				// do not check current node or target node for overlap
				if(node != this.e.dragged && node != this.e.tN) {

					var o_left = u.absX(node);
					var o_top = u.absY(node);
					var o_width = node.offsetWidth;
					var o_height = node.offsetHeight;

					// overlap with element
				 	if(o_left < m_left && (o_left + o_width) > m_left && o_top < m_top && (o_top + o_height) > m_top) {

						this.e.injectTarget(node);

						// stop looking for overlap
						break;
					}
				}
			}


			// page is scrollable
			if(u.browserH() < u.htmlH()) {

				// element is being dragged out of viewable area (top)
				if(u.scrollY() >= d_top - 10) {
					this.e.scroll_speed = -5;
					this.e._scrollWindowY();
				}
				// element is being dragged out of viewable area (bottom)
				else if(u.browserH() + u.scrollY() < d_top + this.e.dragged.offsetHeight + 10) {
					this.e.scroll_speed = 5;
					this.e._scrollWindowY();
				}
				else {
					u.t.resetTimer(this.e.t_scroller);
				}
			}


		}

		// notify dragged
		if(typeof(this.e.dragged) == "function") {
			this.e.dragged(event);
		}

	}

	// element is dropped
	// event handling on document.body
	this._drop = function(event) {
		u.e.kill(event);


		// remove events handlers

//		u.e.removeEvent(document.body, u.e.event_pref == "touch" ? "touchmove" : "mousemove", u.s._drag);
//		u.e.removeEvent(document.body, u.e.event_pref == "touch" ? "touchend" : "mouseup", u.s._drop);

		u.e.removeMoveEvent(document.body , u.s._drag);
		u.e.removeEndEvent(document.body , u.s._drop);


		// replace target with dragged element
		this.e.tN = this.e.replaceChild(this.e.dragged, this.e.tN);


		// reset dragged element
		u.as(this.e.dragged, "position", this.e.dragged.start_position);
		u.as(this.e.dragged, "opacity", this.e.dragged.start_opacity);
		u.as(this.e.dragged, "left", "");
		u.as(this.e.dragged, "top", "");
		u.as(this.e.dragged, "bottom", "");
		u.as(this.e.dragged, "width", "");


		// reset list to make it flexible again
		u.as(this.e, "width", "");
		u.as(this.e, "height", "");


		// reset dragged reference
		u.rc(this.e.dragged, "dragged");
		this.e.dragged = false;


		// stop window scroller
		u.t.resetTimer(this.e.t_scroller);
		this.e.scroll_speed = 0;


		// update nodes list to represent new order
		this.e.nodes = u.qsa(this.e.targets, this.e);


		// notify dropped
		if(typeof(this.e.dropped) == "function") {
			this.e.dropped(event);
		}

	}

}

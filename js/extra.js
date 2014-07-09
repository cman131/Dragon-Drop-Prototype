/**
 * Getting the angle myself because tools aren't helpful enough
 * 
 * @param element - the element to get the damn angle of
 * @author Conor Wright
 */
function whatTheHellIsTheAngle(element){
	// Such Style
	var style = window.getComputedStyle(element, null);
	
	// Much accounting
	var prop = style.getPropertyValue("-webkit-transform") ||
         style.getPropertyValue("-moz-transform") ||
         style.getPropertyValue("-ms-transform") ||
         style.getPropertyValue("-o-transform") ||
         style.getPropertyValue("transform");
	prop = prop.split(", ");
	var sinVal = parseFloat(prop[1]);
	var cosVal = parseFloat(prop[0].split("(")[1]);
	
	// So Mathmatical
	return Math.atan2(sinVal, cosVal)*(180/Math.PI);
}

// Frame information for the animation recording being made
var frames = {};

/**
 *
 * Starts the animation recording and disables
 * what you can't use during recording.
 *
 * @author Conor Wright
 */
function startRecord(){
	frames = {};
	var delay = parseInt($(".frame").get(0).value);
	var duration = parseInt($(".frame").get(1).value);
	frames.delay = delay;
	frames.time = duration;
	frames.initial = logCanvas();
	frames.start = logCanvasStyles();
	timeline.pause(parseInt(delay));
	disable();
	$.unblockUI();
	displayRecordMenu();
}

/**
 *
 * Runs when the record button is pressed.
 * blocks the UI and requests recording information.
 *
 * @author Conor Wright
 */
function record(){
	var message = "<div id='blocker' style='padding: 5px;padding-top:0px;'>"+
	"<h3>Frame Recording</h3>"+
	"<ul style='overflow-y: scroll; max-height: 70px'>"+
	"<li><label title='Seconds from 0'>Start: </label><input class='frame' type='number'></li>"+
	"<li><label title='Seconds from Start'>End: </label><input class='frame' type='number'></li>"+
	"</li>"+
	"</ul>"+
	"<button onclick='unblock();'>Cancel</button>"+
	"<button onclick='startRecord();'>Submit</button>"+
	"</div>";
	$.blockUI({message: message});
	$(".blockUI.blockMsg.blockPage").css("background-color", "#19a1a1");
	$(".blockUI.blockMsg.blockPage").css("cursor", "default");
}

/**
 *
 * Disables the elements that shouldn't be
 * interacted with during recording.
 *
 * @author Conor Wright
 */
function disable(){
	disabled = true;
	$("#slider").slider("disable");
	$(".controls button").prop("disabled", true);
	$("#editMenu button").prop("disabled", true);
	$("#menu .parent").addClass("disabled");
	$("#menu .sub-nav").removeClass("visible");
	$("#editMenu .sub-nav").addClass("visible");
}

/**
 *
 * Enables the elements that were disabled for recording
 *
 * @author Conor Wright
 */
function enable(){
	disabled=false;
	$("#slider").slider("enable");
	$(".controls button").prop("disabled", false);
	$("#editMenu button").prop("disabled", false);
	$("#menu .parent").removeClass("disabled");
}

/**
 *
 * Displays the "recording in progress" menu
 *
 * @author Conor Wright
 */
function displayRecordMenu(){
	var e = document.createElement("div");
	e.id="recordMenu";
	e.innerHTML = "<h3>Recording...</h3>"+
	"<button onclick='submitRecording();'>Submit Recording</button>";
	$("body").get(0).appendChild(e);
}

/**
 *
 * Removes the recording menu and submits the recording
 *
 * @author Conor Wright
 */
function submitRecording(){
	$("#recordMenu").remove();
	frames.end = logCanvasStyles();
	// Gonna parse the difference and make an animation
	parseDiff(frames);
	rewriteCanvas(JSON.stringify(frames.initial));
	log();
	updateTimeline();
	updateTimelineVisual();
	enable();
	frames = {};
}

/**
 *
 * Creates a log of the current canvas element styles
 *
 * @return The resulting log object
 * @author Conor Wright
 */
function logCanvasStyles(){
	var save = [];
	$(".selectable").each(function(){
		save[save.length] = {
		top: $(this).css("top"),
		left: $(this).css("left"),
		width: $(this).css("width"),
		height: $(this).css("height"),
		alpha: $(this).css("opacity"),
		rotation: whatTheHellIsTheAngle(this)
		};
	});
	return save;
}

/**
 *
 * Parses the difference between the logged canvas states.
 * Then creates the respective animation and puts it in
 * the animation collection.
 *
 * @param context - The context object of this recording
 * @author Conor Wright
 */
function parseDiff(context){
	var start;
	var end;
	var time = context.time;
	var delay = context.delay;
	var ease = Power0.easeOut;
	var temp;
	for(var i=0;i<context.start.length;i++){
		temp={};
		start = context.start[i];
		end = context.end[i];
		if(start.top!=end.top){
			var ychange = parseInt(end.top)-parseInt(start.top);
			temp.ypos = {position: i,val: parseInt(ychange),time: time,delay: delay, ease: ease};
		}
		if(start.left!=end.left){
			var xchange = parseInt(end.left)-parseInt(start.left);
			temp.xpos = {position: i,val: parseInt(xchange),time: time,delay: delay, ease: ease};
		}
		if(start.width!=end.width){
			var xschange = parseInt(end.width)/parseInt(start.width);
			temp.xscale = {position: i,val: xschange,time: time,delay: delay, ease: ease};
		}
		if(start.height!=end.height){
			var yschange = parseInt(end.height)/parseInt(start.height);
			temp.yscale = {position: i,val: yschange,time: time,delay: delay, ease: ease};
		}
		if(start.alpha!=end.alpha){
			temp.alpha = {position: i,val: parseInt(end.alpha),time: time,delay: delay, ease: ease};
		}
		if(start.rotation!=end.rotation){
			temp.rotate = {position: i,val: parseInt(end.rotation),time: time,delay: delay, ease: ease};
		}
		if(temp!={}){
			if(!animations[i]){
				animations[i]=[];
			}
			animations[i].push(temp);
		}
	}
}

/**
 *
 * Creates a clone of the selected element
 * and puts it in the canvas.
 *
 * @author Conor Wright
 */
function dupe(){
	var original = $(".elementSelected").get(0);
	var clone = original.cloneNode(false);
	clone.style.left = 0;
	clone.style.top = 0;
	bindSelectable(clone);
	$(original).removeClass("elementSelected");
	$("#canvas").get(0).appendChild(clone);
}

/**
 *
 * Adds the selectable functionality to given element
 *
 * @param dat - The element to bind
 * @author Conor Wright & Kevin Ha
 */
function bindSelectable(dat){
	$(dat).bind("mousedown", function(){
		 if($(this).hasClass('elementSelected')) {
			$(this).removeClass("elementSelected");
			$(this).off("click", ".dragon", addRotation);
		 }
		 else {
			$(this).addClass("elementSelected");
			$("#widthMod").val($(this).css("width"));
			$("#rotateMod").val(whatTheHellIsTheAngle(this));
			$("#htmlMod").val($(this).html());
			$("#fontColorMod").val($(this).css("color"))
			$("#textMod").val($(this).css("font-size"));
			$("#heightMod").val($(this).css("height"));
			$("#depthMod").val($(this).css("z-index"));
			$("#colorMod").val($(this).css("background-color"));
			$("#alphaMod").val($(this).css("opacity")*100);
		}
		
	});
}

/**
 *
 * The function for when a drag event starts on timeline
 * logs initial position and element
 *
 * @param event - the event object for the drag starting
 * @author Conor Wright
 */
function timeline_drag_start(event) {
	curDrag = $("body").get(0);
	stop();
	$(".moving").removeClass("moving");
	var style = window.getComputedStyle(event.target, null);
	offset_data = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY);
	event.dataTransfer.setData("text/plain",offset_data);
	event.target.className+=" moving";
} 

/**
 *
 * The function for when the dragon element is
 * dragged over the timeline. Logs positional change data while dragging
 *
 * @param event - the event object for the drag over occuring
 * @author Conor Wright
 */
function timeline_drag_over(event) { 
	if($(".moving").length<=0){
		return true;
	}
	var offset;
	try {
		offset = event.dataTransfer.getData("text/plain").split(',');
	} 
	catch(e) {
		offset = offset_data.split(',');
	}
	$(".moving.td").css("left", (event.clientX + parseInt(offset[0],10)) + 'px');
	var width;
	var left;
	if(event.clientX>=11){
		var key;
		if($(".moving").hasClass("anchor")){
			var parent = $(".moving").get(0).parentNode;
			if($(".moving").hasClass("anchor-right")){
				width = (event.clientX-parseInt(parent.getBoundingClientRect().left));
				$(parent).css("width", width + 'px');
			}
			else if($(".moving").hasClass("anchor-left")){
				var diff = parent.getBoundingClientRect().left - event.clientX;
				left = parseFloat(parent.style.left)-diff;
				left = ((left > 0) ? left : 0);
				width = parseFloat(parent.style.width)+diff;
				width = width>0?width:0;
				$(parent).css("width", width + 'px');
				$(parent).css("left", left + 'px');
			}
			key = $(parent).attr("onclick").split(",");
		}
		else{
			left = (event.clientX + parseInt(offset[0],10));
			$(".moving").css("left", left);
			key = $(".moving").attr("onclick").split(",");
		}
		var index = parseInt(key[1]);
		key = key[0].split("(")[1];
		for(key2 in animations[key][index]){
			if(left){
				animations[key][index][key2].delay = (left-11)/10;
			}
			if(width){
				animations[key][index][key2].time = (width)/10;
			}
		}
	}
	event.preventDefault(); 
	return false; 
} 

/**
 *
 * The function for when a timeline element is dropped on the timeline
 * positions the element(s) correctly and updates the animation data
 *
 * @param event - The event object for a drop event
 * @author Conor Wright
 */
function timeline_drop(event){
	if($(".moving").length<=0){
		return true;
	}
	var offset;
	try {
		offset = event.dataTransfer.getData("text/plain").split(',');
	} 
	catch(e) {
		offset = offset_data.split(',');
	}
	var left;
	var width;
	var key;
	if($(".moving").hasClass("anchor")){
		var parent = $(".moving").get(0).parentNode;
		if($(".moving").hasClass("anchor-right")){
			width = (event.clientX-parseInt(parent.getBoundingClientRect().left));
			$(parent).css("width", width + 'px');
		}
		else if($(".moving").hasClass("anchor-left")){
			var diff = parent.getBoundingClientRect().left - event.clientX;
			left = parseFloat(parent.style.left)-diff;
			left = ((left > 0) ? left : 0);
			width = parseFloat(parent.style.width)+diff;
			width = width>0?width:0;
			$(parent).css("width", width + 'px');
			$(parent).css("left", left + 'px');
		}
		$(".moving").removeClass("moving");
		key = $(parent).attr("onclick").split(",");
	}
	else{
		left = (event.clientX + parseInt(offset[0],10));
		$(".moving").css("left", left);
		key = $(".moving").attr("onclick").split(",");
		$(".moving").removeClass("moving");
	}
	var index = parseInt(key[1]);
	key = key[0].split("(")[1];
	for(key2 in animations[key][index]){
		if(left){
			console.log(left);
			animations[key][index][key2].delay = (left-11)/10;
		}
		if(width){
			console.log(left);
			animations[key][index][key2].time = (width)/10;
		}
	}
	updateTimeline();
	updateTimelineVisual();
	log();
}

function noDraggingHere(){
	//$('.moving').removeClass('moving');
	//updateTimeline();
	//updateTimelineVisual();
	//log();
}
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
		rotation: $(this).getRotateAngle()
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
	$(clone).bind("mousedown", function(){
			$(".elementSelected").removeClass("elementSelected");
			$(this).addClass("elementSelected");
			$("#widthMod").val($(this).css("width"));
			$("#htmlMod").val($(this).html());
			$("#fontColorMod").val($(this).css("color"))
			$("#textMod").val($(this).css("font-size"));
			$("#heightMod").val($(this).css("height"));
			$("#depthMod").val($(this).css("z-index"));
			$("#colorMod").val($(this).css("background-color"));
			$("#alphaMod").val($(this).css("opacity")*100);
			$("#rotateMod").val($(this).getRotateAngle());
	});
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
			$("#rotateMod").val($(this).getRotateAngle());
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

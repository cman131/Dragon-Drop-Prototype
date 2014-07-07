var frames = {};

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

function disable(){
	disabled = true;
	$("#slider").slider("disable");
	$(".controls button").prop("disabled", true);
	$("#editMenu button").prop("disabled", true);
	$("#menu .parent").addClass("disabled");
	$("#menu .sub-nav").removeClass("visible");
	$("#editMenu .sub-nav").addClass("visible");
}

function enable(){
	disabled=false;
	$("#slider").slider("enable");
	$(".controls button").prop("disabled", false);
	$("#editMenu button").prop("disabled", false);
	$("#menu .parent").removeClass("disabled");
}

function displayRecordMenu(){
	var e = document.createElement("div");
	e.id="recordMenu";
	e.innerHTML = "<h3>Recording...</h3>"+
	"<button onclick='submitRecording();'>Submit Recording</button>";
	$("body").get(0).appendChild(e);
}

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

function logCanvasStyles(){
	var save = [];
	$(".selectable").each(function(){
		save[save.length] = {
		top: $(this).css("top"),
		left: $(this).css("left"),
		width: $(this).css("width"),
		height: $(this).css("height"),
		alpha: $(this).css("opacity")
		};
	});
	return save;
}

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
		if(temp!={}){
			if(!animations[i]){
				animations[i]=[];
			}
			animations[i].push(temp);
		}
	}
}

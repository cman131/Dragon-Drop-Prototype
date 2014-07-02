function contains(obj1, obj2){
	return obj1.indexOf(obj2)>-1;
}

var curDrag;
var animations = [];

app = angular.module("app", []);

app.directive("dragon", function(){
	return {
		restrict: "C",
		link: function(scope, element, attrs){
			element.attr("draggable", "true");
			element.attr("ondragstart", "drag_start(event)");
		}
	}
});

app.directive("selectable", function(){
	return {
		restrict: "C",
		link: function(scope, element, attrs){
			element.bind("mousedown", function(){
				$(".elementSelected").removeClass("elementSelected");
				$(".selectable").each(function(index){
					if($(this).css("z-index")>0){
						$(this).css("z-index",$(this).css("z-index") -1);
					}
				});
				$(element).css("z-index",$(element).css("z-index")+10);
				element.addClass("elementSelected");
			});
		}
	}
});


var offset_data;
function drag_start(event) {
	var style = window.getComputedStyle(event.target, null);
	offset_data = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY);
	event.dataTransfer.setData("text/plain",offset_data);
	curDrag = event.target;
} 
function drag_over(event) { 
	var offset;
	try {
		offset = event.dataTransfer.getData("text/plain").split(',');
	} 
	catch(e) {
		offset = offset_data.split(',');
	}
	if(!(curDrag.parentNode.id=="canvas" && ((event.clientX + parseInt(offset[0],10))>=0 || (event.clientY + parseInt(offset[1],10))>0))){
		curDrag.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
		curDrag.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
		console.log(curDrag.style.top+" "+curDrag.style.left);
	}
	event.preventDefault(); 
	return false; 
} 
function drop(event) { 
	var offset;
	try {
		offset = event.dataTransfer.getData("text/plain").split(',');
	} 
	catch(e) {
		offset = offset_data.split(',');
	}
	var prevDrag;
	var left = (event.clientX + parseInt(offset[0],10)) - document.getElementById("canvas").style.left;
	var top = (event.clientY + parseInt(offset[1],10)) - document.getElementById("canvas").style.top;
	if(curDrag.parentNode.id!="canvas"){
		prevDrag = curDrag;
		curDrag = curDrag.cloneNode(false);
		prevDrag.style.left = prevDrag.getBoundingClientRect().left;
		prevDrag.style.top = prevDrag.getBoundingClientRect().top;
		document.getElementById("canvas").appendChild(curDrag);
		curDrag.style.position = "absolute";
		$(curDrag).html($(prevDrag).html());
		if($(curDrag).hasClass("transform")){
			$(curDrag).html(moreThanMeetsTheEye($(curDrag).attr("cval")));
		}
		left = (event.clientX + parseInt(offset[0],10))-310;
		top = (event.clientY + parseInt(offset[1],10));
	}
	if(!contains(curDrag.className, "selectable")){
		curDrag.className = curDrag.className+" selectable";
		$(curDrag).bind("mousedown", function(){
			$(".elementSelected").removeClass("elementSelected");
			$(this).addClass("elementSelected");
			$("#widthMod").val($(this).css("width"));
			$("#htmlMod").val($(this).html());
			$("#fontColorMod").val($(this).css("color"))
			$("#textMod").val($(this).css("font-size"));
			$("#heightMod").val($(this).css("height"));
			$("#depthMod").val($(this).css("z-index"));
			$("#colorMod").val($(this).css("background-color"));
		});
	}
	curDrag.style.left = (left>=0 ? left : 0) + 'px';
	curDrag.style.top = (top>=0 ? top : 0) + 'px';
	curDrag=undefined;
	offset_data=undefined;
	event.preventDefault();
	log();
	return false;
}

function addLocal(){
	var message = "<div id='blocker'>"+
			"<h2>Choose Your Video File</h2>"+
			"<!-- use: videos/movie.ogg -->"+
			"<input type='text' placeholder='filePath?' id='filePathInput'><br><br>"+
			"<button onclick='$.unblockUI();'>Cancel</button>"+
			"<button onclick=\"submitLocal($('#filePathInput').val());\">Submit</button>"+
			"</div>";
	$.blockUI({message: message});
}

function submitLocal(path){
	console.log(path);
	$.unblockUI();
	var div = document.createElement('div');
	div.innerHTML = "<video controls><source src='"+path.replace(" ", "\\ ")+"' type='video/ogg'>No Video</video>";
	div.className = 'dragon selectable';
	div.draggable='true';
	$(div).attr('ondragstart','drag_start(event)');
	div.style.position = 'absolute';
	div.style.padding = 20;
	document.getElementById('canvas').appendChild(div);
	$(div).bind("mousedown", function(){
		$(".elementSelected").removeClass("elementSelected");
		$(this).addClass("elementSelected");
		$("#htmlMod").val($(this).html());
		$("#fontColorMod").val($(this).css("color"))
		$("#textMod").val($(this).css("font-size"));
		$("#widthMod").val($(this).css("width"));
		$("#heightMod").val($(this).css("height"));
		$("#depthMod").val($(this).css("z-index"));
		$("#colorMod").val($(this).css("background-color"));
	});
	log();
}

function getDatTweet(id){
	$.get("https://api.twitter.com/1/statuses/oembed.json?id="+id,
	{},
	function(data){
		if(data.html){
			var div = document.createElement('div');
			div.innerHTML = data.html;
			div.className = 'dragon selectable';
			div.draggable='true';
			$(div).attr('ondragstart','drag_start(event)');
			div.style.position = 'absolute';
			document.getElementById('canvas').appendChild(div);
			$(div).bind("mousedown", function(){
				$(".elementSelected").removeClass("elementSelected");
				$(this).addClass("elementSelected");
				$("#htmlMod").val($(this).html());
				$("#fontColorMod").val($(this).css("color"))
				$("#textMod").val($(this).css("font-size"));
				$("#widthMod").val($(this).css("width"));
				$("#heightMod").val($(this).css("height"));
				$("#depthMod").val($(this).css("z-index"));
				$("#colorMod").val($(this).css("background-color"));
			});
			log();
		}
	});
}

function moreThanMeetsTheEye(type, extra){
	switch(type) {
	case "twitter":
	return "<a class=\"twitter-timeline\" href=\"https://twitter.com/twitter\" data-widget-id=\"484017786205650945\">Tweets by @twitter</a>"+
	"<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>";
	default:
		return "";
	}
}

function animateIt(){
	var message = "<div id='blocker'>"+
			"<h3>Animation Station</h3>"+
			"<ul>"+
			"<li><label>Change in X pos: </label><input id='xchange' type='number'></li>"+
			"<li><label>Change in Y pos: </label><input id='ychange' type='number'></li>"+
			"<li><label>Change in x scale: </label><input id='xschange' type='number'></li>"+
			"<li><label>Change in Y scale: </label><input id='yschange' type='number'></li>"+
			"<li><label>Change in rotation: </label><input id='rotationchange' type='number'></li>"+
			"<li><label>Change in alpha: </label><input id='alphachange' type='number'></li>"+
			"<li><label>Animation Time(sec): </label><input id='changeTime' value='3' type='number'></li>"+
			"<li><label>Start Delay(sec): </label><input id='delayTime' value='0' type='number'></li>"+
			"<li><label>Ease Type: </label><select id='easeSelect'>"+
			"<option value='Regular'>Regular</option>"+
			"<option value='Back'>Back</option>"+
			"<option value='Circ'>Circ</option>"+
			"<option value='Cubic'>Cubic</option>"+
			"<option value='Bounce'>Bounce</option>"+
			"<option value='Elastic'>Elastic</option>"+
			"<option value='Expo'>Expo</option>"+
			"<option value='Quad'>Quad</option>"+
			"<option value='Quart'>Quart</option>"+
			"<option value='Quint'>Quint</option>"+
			"<option value='Sine'>Sine</option>"+
			"</select></li>"+
			"<li><label>Ease direction: </label><select id='easeDSelect'>"+
			"<option value='easeOut'>Ease Out</option>"+
			"<option value='easeIn'>Ease In</option>"+
			"<option value='easeInOut'>Ease In Out</option>"+
			"</select></li>"+
			"</ul>"+
			"<button onclick='$.unblockUI();'>Cancel</button>"+
			"<button onclick='submitAnimation()'>Submit</button>"+
			"</div>";

	$.blockUI({
		message: message,
		css: {backgroundColor: '#19a1a1'}
	});
}

function submitAnimation(){
	var xchange = $("#xchange").val();
	var ychange = $("#ychange").val();
	var xschange = $("#xschange").val();
	var yschange = $("#yschange").val();
	var rotationchange = $("#rotationchange").val();
	var alphachange = $("#alphachange").val();
	var time;
	var delay;
	try{
		delay = parseInt($("#delayChange").val());
		time = parseInt($("#timeChange").val());
	}
	catch(e){
	}
	console.log(delay);
	var element = $(".elementSelected").get(0);
	var ease = getEase($("#easeSelect").val(), $("#easeDSelect").val());
	
	if(!animations[element]){
		animations[element] = {};
	}
	if(!time || time<0){
		time = 3;
	}
	if(!delay){
		delay = 0;
	}
	if(xchange!=""){
		animations[element].xpos = function(element){
			var left = (parseInt(element.style.left)+parseInt(xchange));
			TweenLite.to(element, time, {left: left+"px", delay: delay, ease:ease,onComplete: function(){}});
		}
	}
	if(ychange!=""){
		animations[element].ypos = function(element){
			var top = (parseInt(element.style.top)+parseInt(ychange));
			TweenLite.to(element, time, {top: top+"px", delay: delay, ease:ease,onComplete: function(){}});
		}
	}
	if(xschange!=""){
		animations[element].xscale = function(element){
			TweenLite.to(element, time, {scaleX: xschange, delay: delay, ease:ease,onComplete: function(){}});
		}
	}
	if(yschange!=""){
		animations[element].yscale = function(element){
			TweenLite.to(element, time, {scaleY: yschange, delay: delay, ease:ease,onComplete: function(){}});
		}
	}
	if(rotationchange!=""){
		animations[element].rotate = function(element){
			TweenLite.to(element, time, {rotation: rotationchange, delay: delay, ease:ease,onComplete: function(){}});
		}
	}
	if(alphachange!=""){
		animations[element].alpha = function(element){
			TweenLite.to(element, time, {alpha: alphachange, delay: delay, ease:ease,onComplete: function(){}});
		}
	}
	$.unblockUI();
}

function launchAnimations(){
	for(var i=0; i<$(".selectable").length; i++){
		var element = $(".selectable").get(i);
		for(var key in animations[element]){
			if(animations[element].hasOwnProperty(key)){
				animations[element][key].call(animations[element],element);
			}
		}
	}
}

function getEase(type,dir){
	var ease;
	switch(type){
	case "Bounce":
		ease = Bounce;
		break;
	case "Back":
		ease = Back;
		break;
	case "Circ":
		ease = Circ;
		break;
	case "Cubic":
		ease = Cubic;
		break;
	case "Elastic":
		ease = Elastic;
		break;
	case "Expo":
		ease = Expo;
		break;
	case "Quad":
		ease = Quad;
		break;
	case "Quart":
		ease = Quart;
		break;
	case "Quint":
		ease = Quint;
		break;
	case "Sine":
		ease = Sine;
		break;
	default:
		ease = Regular;
		break;
	}
	switch(dir){
	case "easeOut":
		ease = ease.easeOut;
		break;
	case "easeIn":
		ease = ease.easeIn;
		break;
	default:
		ease = ease.easeInOut;
	}
	return ease;
}

function contains(obj1, obj2){
	return obj1.indexOf(obj2)>-1;
}

var animations = {};
var curDrag;
var longest = 0;
var replace;

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
	$.blockUI({message: message, css: {top: '20%', backgroundColor: '#19a1a1'}});
}

function submitLocal(path){
	console.log(path);
	$.unblockUI();
	var div = document.createElement('div');
	div.innerHTML = "<video controls>"+
	"<source src='"+path.replace(" ", "\\ ")+"' type='video/ogg'>"+
	"<source src='"+path.replace(" ", "\\ ")+"' type='video/mp4'>"+
	"<source src='"+path.replace(" ", "\\ ")+"' type='video/webm'>"+
	"No Video</video>";
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


/**
 * Retrieves Specified tweet by id
 * then places it on the canvas
 * (doesn't work with twitter incorporating corps, which they don't...)
 */
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
			"<li><label>Delay Start(sec): </label><input id='delayTime' value='0' type='number'></li>"+
			"<li><label>Animation Type: </label><select id='easeSelect'>"+
			"<option value='Power0'>Power 0</option>"+
			"<option value='Power1'>Power 1</option>"+
			"<option value='Power2'>Power 2</option>"+
			"<option value='Power3'>Power 3</option>"+
			"<option value='Power4'>Power 4</option>"+
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
			"<li><label>Ease Type: </label><select id='easeDSelect'>"+
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
		css: {top: '20%', backgroundColor: '#19a1a1'}
	});
}

function editAnimation(key,index){
	$(".elementSelected").removeClass("elementSelected");
	$(".selectable").get(key).className+=" elementSelected";
	replace = [key, index];
	animateIt();
	var anime = animations[key][index];
	if(anime.xpos){
		$("#xchange").val(anime.xpos.val);
	}
	if(anime.ypos){
		$("#ychange").val(anime.ypos.val);
	}
	if(anime.xscale){
		$("#xschange").val(anime.xscale.val);
	}
	if(anime.yscale){
		$("#yschange").val(anime.yscale.val);
	}
	if(anime.rotate){
		$("#rotationchange").val(anime.rotate.val);
	}
	if(anime.alpha){
		$("#alphachange").val(anime.alpha.val);
	}
	var time;
	var delay;
	var ease;
	for(var key2 in anime){
		time = anime[key2].time;
		delay = anime[key2].delay;
		ease = anime[key2].ease;
	}
	$("#delayTime").val(delay);
	$("#changeTime").val(time);
	$("#easeSelect").val(ease[0]);
	$("#easeDSelect").val(ease[1]);
}

function submitAnimation(){
	if(replace){
		var datAniNew = [];
		for(var i=0; i<animations[replace[0]].length; i++){
			if(i!=replace[1]){
				datAniNew += animations[replace[0]][i];
			}
		}
		animations[replace[0]] = datAniNew;
		delete replace;
	}
	var xchange = $("#xchange").val();
	var ychange = $("#ychange").val();
	var xschange = $("#xschange").val();
	var yschange = $("#yschange").val();
	var rotationchange = $("#rotationchange").val();
	var alphachange = $("#alphachange").val();
	var time;
	var delay;
	var newVal = {};
	try{
		delay = parseInt($("#delayTime").val());
		time = parseInt($("#changeTime").val());
	}
	catch(e){
	}
	console.log(time);
	var position = $(".selectable").get().indexOf($(".elementSelected").get(0));
	var ease = [$("#easeSelect").val(), $("#easeDSelect").val()];
	
	if(!animations[position]){
		animations[position] = [];
	}
	if(!time || time<0){
		time = 3;
	}
	if(!delay){
		delay = 0;
	}
	if(xchange!=""){
		newVal.xpos = {position: position,val: parseInt(xchange),time: time,delay: delay, ease: ease};
	}
	if(ychange!=""){
		newVal.ypos = {position: position,val: parseInt(ychange),time: time,delay: delay, ease: ease};
	}
	if(xschange!=""){
		newVal.xscale = {position: position,val: parseInt(xschange),time: time,delay: delay, ease: ease};
	}
	if(yschange!=""){
		newVal.yscale = {position: position,val: parseInt(yschange),time: time,delay: delay, ease: ease};
	}
	if(rotationchange!=""){
		newVal.rotate = {position: position,val: parseInt(rotationchange),time: time,delay: delay, ease: ease};
	}
	if(alphachange!=""){
		newVal.alpha = {position: position,val: parseInt(alphachange),time: time,delay: delay, ease: ease};
	}
	animations[position].push(newVal);
	$.unblockUI();
	log();
	updateTimeline();
}

function launchAnimations(){
	if(timeline.progress()!=1){
		timeline.play();
	}
	else{
		timeline.restart();
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
	case "Power0":
		ease = Power0;
		break;
	case "Power1":
		ease = Power1;
		break;
	case "Power2":
		ease = Power2;
		break;
	case "Power3":
		ease = Power3;
		break;
	case "Power4":
		ease = Power4;
		break;
	default:
		ease = Power0;
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

function makeButtonMenu(){	
	var message = "<div id='blocker'>"+
			"<h2>Let's Make A Button</h2>"+
			"<ul>"+
			"<label>Label: </label><input type='text' placeholder='text?' id='labelInput'></li><br>"+
			"<label>Link: </label><input type='text' placeholder='url?' id='linkInput'></li>"+
			"<li><label>Color: </label><input id='buttonColorPicker' type='color'></li>"+
			"<li><label>Hover Color: </label><input id='buttonHColorPicker' type='color'></li>"+
			"<li><label>Text Color: </label><input id='buttonTColorPicker' type='color'></li>"+
			"<li><label>Border Color: </label><input id='buttonBColorPicker' type='color'></li>"+
			"</ul>"+
			"<button onclick='$.unblockUI();'>Cancel</button>"+
			"<button onclick=\"submitButton();\">Submit</button>"+
			"</div>";
	$.blockUI({message: message, css: {top: '20%', backgroundColor: '#19a1a1'}});
}

function submitButton(){
	var text = $("#labelInput").val();
	var link = $("#linkInput").val();
	var backgroundColor = $("#buttonColorPicker").val();
	var hoverColor = $("#buttonHColorPicker").val();
	var textColor = $("#buttonTColorPicker").val();
	var borderColor = $("#buttonBColorPicker").val();
	var e = document.createElement('a');
	e.innerHTML = text;
	$(e).css({
		backgroundColor: backgroundColor,
		color: textColor,
		borderColor: borderColor
	});
	e.className = "dragon selectable userButton";
	$(e).attr({
		href: link,
		onmouseover: "$(this).css(\"backgroundColor\", \""+hoverColor+"\")",
		onmouseleave: "$(this).css(\"backgroundColor\", \""+backgroundColor+"\")"
	});
	e.draggable='true';
	$(e).attr('ondragstart','drag_start(event)');
	e.style.position = 'absolute';
	document.getElementById('canvas').appendChild(e);
	$(e).bind("mousedown", function(){
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
	$.unblockUI();
	log();
}

function updateTimeline(){
	timeline.clear();
	for(var i=0; i<$(".selectable").length; i++){
		if(animations[i]){
			for(var j = 0; j<animations[i].length; j++){
				for(var key in animations[i][j]){
					if(animations[i][j].hasOwnProperty(key)){
						var temp = animations[i][j][key];
						if(temp.time+temp.delay>longest){
							longest = temp.time+temp.delay;
						}
						aniFuncts[key].call(aniFuncts[key],temp.position,temp.val,temp.time,temp.delay,getEase(temp.ease[0], temp.ease[1]));
					}
				}
			}
		}
	}
	timeline.pause(0);
	$("#slider").css("width", longest*10);
}

var aniFuncts = {
	xpos: function(position, xchange, time, delay, ease){
		var element = $(".selectable").get(position);
		var left = (parseInt(element.style.left)+xchange);
		timeline.add(TweenLite.to(element, time, {left: left+"px", delay: delay, ease:ease,onComplete: function(){}}), "PlatinumDisco");
	},

	ypos: function(position, ychange, time, delay, ease){
		var element = $(".selectable").get(position);
		var top = (parseInt(element.style.top)+ychange);
		timeline.add(TweenLite.to(element, time, {top: top+"px", delay: delay, ease:ease,onComplete: function(){}}), "PlatinumDisco");
	},
	xscale: function(position, xschange, time, delay, ease){
			var element = $(".selectable").get(position);
			timeline.add(TweenLite.to(element, time, {scaleX: xschange, delay: delay, ease:ease,onComplete: function(){}}), "PlatinumDisco");
	},
	yscale: function(position, yschange, time, delay, ease){
			var element = $(".selectable").get(position);
			timeline.add(TweenLite.to(element, time, {scaleY: yschange, delay: delay, ease:ease,onComplete: function(){}}), "PlatinumDisco");
	},
	rotate: function(position, rotationchange, time, delay, ease){
			var element = $(".selectable").get(position);
			timeline.add(TweenLite.to(element, time, {rotation: rotationchange, delay: delay, ease:ease,onComplete: function(){}}), "PlatinumDisco");
	},
	alpha: function(position, alphachange, time, delay, ease){
			var element = $(".selectable").get(position);
			timeline.add(TweenLite.to(element, time, {alpha: alphachange, delay: delay, ease:ease,onComplete: function(){}}), "PlatinumDisco");
		}
}

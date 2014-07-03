var timeline = new TimelineLite({});
var toggler = true;
$(document).ready(function() {
		$(".tab").click(function(){
			if($(".tab b").html()=="&lt;&lt;"){
				$("#animationDrawer").animate({right: 0}, 750);
				$(".tab b").html(">>");
			}
			else{
				$("#animationDrawer").animate({right: -1400}, 750);
				$(".tab b").html("<<");
			}
		});
		$('h3').click(function() {
			$(this).siblings('ul').toggleClass('visible');
			$("#menu .dragon").each(function(index){
				$(this).css("top", $(this).get(0).getBoundingClientRect().top);
				$(this).css("left", $(this).get(0).getBoundingClientRect().left);
			});
		});
		setEditMenu();
		$(document).keydown(function(e) {
    		if(e.which==46) {
				animations[$(".selectable").get().indexOf($(".elementSelected").get(0))] = undefined;
    			$('.elementSelected').remove();
			log();
    		}
		});
		$('#push').click(function() {
			if($(".input-value").val()==""){
				return;
			}
			var textEl = document.createElement('div');
			textEl.className = 'dragon selectable';
			textEl.draggable='true';
			$(textEl).attr('ondragstart','drag_start(event)');
			textEl.style.position = 'absolute';
			textEl.innerHTML = $('.input-value').val();
			document.getElementById('canvas').appendChild(textEl);
			$(textEl).bind("mousedown", function(){
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
			$("#textMenu input").val("");
		});
		$('#addVideo').click(function() {
			//if($('.video-value').val().toLowerCase().indexOf("youtube")>=0) {
				var videoURL = $('.video-value').val();//.split('=');			
				var video = document.createElement('video');
				video.className = 'dragon selectable';
				video.draggable='true';
				$(video).attr('ondragstart','drag_start(event)');
				$(video).attr({'autoplay':'true'});	
				video.style.position = 'absolute';
				video.style.display = 'block';
				video.id = 'vidLoaded';
				video.src =videoURL;
				document.getElementById('canvas').appendChild(video);
				$('.video-value').val("");
		});
		$('#clearLocalStorage').click(function() {
			localStorage.clear();
		});
		readIn();
	});

function setEditMenu(){
	$("#widthMod").attr("oninput","fire('width', $('#widthMod').val())");
	$("#heightMod").attr("oninput","fire('height', $('#heightMod').val())");
	$("#depthMod").attr("oninput","fire('z-index', $('#depthMod').val())");
	$("#colorMod").attr("oninput","fire('background-color', $('#colorMod').val())");
	$("#rotateMod").attr("oninput","fire('rotate', $('#rotateMod').val())");
	$("#fontColorMod").attr("oninput", "fire('color', $('#fontColorMod').val())");
	$("#textMod").attr("oninput", "fire('font-size', $('#textMod').val())");
	$("#htmlMod").attr("oninput", "fire('html', $('#htmlMod').val())");
}


function fire(css, val){
	if(css=="rotate"){
		$(".elementSelected").jqrotate(parseInt(val));
		if($(".elementSelected iframe").length>0){
			$(".elementSelected iframe").jqrotate(parseInt(val));
		}
	}
	else if(css=="html"){
		$(".elementSelected").html(val);
		if($(".elementSelected iframe").length>0){
			$(".elementSelected iframe").html(val);
		}
	}
	else{
		$(".elementSelected").css(css, val);
		if($(".elementSelected iframe").length>0){
			$(".elementSelected iframe").css(css, val);
		}
	}
	if($(".elementSelected video").length>0 && (css=="width" || css=="height")){
			$(".elementSelected video").attr(css, val);
	}
	log();
}

function mkLog(styl, clas, tg, source, html, href, over, leave){
	return {
	style: styl, 
	class: clas, 
	tag: tg, 
	src: source, 
	inner: html,
	href: href,
	over: over,
	leave: leave
	}
}

function log(){
	var save = [];
	$(".selectable").each(function(){
		save[save.length] = mkLog(
		$(this).attr("style"),
		$(this).attr("class"),
		$(this).get(0).tagName,
		$(this).attr("src"),
		$(this).get(0).innerHTML,
		$(this).attr("href"),
		$(this).attr("onmouseover"),
		$(this).attr("onmouseleave")
		);
	});
	window.localStorage.work = JSON.stringify(save);
	window.localStorage.anime = JSON.stringify(animations);
	updateTimelineVisual();
}

function readIn(){
	if(window.localStorage.work){
		if(window.localStorage.anime){
			animations = JSON.parse(window.localStorage.anime);
		}
		var save = JSON.parse(window.localStorage.work);
		var cur;
		for(var i=0; i<save.length; i++){
			cur = save[i];
			$("#canvas").append("<"+cur.tag+" class='"+cur.class+"' style='"+cur.style+"' href='"+cur.href+"' onmouseover='"+cur.over+"' onmouseleave='"+cur.leave+"' src='"+cur.src+"' draggable='true' ondragstart='drag_start(event)'>"+cur.inner+"</"+cur.tag+">");
		}
		$(".selectable").each(function(index){
			$(this).bind("mousedown", function(){
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
		});
		$(".elementSelected").removeClass("elementSelected");
		updateTimelineVisual();
	}
}

function flipIt(){
	$('.elementSelected').toggleClass('flipped');
	log();
}

function activateTween() {    
 	var prompt = "<div id='tweenOptions'><ul>"+
 				"<li><label>Width: </label><input type='number' id='widthChange' value='0' /></li>"+
 				"<li><label>Height: </label><input type='number' id='heightChange' value='0' /></li>"+
 				"<li><label>left: </label><input type='number' id='xChange' value='0' /></li>"+
 				"<li><label>top: </label><input type='number' id='yChange' value='0' /></li>"+
 				"<li><label>Animation Time: </label><input type='number' id='animationTime' value='1' /></li>"+
				"<li><label>Animation Type</label>"+
				"<select id='animationType'>"+
					"<option value='-'>Choose an option</option>"+
					"<option value='Power0'>Power 0</option>"+
					"<option value='Power1'>Power 1</option>"+
					"<option value='Power2'>Power 2</option>"+
					"<option value='Power3'>Power 3</option>"+
					"<option value='Power4'>Power 4</option>"+
					"<option value='Quad'>Quad</option>"+
					"<option value='Cubic'>Cubic</option>"+
					"<option value='Quart'>Quart</option>"+
					"<option value='Quint'>Quint</option>"+
					"<option value='Strong'>Strong</option>"+
					"<option value='Back'>Back</option>"+
					"<option value='Circ'>Circ</option>"+
					"<option value='Bounce'>Bounce</option>"+
					"<option value='Elastic'>Elastic</option>"+
					"<option value='Expo'>Expo</option>"+
					"<option value='Sine'>Sine</option>"+
				"</select></li>"+
				"<li><label>Ease Type</label>"+
				"<select id='easeSelect'>"+
					"<option value='-'>Choose an option</option>"+
					"<option value='easeIn'>ease In</option>"+
					"<option value='easeInOut'>ease InOut</option>"+
					"<option value='easeOut'>ease Out</option>"+
				"</select></li>"+
				"<li><label>Animation Delay: </label><input type='number' id='animationDelay' value='0' /></li>"+
				"<li><label>Repeat: </label><input type='checkbox' class='repeat' value='repeat' /></li></ul>"+
				"<button onclick='$.unblockUI();'>Cancel</button>"+
				"<button onclick='startAnimation();'>Submit</button>"+
				"</div>";

				$.blockUI({
					message: prompt,
					css: {backgroundColor: '#19a1a1'}
				});
					var width = $('.elementSelected').width();
				$('#widthChange').val(width);
	}

function startAnimation() {
	
		var image = document.getElementsByClassName('elementSelected');
		var time = parseInt($('#animationTime').val());
		if(isNaN(time) == true || time < 0) {time = 1;};
		
		var properties = returnProperties();
		
		var tween = TweenLite.to(image, time, properties);
		if ($('input.repeat').is(':checked')) {
			window.setInterval(function() {
				tween.restart();
			},2000);
		}
	$.unblockUI();
}

function returnProperties() {
	var easeType = $('#easeSelect').val();
	var animationType = $('#animationType').val();
	var delay = parseInt($('#animationDelay').val());
	var width = parseInt($('#widthChange').val());
	var height = parseInt($('#heightChange').val());
	var y = parseInt($('#yChange').val());
	var x = parseInt($('#xChange').val());

	var properties =  {delay:delay,ease:getEase(animationType, easeType),height:height,width:width, left:x, top:y};
	
	return properties;
}


function unAnimateIt(){
	var e = $(".elementSelected").get(0);
	animations[e] = undefined;
	log();
}


function updateTimelineVisual(){
	var newContent = "<div class='table'><div id=\"line\"><div></div></div>";
	for(var key in animations){
		if(animations.hasOwnProperty(key)){
			newContent+="<div class='tr'>"
			for(var i=0; i<animations[key].length; i++){
				var temp;
				for(var key2 in animations[key][i]){
					temp = {
					start: animations[key][i][key2].delay*10,
					dur: animations[key][i][key2].time*10
					};
					break;
				}
				newContent+="<div class='td' style='left: "+(11+temp.start)+"px; width: "+temp.dur+"px'></div>";
			}
			newContent+="</div>";
		}
	}
	newContent+="</div>";
	$("#timeline").html(newContent);
}

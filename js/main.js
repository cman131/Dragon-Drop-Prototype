$(document).ready(function() {
		$('h3').click(function() {
			$(this).siblings('ul').toggleClass('visible');
			$("#menu .dragon").each(function(index){
				$(this).css("top", $(this).get(0).getBoundingClientRect().top);
				$(this).css("left", $(this).get(0).getBoundingClientRect().left);
			});
		});
		setEditMenu();
		$(function() {
			$('.draggable').draggable();
		});
		$(document).keydown(function(e) {
    		if(e.which==46) {
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
			var videoURL = $('.video-value').val().split('=');
			var video = '<div class="dragon selectable containerVideo" ondragstart="drag_start(event)" style="position:absolute;" draggable="true"><embed width="99%" height="99%" class="dragon selectable" ondragstart="drag_start(event)" draggable="true" style="position: absolute;" src="http://www.youtube.com/v/' + videoURL[1] + '" type="application/x-shockwave-flash"></div>';
			document.getElementById('canvas').insertAdjacentHTML('beforeend',video);
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
	}
	else if(css=="html"){
		$(".elementSelected").html(val);
	}
	else{
		$(".elementSelected").css(css, val);
	}
	log();
}

function mkLog(styl, clas, tg, source, html){
	return {
	style: styl, 
	class: clas, 
	tag: tg, 
	src: source, 
	inner: html
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
		$(this).get(0).innerHTML
		);
	});
	window.localStorage.work = JSON.stringify(save);
}

function readIn(){
	if(window.localStorage.work){
		var save = JSON.parse(window.localStorage.work);
		var cur;
		for(var i=0; i<save.length; i++){
			cur = save[i];
			$("#canvas").append("<"+cur.tag+" class='"+cur.class+"' style='"+cur.style+"' src='"+cur.src+"' draggable='true' ondragstart='drag_start(event)'>"+cur.inner+"</"+cur.tag+">");
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
	}
}

function flipIt(){
	$('.elementSelected').toggleClass('flipped');
	log();
}


$(document).ready(function() {
		$('h3').click(function() {
			$(this).siblings('ul').toggleClass('visible');
			$("#menu .dragon").each(function(index){
				$(this).css("top", $(this).get(0).getBoundingClientRect().top);
				console.log($(this).attr("class")+" "+$(this).get(0).getBoundingClientRect().top);
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
    		}
		});
		$('#push').click(function() {
			var value = $('.input-value').val();
			if(value != '') {
				$('#canvas').append("<div class='dragon' draggable='true' ondragstart='drag_start(event)' style='position:absolute;'>" + $('.input-value').val()+ "</div>");
			}
		});
		readIn();
	});

function setEditMenu(){
	$("#widthMod").attr("oninput","fire('width', $('#widthMod').val())");
	$("#heightMod").attr("oninput","fire('height', $('#heightMod').val())");
	$("#colorMod").attr("oninput","fire('background-color', $('#colorMod').val())");
	$("#rotateMod").attr("oninput","fire('rotate', $('#rotateMod').val())");
	$("#fontColorMod").attr("oninput","fire('color', $('#fontColorMod').val())");
	$("#textMod").attr("oninput","fire('font-size', $('#textMod').val())");
}

function fire(css, val){
	console.log(css+" "+(css=="rotate"));
	if(css=="rotate"){
		$(".elementSelected").jqrotate(parseInt(val));
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
				$("#heightMod").val($(this).css("height"));
				$("#depthMod").val($(this).css("z-index"));
				$("#colorMod").val($(this).css("background-color"));
			});
		});
	}
}

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
}

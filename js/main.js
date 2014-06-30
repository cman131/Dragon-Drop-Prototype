$(document).ready(function() {
		$('h3').click(function() {
			$(this).siblings('ul').toggleClass('visible');
			$("#menu .dragon").each(function(index){
				$(this).css("top", $(this).get(0).getBoundingClientRect().top);
				console.log($(this).attr("class")+" "+$(this).get(0).getBoundingClientRect().top);
				$(this).css("left", $(this).get(0).getBoundingClientRect().left);
			});
		});
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
		$('.color-value').keyup(function(){
			var color = $(this).val();
			if ($(this).val().length > 0) {
				$('.elementSelected').css("color", color);
			}
			else{
				$('.elementSelected').css("color", "black");	
			}	
		});
		$('.fontsize-value').keyup(function(){
			var fontsize = $(this).val();
			if ($(this).val().length > 0) {
				$('.elementSelected').css("font-size", fontsize);
			}
			else{
				$('.elementSelected').css("font-size", "12");	
			}	
		});
	});
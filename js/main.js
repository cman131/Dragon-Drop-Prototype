// The timeline object for animations
var timeline = new TimelineLite({onUpdate: function(){
	$("#slider").slider({value: timeline.progress()*1000});
}});

// A collection of functions run when the document is loaded
$(document).ready(function() {
	var drawerWidth = parseInt($("#animationDrawer").css("width"));
	$("#animationDrawer").animate({right: -(drawerWidth-25)}, 750);
	$("#timeline").css("width", drawerWidth-46);
		$("#slider").slider({
            value: 0,
			range: "min",
            min: 0,
            max: 1000,
            step: 1,
            slide: function( event, ui ) {
	    	timeline.pause();
                timeline.progress( ui.value/1000 );
            }
		});
		$(".tab").hover(function(){
			if($(".tab b").html()=="&lt;&lt;"){
				$("#animationDrawer").css("right", -(drawerWidth-27));
			}
		},function(){
			if($(".tab b").html()=="&lt;&lt;"){
				$("#animationDrawer").css("right", -(drawerWidth-25));
			}
		});
		$(".tab").click(function(){
			if($(".tab b").html()=="&lt;&lt;"){
				$("#animationDrawer").animate({right: 0}, 750);
				$(".tab b").html(">>");
			}
			else{
				$("#animationDrawer").animate({right: -(drawerWidth-25)}, 750);
				$(".tab b").html("<<");
			}
		});
		$('h3').click(function() {
			if(!$(this).hasClass("disabled")){
				$(this).siblings('ul').toggleClass('visible');
				$("#menu .dragon").each(function(index){
					$(this).css("top", $(this).get(0).getBoundingClientRect().top);
					$(this).css("left", $(this).get(0).getBoundingClientRect().left);
				});
			}
		});
		setEditMenu();
		$(document).keydown(function(e) {
    		if(e.which==46) {
				deleteAnimation($(".selectable").get().indexOf($(".elementSelected").get(0)));
    			$('.elementSelected').remove();
			updateTimeline();
			updateTimelineVisual();
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
			var rot = document.createElement('div');
			rot.innerHTML = "&nbsp;";
			rot.className = "target";
			textEl.appendChild(rot);
			document.getElementById('canvas').appendChild(textEl);
			bindSelectable(textEL);
			$("#textMenu input").val("");
			log();
		});
		$('#addVideo').click(function() {
				var videoURL = $('.video-value').val();
				var video = document.createElement('video');
				video.className = 'dragon selectable';
				video.draggable='true';
				$(video).attr('ondragstart','drag_start(event)');
				$(video).prop("autoplay",true); 
				$(video).prop("controls",true); 
				video.style.position = 'absolute';
				video.style.display = 'block';
				video.id = 'vidLoaded';
				video.src = videoURL;
				document.getElementById('canvas').appendChild(video);
				$('.video-value').val("");
				log();
		});
		$('#clearLocalStorage').click(function() {
			localStorage.clear();
		});
		//new Propeller($('.elementSelected'), {inertia: 1});
		
		$("div")
			.mouseup(function() {
				$(".dragon").on("click", addRotation);
			}) 
			.mousedown(function() {
				$('.dragon').off("click", addRotation);
			})
		readIn();
});

// A collection of functions to be run whenever the window is resized
$(window).resize(function(){
	var drawerWidth = parseInt($("#animationDrawer").css("width"));
	$("#animationDrawer").animate({right: -(drawerWidth-25)}, 750);
	$("#timeline").css("width", drawerWidth-46);
	$(".tab").unbind();
	$(".tab b").html("<<");
	$(".tab").hover(function(){
		if($(".tab b").html()=="&lt;&lt;"){
			$("#animationDrawer").css("right", -(drawerWidth-27));
		}
	},function(){
		if($(".tab b").html()=="&lt;&lt;"){
			$("#animationDrawer").css("right", -(drawerWidth-25));
		}
	});
	$(".tab").click(function(){
		if($(".tab b").html()=="&lt;&lt;"){
			$("#animationDrawer").animate({right: 0}, 750);
			$(".tab b").html(">>");
		}
		else{
			$("#animationDrawer").animate({right: -(drawerWidth-25)}, 750);
			$(".tab b").html("<<");
		}
	});
});	

/*
* Function to allow currently selected element to be rotated
*/
function addRotation() {
	var dragging = 0;
    var target = $('.target');
    var mainTarget = $('.elementSelected');
    var elOfs = mainTarget.offset();
    if(mainTarget.length != 0 ) { 
    	var elPos = {X: elOfs.left, Y: elOfs.top};
    	var cent  = {X: mainTarget.width()/2, Y: mainTarget.height()/2};    
    }

    target.mousedown(function() {
        dragging = true;
        
    });
    $(document).mouseup(function() {
        dragging = 0;
    }).mousemove(function(e) {     
      if(dragging && mainTarget.length != 0) {
         var mPos    = {X: e.pageX-elPos.X, Y: e.pageY-elPos.Y};
         var getAtan = Math.atan2(mPos.X-cent.X, mPos.Y-cent.Y);
         var getDeg  = -getAtan/(Math.PI/180) + 135; 
         mainTarget.css({transform: 'rotate(' + getDeg + 'deg)'});
         log();
      }
    });
}

/**
 *
 * Populates the edit menu fields with the values of the
 * currently selected element.
 *
 * @author Conor Wright
 */
function setEditMenu(){
	$("#widthMod").attr("oninput","fire('width', $('#widthMod').val())");
	$("#heightMod").attr("oninput","fire('height', $('#heightMod').val())");
	$("#depthMod").attr("oninput","fire('z-index', $('#depthMod').val())");
	$("#alphaMod").attr("oninput","fire('opacity', $('#alphaMod').val()/100)");
	$("#colorMod").attr("oninput","fire('background-color', $('#colorMod').val())");
	$("#rotateMod").attr("oninput","fire('rotate', $('#rotateMod').val())");
	$("#fontColorMod").attr("oninput", "fire('color', $('#fontColorMod').val())");
	$("#textMod").attr("oninput", "fire('font-size', $('#textMod').val())");
	$("#htmlMod").attr("oninput", "fire('html', $('#htmlMod').val())");
}

/**
 *
 * Fires new values to the currently selected element
 *
 *@param css - value to change
 *@param val - new value to change to
 * @author Conor Wright
 */
function fire(css, val){
	if(css=="rotate"){
		$(".elementSelected").rotate(parseInt(val));
	}
	else if(css=="html"){
		$(".elementSelected").html(val);
		if($(".elementSelected iframe").length>0){
			return true;
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

/**
 *
 * Creates a log object for a canvas element
 * for local storage
 *
 * @param styl - the style of the element
 * @param clas - the class list of the element
 * @param tg - the tag of the element
 * @param source - the src attribute of the element
 * @param html - the inner html of the element
 * @param href - the href attribute of the element
 * @param over - the mouseover attribute of the element
 * @param leave - the mouseleave attribute of the element
 * @return the resulting log object
 * @author Conor Wright
 */
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

/**
 *
 * logs the entirety of the canvas in a list of log
 * objects of it's elements
 *
 * @return the resulting log list
 * @author Conor Wright
 */
function logCanvas(){
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
	return save;
}

/**
 *
 * Logs the current canvas state and animations list
 * into local storage
 *
 * @author Conor Wright
 */
function log(){
	var save = logCanvas();
	window.localStorage.work = JSON.stringify(save);
	window.localStorage.anime = JSON.stringify(animations);
	updateTimelineVisual();
}

/**
 *
 * Redraws the canvas from the given source
 *
 * @param source - a JSON string representing a state
 * for the canvas
 * @author Conor Wright
 */
function rewriteCanvas(source){
		$("#canvas").empty();
		var save = JSON.parse(source);
		var cur;
		for(var i=0; i<save.length; i++){
			cur = save[i];
			$("#canvas").append("<"+cur.tag+" class='"+cur.class+"' style='"+cur.style+"' href='"+cur.href+"' onmouseover='"+cur.over+"' onmouseleave='"+cur.leave+"' src='"+cur.src+"' draggable='true' ondragstart='drag_start(event)'>"+cur.inner+"</"+cur.tag+">");
		}
		$(".selectable").each(function(index){
			bindSelectable(this);
		});
		$(".elementSelected").removeClass("elementSelected");
}

/**
 *
 * Reads in the data logged in local storage
 * and loads it.
 *
 * @author Conor Wright
 */
function readIn(){
	if(window.localStorage.work){
		if(window.localStorage.anime){
			animations = JSON.parse(window.localStorage.anime);
		}
		rewriteCanvas(window.localStorage.work);
		updateTimelineVisual();
		updateTimeline();
	}
}

/**
 *
 * Flips the currently selected element horizontally
 *
 * @author Conor Wright
 */
function flipIt(){
	$('.elementSelected').toggleClass('flipped');
	log();
}

/**
* Creates menu to input animations for currently selected element
* Animation is fired off immediately after clicking submit
*/
function activateTween() {  
 	var prompt = "<div id='tweenOptions'><ul>"+
 				"<li><label>Width: </label><input type='number' id='widthChange' value='0' /></li>"+
 				"<li><label>Height: </label><input type='number' id='heightChange' value='0' /></li>"+
 				"<li><label>Left: </label><input type='number' id='xChange' value='0' /></li>"+
 				"<li><label>Top: </label><input type='number' id='yChange' value='0' /></li>"+
 				"<li><label>Background-Color: </label><input type='text' id='bgColorChange' value='#000000' /></li>"+
 				"<li><label>Opacity: </label><input type='number' id='opacityChange' value='100' /></li>"+
 				"<li><label>Rotation: </label><input type='number' id='rotationChange' value='0' /></li>"+
 				"<li><label>Scale: </label><input type='number' id='scaleChange' value='1' /></li>"+
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


			
			$('#widthChange').val($('.elementSelected').width());
			$('#heightChange').val($('.elementSelected').height());
			$('#xChange').val($('.elementSelected').position().left);
			$('#yChange').val($('.elementSelected').position().top);
			$('#bgColorChange').val($('.elementSelected').css('background-color'));
			$('#opacityChange').val($('.elementSelected').css('opacity'));
			log();
}

/*
* Function used to fire off animation
*/
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

/*
* Function used to set the animation properties to animated
*/
function returnProperties() {
	var easeType = $('#easeSelect').val();
	var animationType = $('#animationType').val();
	var delay = parseInt($('#animationDelay').val());
	var width = parseInt($('#widthChange').val());
	var height = parseInt($('#heightChange').val());
	var y = parseInt($('#yChange').val());
	var x = parseInt($('#xChange').val());
	var backgroundColor = $('#bgColorChange').val();
	var opacity = parseInt($('#opacityChange').val());
	var rotation = $('#rotationChange').val();
	var scale = $('#scaleChange').val();

	var properties =  {delay:delay,ease:getEase(animationType,
	easeType),backgroundColor:backgroundColor,scale:scale, rotation:rotation,opacity:opacity,height:height,width:width,
	left:x, top:y};
	
	return properties;
}

// Timeline Functions

/**
 *
 * Removes all animations currently attached 
 * to currently selected element
 *
 * @author Conor Wright
 */
function unAnimateIt(){
	 deleteAnimation($(".selectable").get().indexOf($(".elementSelected").get(0)));
	updateTimeline();
	updateTimelineVisual();
	log();
}

/**
 *
 * Stops the timeline and resets it to 0 seconds
 *
 * @author Conor Wright
 */
function stop(){
	timeline.pause(0);
	$("#slider").slider({value: 0});
}

/**
 *
 * Updates the visual representation of the timeline
 * with current animations
 *
 * @author Conor Wright
 */
function updateTimelineVisual(){
	var newContent = "";
	for(var key in animations){
		if(animations.hasOwnProperty(key) && animations[key]){
			newContent+="<div class='tr' ondragover='timeline_drag_over(event);' ondrop='timeline_drop(event);'>"
			for(var i=0; i<animations[key].length; i++){
				var temp;
				for(var key2 in animations[key][i]){
					temp = {
					start: animations[key][i][key2].delay*10,
					dur: animations[key][i][key2].time*10
					};
					break;
				}
				newContent+="<div ondragstart='timeline_drag_start(event);' draggable='true' class='td' style='left: "+(11+temp.start)+"px; width: "+temp.dur+"px' onclick='editAnimation("+key+","+i+");'></div>";
			}
			newContent+="</div>";
		}
	}
	$("#timeline div.table").html(newContent);
}

/**
 *
 * Deletes the animations at specified index
 * and updates all other animation positions
 *
 * @param index - The index of the animation set to delete
 * @author Conor Wright
 */
function deleteAnimation(index){
	if(!animations[index] || index<0){
		return true;
	}
	delete animations[index];
	for(var i=index; i<$(".selectable").length; i++){
		if(animations[i]){
			animations[i-1]=animations[i];
			for(var j=0; j<animations[i-1].length; j++){
			console.log(animations[i-1][j]);
				for(var key in animations[i-1][j]){
					console.log(0);
					animations[i-1][j][key].position = i-1;
				}
			}
			delete animations[i];
		}
	}
}

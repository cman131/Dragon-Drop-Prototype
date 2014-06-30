function contains(obj1, obj2){
	return obj1.indexOf(obj2)>-1;
}

var curDrag;

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
		left = (event.clientX + parseInt(offset[0],10))-310;
		top = (event.clientY + parseInt(offset[1],10));
	}
	if(!contains(curDrag.className, "selectable")){
		curDrag.className = curDrag.className+" selectable";
		$(curDrag).bind("mousedown", function(){
			$(".elementSelected").removeClass("elementSelected");
			$(this).addClass("elementSelected");
			$("#fontColorMod").val($(this).css("color"));
			$("#textMod").val($(this).css("font-size"));
			$("#widthMod").val($(this).css("width"));
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

function setEditMenu(){
	$("#widthMod").attr("oninput","fire('width', $('#widthMod').val())");
	$("#heightMod").attr("oninput","fire('height', $('#heightMod').val())");
	$("#depthMod").attr("oninput","fire('z-index', $('#depthMod').val())");
	$("#colorMod").attr("oninput","fire('background-color', $('#colorMod').val())");
	$("#rotateMod").attr("oninput","fire('rotate', $('#rotateMod').val())");
	$("#fontColorMod").attr("oninput", "fire('color', $('#fontColorMod').val())");
	$("#textMod").attr("oninput", "fire('font-size', $('#textMod').val())");
}

function fire(css, val){
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

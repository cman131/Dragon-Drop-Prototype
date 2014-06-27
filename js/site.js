app = angular.module("app", []);

app.directive("dragon", function(){
	return {
		
	}
})

app.directive("selectable", function(){
	return {
		restrict: "C",
		link: function(scope, element, attrs){
			element.bind("mousedown", function(){
				for(i in $(".selectable")){
					$(".selectable").removeClass("elementSelected");
				}
				element.addClass("elementSelected");
			})
		}
	}
})

var offset_data;
function drag_start(event) {
	var style = window.getComputedStyle(event.target, null);
	offset_data = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY);
	event.dataTransfer.setData("text/plain",offset_data);
	event.dataTransfer.setData("me", event.target.id);
} 
function drag_over(event) { 
	var offset;
	try {
		offset = event.dataTransfer.getData("text/plain").split(',');
	} 
	catch(e) {
		offset = offset_data.split(',');
	}
	var dm = document.getElementById(event.dataTransfer.getData("me"));
	dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
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
	var dm = document.getElementById(event.dataTransfer.getData("me"));
	dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
	dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
	event.preventDefault();
	return false;
}

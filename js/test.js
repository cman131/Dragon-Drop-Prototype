/**
 *
 * The function for when a drag event starts on timeline
 * logs initial position and element
 *
 * @param event - the event object for the drag starting
 * @author Conor Wright
 */
function timeline_drag_start(event) {
	var style = window.getComputedStyle(event.target, null);
	offset_data = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY);
	event.dataTransfer.setData("text/plain",offset_data);
	event.target.className+=" moving";
} 

/**
 *
 * The function for when the dragon element is
 * dragged over the timeline. Logs positional change data while dragging
 *
 * @param event - the event object for the drag over occuring
 * @author Conor Wright
 */
function timeline_drag_over(event) { 
	if($(".moving").length<=0){
		return true;
	}
	var offset;
	try {
		offset = event.dataTransfer.getData("text/plain").split(',');
	} 
	catch(e) {
		offset = offset_data.split(',');
	}
	$(".moving").css("left", (event.clientX + parseInt(offset[0],10)) + 'px');
	event.preventDefault(); 
	return false; 
} 

function timeline_drop(event){
	if($(".moving").length<=0){
		return true;
	}
	var offset;
	try {
		offset = event.dataTransfer.getData("text/plain").split(',');
	} 
	catch(e) {
		offset = offset_data.split(',');
	}
	$(".moving").css("left", (event.clientX + parseInt(offset[0],10)));
	var key = $(".moving").attr("onclick").split(",");
	var index = parseInt(key[1]);
	key = key[0].split("(")[1];
	//for(key2 in animations[key][index]){
		//animations[key][index][key2].delay = (left-11)/10;
	//}
	//updateTimeline();
	//updateTimelineVisual();
	$(".moving").removeClass("moving");
}

// --------------------------------------------------
//
// playground.js, v0.2
// supporting script for PaintbrushJS playground demo
//
// Developed by Dave Shea, http://www.mezzoblue.com/
//
// This project lives on GitHub:
//    http://github.com/mezzoblue/PaintbrushJS
//
// Except where otherwise noted, PaintbrushJS is licensed under the MIT License:
//    http://www.opensource.org/licenses/mit-license.php
//
// --------------------------------------------------

// filter master control object
var filterControl = {
	"filters" : [ {
		"name" : "blur",
		"label" : "Gaussian Blur",
		"filterClass" : "filter-blur",
		"controlId" : "controls-blur"
	},

	{
		"name" : "edges",
		"label" : "Detect Edges",
		"filterClass" : "filter-edges",
		"controlId" : "controls-edges"
	},

	{
		"name" : "emboss",
		"label" : "Emboss",
		"filterClass" : "filter-emboss",
		"controlId" : "controls-emboss"
	},

	{
		"name" : "greyscale",
		"label" : "Greyscale",
		"filterClass" : "filter-greyscale",
		"controlId" : "controls-greyscale"
	},

	{
		"name" : "mosaic",
		"label" : "Mosaic",
		"filterClass" : "filter-mosaic",
		"controlId" : "controls-mosaic"
	},

	{
		"name" : "noise",
		"label" : "Noise",
		"filterClass" : "filter-noise",
		"controlId" : "controls-noise"
	},

	{
		"name" : "posterize",
		"label" : "Posterize",
		"filterClass" : "filter-posterize",
		"controlId" : "controls-posterize"
	},

	{
		"name" : "sepia",
		"label" : "Sepia Tone",
		"filterClass" : "filter-sepia",
		"controlId" : "controls-sepia"
	},

	{
		"name" : "sharpen",
		"label" : "Sharpen",
		"filterClass" : "filter-sharpen",
		"controlId" : "controls-sharpen"
	},
	{
		"name" : "tint",
		"label" : "Colour Tint",
		"filterClass" : "filter-tint",
		"controlId" : "controls-tint"
	}
	 ]
}

var select_index_item=0;
var fiturst=false;
// filter selection events
function loadcontrols() {
	fiturst=false;
	// get the main image
	var img = getFilterTarget();
	// get the filter chooser
	var filterSelector = getFilterSelector();

	// populate the select list with defined filters
	for ( var i = 0; i < filterControl.filters.length; i++) {

		// create the new option element
		newOption = document.createElement("option");
		newOption.text = filterControl.filters[i].label;
		newOption.value = filterControl.filters[i].name;
		
		// add it to the list
		filterSelector.appendChild(newOption);
	}
	$("#filter-selector").selectmenu('refresh', true);
	// add an event handler to swap control panels
	filterSelector.onchange = function() {
		$.mobile.loading('show',{
			text: "uploading",
			textVisible: true,
			textonly: false,
			html: "<span class='ui-bar ui-shadow ui-overlay-d ui-corner-all' style='background-color:transparent;'><div align='center'><img src='img/loader.gif' /><br/><h2 style='color:#000000; font-size:16px;text-transform:none;'>Uploading...</h2></div></span>"
			});
		removeClasses(img);
		flushDataAttributes(img);
		destroyStash(img, true);
		// adjust visible control panel
		displayControls();
		console.log("load controls");
		$.mobile.loading('hide');
		//updateFilters(img);
	}

	// initialize the control panel
	displayControls();
	$('#colorpickfirst').on("change",function(){
		var cl=this.value;
		//alert(cl);
		document.getElementById('myselectcolor').value=cl;
		updateFilters(img);
	});
}
function changefnn() {
	var img = getFilterTarget();
	updateFilters(img);

}
// add events to update the image upon various interactions
function loadimgform() {

	// get our two main interaction objects, the form and the image
	var thisForm = getInteractionForm();
	var interaction = getInteractionTarget();
	var img = getFilterTarget();

	// initial filter application
//	updateFilters(img);

	// when the form is submitted...
	

	// also add a hook for range sliders
	inputs = interaction.getElementsByTagName("input");

	for ( var i = 0; i < inputs.length; i++) {
	//	console.log("NeW AVAL>>"+inputs[i].type+"---"+inputs[i].id+"--"+inputs[i].name);
		if (inputs[i].type.toLowerCase() == "range" || inputs[i].type.toLowerCase() == "number") {
			// kills performance if we're calling it onchange.
			// but inaccessible / irrelevant to mobile if we do it onmouseup.
			// damned if we do... I'm favouring speed here, would love input.
//			inputs[i].onmouseup = function() {
//				console.log("mouse UP");
//				updateFilters(img);
//				 $('input').blur();
//			}
			$("input[name='"+inputs[i].name+"']").on('slidestop', function (e) {
			     $(this).blur();
			     updateFilters(img);
			  //   console.log('slidestop');
			});
		}
		// fallback for radio buttons, colour input
		// (and browsers that don't do range yet, hint hint Firefox)
//		if ((inputs[i].type.toLowerCase() == "text")
//				|| (inputs[i].type.toLowerCase() == "radio")) {
//			inputs[i].onchange = function() {
//				updateFilters(img);
//				 $(this).blur();
//			}
//		}
	}

}

// refresh filters after various actions have been performed
function updateFilters(img) {

	// first, does the reference object have an original image in the DOM?
	var classList = (img.className.toLowerCase()).split(' ');
	for ( var i = 0; i < classList.length; i++) {
		//console.log("IMG>>"+img.className.toLowerCase());
		// quick reference
		var currentClass = classList[i];
		
		// okay, we're good, there's an original
		if (currentClass.substr(0, 7) == "pb-ref-") {

			// clear reference object's data-pb-* attributes
			flushDataAttributes(img);

			// get the filter chooser
			var filterSelector = getFilterSelector();
			//console.log(img.src);
			videosrc=img.src;
			console.log(videosrc);
		//	$('#contentimg').attr("src", post_pic);
			//	console.log("img src>" + img.src);
			
			//alert("play>"+videosrc);
			//document.getElementById("ai1").src = img.src;
			// go fetch the original and update the reference object source
			var original = document.getElementById("pb-original-"
					+ currentClass.substr(7, currentClass.length - 7));
			placeReferenceImage(img, original.src, img);
			img.style.visibility = "hidden";
			//console.log("orgf>?" + original.src + "dsj" + original.value
			//		+ "--000--->" + original.type);
			// find the currently-selected filter
			//alert("sd>"+img.src);
			var options = filterSelector.getElementsByTagName("option");
			var obj = getCurrentControl(options);
			if (obj) {
			//	console.log("datdtanjdakljd");
				// get all inputs in the form
				currentForm = document.getElementById(obj.controlId);
				inputs = currentForm.getElementsByTagName("input");

				// loop through the inputs, grabbing the names and values and
				// setting them as attributes on the reference object
				for ( var j = 0; j < inputs.length; j++) {
				//	console.log(inputs[j].type + "---" + inputs[j].name);
					if ((inputs[j].type == "range" || inputs[j].type == "number")
							|| (inputs[j].type == "text")) {
					//	console.log("myval1>" + inputs[j].name + "--"
					//			+ inputs[j].value + "===" + img.src);
						addAttribute(img, inputs[j].name, inputs[j].value);
					}
					if ((inputs[j].type == "radio")) {
						if (inputs[j].checked) {
						//	console.log("myval2>" + inputs[j].name + "--"
						//			+ inputs[j].value);
							addAttribute(img, inputs[j].name, inputs[j].value);
						}
					}
				}
		//	console.log("fdhs>>>"+img.src);
				
			}
//		alert(videosrc);	
		}
	//	videosrc=img.src;
		//console.log("END>>"+videosrc);
	}

	// finally, apply the filters
	processFilters();

	img.style.visibility = "visible";
}

// update to current filter controls when switching filters
function displayControls() {
	// get the main image
	console.log("CONSOLE>"+select_index_item);
	var img = getFilterTarget();
	// get the filter chooser                
	var filterSelector = getFilterSelector();

	// set up the control panels
	hideControls();
	showCurrentControl(filterSelector);
	flushDataAttributes(img);
	removeClasses(img);

	// find the currently-selected filter
	var options = filterSelector.getElementsByTagName("option");
	options="dsh";
	var obj = getCurrentControl(options);
	if (obj) {
		// if we've got a match, display this current filter's control panel
		addClass(img, obj.filterClass);
	}

	// kinda weird that I need to apply this inside and outside the filter.
	// ideally it'd only happen here.
	// Haven't quite tracked down why the 2x application is necessary yet.
//	if(fiturst==false){
//		console.log("firsttime only");
//		fiturst=true;
//	}
//	else{
//		console.log("No firtsmkdfkd");
		updateFilters(img);
//	}
	//
}

// hide all control panels
function hideControls() {
	var controls = getElementsByClassName("controls");
	for ( var i = 0; i < controls.length; i++) {
		controls[i].style.display = "none";
	}
}

// show currently-selected control panel
function showCurrentControl(filterSelector) {

	// find the currently-selected filter
	var options = filterSelector.getElementsByTagName("option");
	var obj = getCurrentControl(options);
	if (obj) {
		// if we've got a match, display this current filter's control panel
		var current = document.getElementById(obj.controlId);
		console.log("current>"+current);
		current.style.display = "block";
	}
}

// helper functions to grab the needed DOM elements
function getFilterSelector() {
	return document.getElementById("filter-selector");
}
function getFilterTarget() {
	return document.getElementById("contentimg");
}
function getInteractionForm() {
	return document.getElementById("interaction-form");
}
function getInteractionTarget() {
	return document.getElementById("interaction");
}

// helper function to match the currently-selected option in the select list to
// a filter control
function getCurrentControl(options) {
	// first, loop through the list of select options
//	for ( var i = 0; i < options.length; i++) {
//		// when we find the currently-selected one, loop through the filter
//		// control object
//		if (options[i].selected) {
//			for ( var j = 0; j < filterControl.filters.length; j++) {
//				// if we can match the selected option to a filter, return the
//				// filter
//				if (filterControl.filters[j].name == options[i].value) {
//					return (filterControl.filters[j]);
//				}
//			}
//		}
//	}
return filterControl.filters[select_index_item];
}

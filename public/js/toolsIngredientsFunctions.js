var what;
var name;
var recipeData = $.getJSON("../json/instructions.json", function(result) {
	what = result;
	name = result[0].name;
});

var index = 0;

window.onload = function() {  
	console.log(what);
	console.log(name);
	display();
}

document.onload = function() {  
	console.log(what);
	console.log(name);
	display();
}


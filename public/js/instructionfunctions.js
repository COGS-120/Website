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



function nextIndex() {
	if (what[0].steplist[index].hasOwnProperty("end")) {
		window.location.href = "/../finish/" + name;
	}
	else
	{
		index++;
		display();
	}
	

}

function previousIndex() {
	index--;
	if (index < 0) {
		index = 0;
	}

	display();

}

function display() {

	var title = document.getElementById("stepTitle");
	title.innerText = what[0].steplist[index].step;
}
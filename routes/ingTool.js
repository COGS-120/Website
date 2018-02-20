exports.view = function(req, res) {
	var name = req.params.name;
	var recipeData = require("../public/json/instructions.json");
	

	var dataWeWant;
	var index = 0;

	console.log(recipeData);
	for (index = 0; index < recipeData.length; index++) {
		if (recipeData[index].name === name){
			dataWeWant = recipeData[index];
			break;
		}

		if (index >= 100) {
			console.log("no we couldnt find " + name);
			break;
		}

		index++;
	}


if (typeof dataWeWant !== 'undefined') {
    // the variable is defined
    	res.render("ingTool", {
		"name" : name,
		"tools": dataWeWant.tools,
		"ingredients": dataWeWant.ingredients
	});
}

else {
		res.render("ingTool", {
		"name" : name
	});
}
};
exports.view = function(req, res) {
	var name = req.params.name;
	var recipeData = require("../public/json/instructions.json");

	var dataWeWant;
	var index = 0;

	console.log(recipeData);
	while (10 == 10) {
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

		res.render("ingTool", {
		"name" : name,
		"tools": dataWeWant.tools,
		"ingredients": dataWeWant.ingredients
	});
};
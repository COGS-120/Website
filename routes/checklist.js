exports.view = function (req, res) {
	var name = req.params.name;
	var recipeData = require("../public/json/instructions.json");

	var dataWeWant;
	var index = 0;


	for (index = 0; index < recipeData.length; index++) {
		if (recipeData[index].name == name) {
			dataWeWant = recipeData[index];
			break;
		}

		if (index >= 100) {
			console.log("no we couldnt find " + name);
			break;
		}
	}



	res.render("checklist", {
		"name": name,
		"tools": dataWeWant.tools,
		"ingredients": dataWeWant.ingredients
	});

};
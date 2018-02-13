exports.view = function(req, res) {
	var name = req.params.name;
	var recipeData = require("../public/json/instructions.json");


		res.render("ingredientsTools", {
		"name" : name,
		"tools": tools,
		"ingredients": ingredients
	});
};
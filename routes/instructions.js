exports.view = function(req, res) {
	var name = req.params.name;
	var recipeData = require("../public/json/instructions.json");


		res.render("instructions", {
		"name" : name,
		"recipe": recipeData
	});
};
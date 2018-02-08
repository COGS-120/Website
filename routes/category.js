exports.view = function(req, res) {
	var name = req.params.name;
	var foodDataAll = require("../public/json/food.json");

	// Seperate the food data that we requested
	var foodDataSpecific = foodDataAll[name];

	res.render("category", {
		"categoryName" : name,
		"category" : foodDataSpecific,
	});
};
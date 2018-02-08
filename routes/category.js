exports.view = function(req, res) {
	var name = req.params.name;
	var foodDataAll = require("../public/json/food.json");

	// Seperate the food data that we requested
	var foodDataSpecific = foodDataAll[name];

	console.log("The category name is: " + name);
	console.log(foodDataAll);
	console.log("Data: " + foodDataSpecific);

	res.render("category", {
		"categoryName" : name,
		"category" : foodDataSpecific,
	});
};
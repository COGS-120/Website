exports.view = function(req, res) {
	var name = req.params.name;
	var foodDataAll = require("../public/json/food.json");
	var categoryDataAll = require("../public/json/categories.json");

	// Seperate the food data that we requested
	var foodDataSpecific = foodDataAll[name];

	// Separate the category data
	var categoryData = categoryDataAll["categories"];

	// Find the correct category data
	var correctIndex = 0;
	for (var index = 0; index < categoryData.length; index++) {
		if (categoryData[index].name == name) {
			correctIndex = index;
		}
	}
	var categoryDataSpecific = categoryData[correctIndex];

	res.render("category", {
		"categoryName" : name,
		"category" : foodDataSpecific,
		"categoryImage" : categoryDataSpecific.image
	});

};



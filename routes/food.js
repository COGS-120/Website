exports.view = function(req, res) {
	var name = req.params.name;

	var foodDataAll = require("../public/json/food-info.json");
	var foodDataSpecific = foodDataAll[name];

	console.log(foodDataAll);
	console.log("FOOOOD food name is: " + name);
	res.render("food", foodDataSpecific);
};
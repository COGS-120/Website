exports.view = function(req, res) {
	var name = req.params.name;

	var foodDataAll = require("../public/json/food-info.json");
	var recipeData = require("../public/json/instructions.json");

	var foodDataSpecific = foodDataAll[name];

	var dataWeWant;
	var index = 0;


	

	for (index = 0; index < recipeData.length; index++) {
		console.log(index);
		if (recipeData[index] !== 'undefined' &&
			recipeData[index].name === name){
			dataWeWant = recipeData[index];
			break;
		}
	}


if (typeof dataWeWant !== 'undefined') {
    // the variable is defined
	res.render("food", {
		"image": foodDataSpecific.image,
		"name" : name,
		"steplist": dataWeWant.steplist,
		"time": dataWeWant.time,
		"category": foodDataSpecific.cat
	});
}
else {
	res.render("food", {
		"image": foodDataSpecific.image,
		"name" : name, 
		"category": foodDataSpecific.cat
	});
}
};
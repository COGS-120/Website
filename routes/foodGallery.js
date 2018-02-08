exports.view = function(req, res) {
	var name = req.params.name;
	console.log("The category name is: " + name);
	res.render("category", {
		"categoryName" : name
	});
};
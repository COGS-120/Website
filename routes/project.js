exports.viewProject = function(req, res) {
	var name = req.params.name;
	console.log("The proect name is: " + name);
	res.render("project", {
		"projectName" : name
	});
};
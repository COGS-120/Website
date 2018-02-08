exports.view = function(req, res) {
	var name = req.params.name;
		res.render("share", {
		"name" : name
	});
};
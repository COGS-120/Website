var categoryData = require("../public/json/categories.json");
/*
 * GET home page.
 */

exports.view = function (req, res) {
  categoryData['viewAlt'] = false;
  res.render('home', categoryData);
};


exports.viewAlt = function(req, res) {
	categoryData['viewAlt'] = true;
	res.render('home', categoryData);
};
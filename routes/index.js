
/*
 * GET home page.
 */

exports.view = function (req, res) {
  var categoryData = require("../public/json/categories.json");

  res.render('index', categoryData);
};
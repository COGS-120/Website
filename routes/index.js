
/*
 * GET home page.
 */

exports.view = function (req, res) {
  res.render('index', {
    'projects': [
      {
        'name': 'Breakfast',
        'image': 'breakfast.jpg',
        'id': 'Breakfast'
      },
      {
        'name': 'Lunch',
        'image': 'lunch.jpg',
        'id': 'Lunch'
      },
      {
        'name': 'Dinner',
        'image': 'dinner.jpg',
        'id': 'Dinner'
      },
      {
        'name': 'Dessert',
        'image': 'dessert.jpg',
        'id': 'Desert'
      },
      {
        'name': 'Vegetarian',
        'image': 'vegetarian.jpg',
        'id': 'Vegetarian'
      },
      {
        'name': 'Gluten Free',
        'image': 'glutenfree.jpg',
        'id': 'Gluten Free'
      }
    ]
  });
};
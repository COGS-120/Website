/**
 * Module dependencies.
 */

 
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

// Routes
var index = require('./routes/index');
var category = require('./routes/category');
var food = require('./routes/food');
var foodGallery = require('./routes/foodGallery');
var instructions = require('./routes/instructions');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('IxD secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/category/:name', category.view);
app.get('/food/:food', food.view);
app.get('/food/gallery:gallery', foodGallery.view);
app.get('/instructions', instructions.view);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

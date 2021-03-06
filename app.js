/**
 * Module dependencies.
 */
 
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

// Routes
var login = require("./routes/login");
var home = require('./routes/home');

var about = require("./routes/about");
var favorites = require("./routes/favorites");
var category = require('./routes/category');
var food = require('./routes/food');
var foodGallery = require('./routes/foodGallery');
var instructions = require('./routes/instructions');
var profile = require('./routes/profile');
var share = require('./routes/share');
var checklist = require('./routes/checklist');
var privacy = require('./routes/privacy');
var terms = require('./routes/terms');

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
app.get('/', login.view);
app.get('/home', home.view);
app.get('/viewAlt', home.viewAlt);
app.get('/login', login.view);

app.get('/about', about.view);
app.get('/favorites', favorites.view);
app.get('/category/:name', category.view);
app.get('/food/:name', food.view);
app.get('/food/:name/gallery', foodGallery.view);
app.get('/instructions/:name', instructions.view);
app.get('/share/:name', share.view);
app.get('/checklist/:name', checklist.view);
app.get('/privacy', privacy.view);
app.get('/terms', terms.view);
app.get('/profile', profile.view);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

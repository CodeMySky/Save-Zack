var fs = require('fs'),
  express = require('express'),
  routes = require('./routes'),
  path = require('path'),
  mongoose = require('mongoose'),
  settings = require('./Settings');

var accessLogfile = fs.createWriteStream('access.log', {
  flags: 'a'
}),
  errorLogfile = fs.createWriteStream('error.log', {
    flags: 'a'
  });

var app = express();

mongoose.connect('mongodb://' + settings.host + '/' + settings.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function callback() {
  console.log('db connection success');
});

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger({
    stream: accessLogfile
  }));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(settings.cookieSecret));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.session({
    secret: settings.cookieSecret
  }));
  app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.token = req.session.token;
    res.locals.error = req.session.error;
    delete req.session.error;
    res.locals.success = req.session.success;
    delete req.session.success;
    next();
  });
  app.use(app.router);
});

routes(app);

app.configure('development', function() {
  app.use(express.errorHandler());
});
app.configure('production', function() {
  app.error(function(err, req, res, next) {
    var meta = '[' + new Date() + ']' + req.url + '\n';
    errorLogfile.write(meta + err.stack + '\n');
    next();
  });
});

module.exports = app;

if (!module.parent) {
	app.listen(app.get('port'));
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env)
}

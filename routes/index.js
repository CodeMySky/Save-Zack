/*
 * GET home page.
 */
var login = require('./login'),
reg = require('./reg'),
input = require('./input'),
task = require('./task'),
section = require('./section'),
submission = require('./submission'),
sendEmail = require('./sendEmail'),
result = require('./result'),
User = require('../models/user'),
checkLogin = require('./tools').checkLogin;
module.exports = function(app) {
	app.get('/',checkLogin);
	app.get('/', function(req, res){
			var username = req.session.user?req.session.user.name:null;
			User.get(username,function(err,user){
					res.render('index', {
							user:JSON.stringify(user)
						});
				});
		});
	reg(app);
	login(app);
	input(app);
	task(app);
	section(app);
	submission(app);
	sendEmail(app);
	result(app);
	app.get('/logout', function(req, res) {
			delete req.session.user;
			res.clearCookie('user');
			req.session.success='注销成功';
			res.redirect('/');
		});
};

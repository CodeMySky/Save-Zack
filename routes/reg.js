/*
 * GET reg.
 */
var User = require('../models/user.js'),
	crypto = require('crypto');
module.exports = function(app){
	app.get('/reg', function(req, res) {
		res.render('reg', {
			title: '注册'
		});
	});
	app.post('/reg', function(req, res) {
		//check user password is same
		if (req.body['password-repeat'] != req.body['password']) {
			req.session.error = '两次输入的口令不一致';
			return res.redirect('/reg');
		}
		//create password md5
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		var newUser = new User({
			name: req.body.username,
			password: password,
		});

		//check if the username is exist
		User.get(newUser.name, function(err, user) {
			if (user)
				err = '用户名已存在.';
			if (err) {
				req.session.error = err;
				return res.redirect('/reg');
			};
			//if the user is not exist then add it to the db
			newUser.save(function(err) {
				if (err) {
					req.session.error = err;
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.session.success = '注册成功';
				res.redirect('/');
			});
		});
	});
};

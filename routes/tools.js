var User = require('../models/user');
var tools = new Object;

tools.handleError = function (err,req,res,level){
	if (level && level > 1)console.log(err);
	if (req.method === "POST"){
		return res.end(err);
	}else{
		req.session.error = err;
		return res.redirect("/");
	}
}
tools.checkLogin = function (req, res, next) {
	if (!req.session.user && req.signedCookies.user){
		req.session.user = {name:req.signedCookies.user};
	}
	if (req.session.user && !req.session.user.info) {
		User.get(req.session.user.name, function(err,user){
				if (err){
					req.session.error = err;
				}
				if (user && user.info) req.session.user = user;
			});
	}
	next();
}
tools.getUserEnergy = function (username, callback){
	if (username){
		User.get(username,function(err, user){
				if (user && user.energy){
					callback(user.energy);
				}else{
					callback(0);
				}
			});
	}else{
		callback(0);
	}
}
module.exports = tools;

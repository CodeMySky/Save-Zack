/*
 * GET login.
 */
var User = require('../models/user.js'),
settings = require('../Settings'),
http = require('http'),
https = require('https'),
querystring = require('querystring'),
crypto = require('crypto'),
handleError = require('./tools').handleError;
module.exports = function(app){
/*	app.get('/login/weibo', function(req,res){
		var data = {
			redirect_uri: "http://moshifang.com:3000/grant/weibo",
			client_id: settings.client_id
		};
		var auth_url = "https://api.weibo.com/oauth2/authorize?"+
			querystring.stringify(data);
		res.redirect(auth_url);		
	});
	app.get('/grant/weibo',function(req,res){
		var data = {
			"client_id": settings.client_id,
			"client_secret": settings.client_secret,
			"grant_type":"authorization_code",
			"redirect_uri":"http://moshifang.com:3000/token/weibo",
			"code":req.query.code
		};
		var options = {
			hostname: 'api.weibo.com',
    	path: "/oauth2/access_token"
  	};
  	send(options,data,"POST","https",function(err,data){
  		try{
  			var dataJSON = JSON.parse(data);
  		}
  		catch(err){
  			return console.log(err);
  		}
			req.session.user = null;
			res.clearCookie('user');
			var ID = dataJSON.uid+"3"; 
			User.get(ID, function(err, user) {
					if (err) return handleError(err,req,res);
					if (!user){
						user = new User({name: ID});
					}
					var data = {
						"access_token":dataJSON.access_token,
						"uid":dataJSON.uid
					};
					var options = {
						hostname: 'api.weibo.com',
						path: "/2/users/show.json"
					};
					send(options,data,"GET","https",function(err,userdata){
						if (err) return handleError(err,req,res);
						try{
							var userdataJSON = JSON.parse(userdata);
						}
						catch(err){
							return handleError(err,req,res); 
						}
						userdataJSON.profileImageUrl = userdataJSON.profile_image_url;
						userdataJSON.screenName = userdataJSON.screen_name;
						user.info = [];
						user.info[0] = userdataJSON;
						user.save(function(err){
								if (err) return handleError(err,req,res)
						});
					});
					req.session.user = {name:user.name};
					res.cookie('user', ID, { maxAge: 604800000 ,signed: true });
					req.session.success = '登录成功';
					res.redirect("/section?sectionNo=0");
			});
  	});
	});*/
	app.get('/login', function(req, res) {
			if(	req.query.token && 
				req.query.mediaUserID &&
			   	req.query.redirect_url){
				req.session.user = null;
				res.clearCookie('user');
				var ID = req.query.mediaUserID;
				User.get(ID, function(err, user) {
						if (err) return handleError(err,req,res);
						if (!user){
							//if the user is not exist then add it to the db
							user = new User({
									name: ID
								});
						}
						getUserInfo(req,user,function(){
							req.session.user = {name:user.name};
							res.cookie('user', ID, { maxAge: 604800000 ,signed: true });
							req.session.token = req.query.token;
							res.redirect("/section/0");
						});
					});
			}else{
				res.render('login');
			}
		});
};

function getUserInfo(req,user,callback){
	var appid = settings.appid,
	api_key = settings.api_key,
	token = req.query.token,
	timestamp = new Date().getTime(),
	version = "1.0",
	sign_type = "MD5",
	arr = new Array;

	arr.push("appid="+appid);
	arr.push("token="+token);
	arr.push("timestamp="+timestamp);
	//arr.push("version="+version);
	arr.push("sign_type="+sign_type);
	arr.sort();
	var md5 = crypto.createHash('md5');
	var signstring = arr.join("");
	signstring += api_key;
	var sign = md5.update(signstring).digest('hex');
	arr.push("sign="+sign);
	var options = {
		host: 'open.denglu.cc',
		port: 80,
		path: "/api/v4/user_info?"+arr.join("&")
	};

	http.get(options, function(res) {
			var body = '';
			res.on('data', function (chunk) {
					body += chunk;
				});
			res.on('end', function () {
					user.info = [];
					user.info[0] = JSON.parse(body);
					user.save(function(err){
						if (err) return console.log(err);
						callback();
					});
				});
		}).on('error', function(e) {
				console.log("login(denglu): " + e.message);
			});
	}

	function send(options,dataJSON,method,way,callback){ 
		var data = querystring.stringify(dataJSON);
		method = method || "GET";
		way= way || "http";
		options.port = way==="http"?80:443;
		options.method = method;
		if (method === "POST"){
			options.headers = {  
				'Content-Type': 'application/x-www-form-urlencoded',  
				'Content-Length': data.length  
			};
		}else {
			options.path +="?"+data;
		}
		var resdata="";
		var protocal = (way === "http")?http:https;	
		var req = protocal.request(options, function(res) {  
				res.setEncoding('utf8');  
				res.on('data', function (chunk) {  
						if (chunk) resdata +=chunk;
					});  
				res.on('end', function(){
						callback(null,resdata);
					}).on('error', function(e) {callback(err.message,null)});
			});  

		// write parameters to post body  
		if (method === "POST") req.write(data);  
		req.end();  
	}

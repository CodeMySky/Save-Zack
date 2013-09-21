var User = require('../models/user.js');
var querystring = require('querystring');  
var http = require('http');    
 
module.exports = function(app){
	app.post('/sendmail',function(req, res){
		var subject = req.body.subject,
			html = req.body.html,
			password = req.body.password;
		if (subject && html && password){
			if (password === "ceshi"){
				console.log(req.body.email);
				console.log(req.body.username);
				if (req.body.email !== ""){
					sendEmail(req.body.email,subject,html);
					return res.end("email:"+req.body.email);
				}else if(req.body.username !== ""){
					User.get(req.body.username,function (err,user){
						if (user && user.email){
							sendEmail(user.email,subject,html);
							return res.end("user"+user.email);
						}	
						return res.end("No such user");
					});
				}else {
					sendEmail("719243326@qq.com",subject,html);
					return res.end("test ok");
				}
			}else if (password == "woshikaige") {
				User.getEmail(function(err,users){
					users.forEach(function(user){
						if (user.email) sendEmail(user.email,subject,html);
						user.sendEmail = 1;
						user.save();
					})
				});
				return res.end("all ok");
			}
		}else{
			return res.end("@_@");
		}
	});
	app.get('/sendmail', function(req,res){
		res.render('sendmail');
	});
};
function sendEmail(email,subject,html){
	var post_domain = 'sendcloud.sohu.com';  
	var post_port = 80;  
	var post_path = '/webapi/mail.send.json';   
	var post_data = querystring.stringify({
	 "api_user":"postmaster@mc2.sendcloud.org",
	 "api_key":"DqiZlrsT",
	 "to": email,
	 "subject":subject,
	 "html":html,
	 "from":"service@mc2.sendcloud.org",
	 "fromname":"模式方：拯救小扎"
	});  
	  
	var post_options = {  
	  host: post_domain,  
	  port: post_port,  
	  path: post_path,  
	  method: 'POST',  
	  headers: {  
	    'Content-Type': 'application/x-www-form-urlencoded',  
	    'Content-Length': post_data.length  
	  }  
	};  
	var resdata; 
	var post_req = http.request(post_options, function(res) {  
	  res.setEncoding('utf8');  
	  res.on('data', function (chunk) {  
	    resdata +=chunk;
	  });  
	  res.on('end', function(){
	  	console.log(resdata);
	  })
	});  
	  
	// write parameters to post body  
	post_req.write(post_data);  
	post_req.end();  
}

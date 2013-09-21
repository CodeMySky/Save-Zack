/*
 * GET input.
 */
var Task = require('../models/task.js'),
Section = require('../models/section.js'),
User = require('../models/user.js');
handleError = require('./tools').handleError;
module.exports = function(app){
	app.get('/inputTask/:no', function(req, res){
		Task.get(req.params.no, function(err,task){
			if (err) return handleError(err,req,res);
			res.render('editTask',{task:escape(JSON.stringify(task))});
		});
	});
	app.post('/inputTask', function(req,res){
		Task.remove({no:req.body.no},function(err){
			Change2Num(req.body.requiredEnergy);
			Change2Num(req.body.gain);
			var newTask = new Task(req.body);
			newTask.save(function(err){
				if (err) return handleError(err,req,res);
				res.end('OK');
			});
		});
	});
	app.get('/inputSection/:no', function(req, res) {
		Section.get(req.params.no, function(err, section){
			if (err) return handleError(err,req,res);
			res.render("inputSection",{section:section});	
		});
	});
	app.post('/inputSection', function(req,res){
		Section.remove({no:req.body.no},function(err){
			if (err) return handleError(err,req,res);
			var newSection = new Section(req.body);
			newSection.save(function(err){
				if (err) return handleError(err,req,res);
				res.end('OK');
			});
		});
	});

	app.post('/inputEmail', function(req,res){
		User.get(req.session.user.name, function(err,user){
			if (err) return handelError(err,req,res);
			if (user){
				user.email = req.body.email;
				user.sendEmail = 0;
				user.save(function(err){
					if (err) return handleError(err,req,res);
				});
				res.end("OK");
			}else{
				return handleError("no such user"+req.session.user.name,req,res);
			}
		});
	});
};
function Change2Num(num){
	if (num) num = Number(num);
}

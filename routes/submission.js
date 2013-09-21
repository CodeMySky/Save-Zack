/*
*Submit code
*Return Code:
*Not Login
*Wrong Argument
*Not Accepted
*/
var Result = require('../models/result.js')
	, Task = require('../models/task.js')
	, User = require('../models/user.js')
	, handleError = require('./tools').handleError;

module.exports = function(app){
	app.post('/submission', function(req, res) {
		if (!req.session.user){
			return handleError("Not Login",req,res);
		}
		check(req,res,function(err,result){
			if (err) {return handleError(err,req,res);}
			if (result.status != "done"){
				result.status = req.body.status;
				result.passedStage = req.body.passedStage;
				if (result.status === "done"){
					addEnergy(req.session.user.name,req.body.energy);
					result.energy = req.body.energy;
				}
			}
			result.code = req.body.code;
			result.save(function(err){
				if (err) return res.end(err);
			});
			res.end("OK");
		});
	});
}
function addEnergy(username,energy){
	User.get(username, function(err, user){
		if (user){
			if (!user.energy) user.energy = energy;
			else user.energy += energy;
			user.save(); 
		}
	});
}
function check(req,res,callback){
	var submission = req.body;
	if (!submission.taskNo || !submission.status || !submission.code){
			return callback("Wrong argument",null);
	}
	Task.get(submission.taskNo,function(err,task){
		if (err) return callback(err,null);
		if (!task) return callback("No such task",null);
		if (task.startTime && task.startTime > (new Date.getTime())) return callback("Not begin",null);
		if (task.stopTime && task.stopTime < (new Date.getTime())) return callback("Finished",null);
		User.get(req.session.user.name, function(err,user){
			if (err) return callback(err,null);
			if (!user) return callback("No such user",null);
			if ((user.energy?user.energy:0) < task.requiredEnergy) return callback("Not enough energy",null);
			Result.get(user.name,submission.taskNo, function(err,result){
				if (err) return callback(err,null);
				if (!result){
					result = new Result({
							username :user.name,
							taskNo :submission.taskNo		
						});
					result.save(function(err) {
						if (err) return callback(err,null);
					});
				}
				return callback(err,result);
			});
		});
	});
}

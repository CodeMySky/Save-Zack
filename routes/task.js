/*
 * GET input.
 */
var Task = require('../models/task.js'),
 		Result = require('../models/result.js'),
 		User = require('../models/user.js'),
 		tools = require('./tools'),
 		getUserEnergy = tools.getUserEnergy,
 		handleError = tools.handleError; 
module.exports = function(app){
	app.get('/task/:taskNo',tools.checkLogin);
 	app.get('/task/:taskNo', function(req,res){
		var taskNo = req.params.taskNo;
		if (!taskNo) taskNo = "1";
		var username = req.session.user?req.session.user.name:null;

		Task.get(taskNo, function(err,task){
			if (err) return handleError(err,req,res); 
			if (!task) return handleError("无此任务",req,res,1);
			var taskJSON = task.toJSON();
			Result.get(username,taskNo, function(err,result){
				getUserEnergy(username, function(energy){
					if (energy < task.info.requiredEnergy){
						return handleError("能量不足，开启任务失败:(",req,res,1);
					}
					if (!result && username){//if the task has never been done
						result = new Result({
							username:username,
							taskNo:taskNo,
							status:"accepted",
							passedStage:0
						});
						result.save();
					}
					if (result){
						taskJSON.status = result.status;
						taskJSON.code = result.code;
						taskJSON.passedStage = result.passedStage;
					}
					var body = escape(JSON.stringify(taskJSON));
					User.get(username,function(err,user){
						res.render('taski', {task: body,user:JSON.stringify(user)});
					});
				});//getUserEnergy
			});//Result.get
		});//Task.get
	});
	app.get('/task', function(req,res){
		res.redirect("/task/"+req.query.taskNo);
	});
};
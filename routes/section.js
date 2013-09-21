/*
 * GET section.
 */
var Section = require('../models/section'),
Result = require('../models/result'),
Task = require('../models/task'),
User = require('../models/user'),
tools = require('./tools'),
getUserEnergy = tools.getUserEnergy,
handleError = tools.handleError;
module.exports = function(app){
	app.get('/section/:sectionNo',tools.checkLogin);
	app.get('/section/:sectionNo', function(req,res) {
		var sectionNo = req.params.sectionNo;
		if (sectionNo[sectionNo.length-1] === '#')
				sectionNo = sectionNo.slice(0,str.length-1);
		if (!sectionNo) sectionNo = 0;
		var username = req.session.user?req.session.user.name:null;
		getUserEnergy(username,function(energy){
			Section.get(sectionNo, function(err,section){
				if (err) return handleError(err,req,res);
				if (!section) return handleError("No section:"+sectionNo,req,res,1);
				var count = 0;
				var sectionJSON = section.toJSON();
				sectionJSON.taskArray = new Array;
				sectionJSON.taskNoArray.forEach(function(taskNo){
					Task.get(taskNo,function(err,task){
						if (err) return handleError(err,req,res);
						if (!task) return handleError("No task:"+taskNo,req,res);
						var taskJSON = task.toJSON();
						taskJSON.stageArray =[];
						if (energy < taskJSON.info.requiredEnergy){
							taskJSON.status = "locked";
						}else{
							taskJSON.status = "unaccepted";
						}
						Result.get(username,taskNo,function(err,result){
							if (result){
								taskJSON.status = result.status;
								taskJSON.passedStage = result.passedStage;
								taskJSON.liked_num= result.liked_num;
								taskJSON.energy = result.energy;
							}
							sectionJSON.taskArray.push(taskJSON);
							if (++count === sectionJSON.taskNoArray.length){
								var body = escape(JSON.stringify(sectionJSON));
								User.get(username, function(err,user){
									res.render('section', {
										section: body,
										user:JSON.stringify(user)
									});
								});
							}						
						});
					});
				});//forEach
			});//section
		});//getEnergy
	});
	app.get('/section', function(req,res) {
		var sectionNo = req.query.sectionNo;
		if (!sectionNo) sectionNo="0";
		res.redirect("/section/"+sectionNo);
	});
};

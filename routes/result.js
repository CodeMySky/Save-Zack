var Result = require('../models/result'),
	Task = require('../models/task'),
	User = require('../models/user'),
	handleError = require('./tools').handleError;

module.exports = function(app) {
	app.get('/u/:username/:taskNo', function(req, res) {
		var no = req.params.taskNo,
			name = req.params.username;
		if (no && name) {
			Result.get(name, no, function(err, result) {
				if (err) return handleError(err, req, res);
				if (!result) return handleError("No such result:" + no + "," + name, req, res);
				User.get(name, function(err, user) {
					if (err) return handleError(err, req, res);
					if (!user) return handleError("No such user" + name, req, res);
					res.render("result", {
						result: escape(JSON.stringify(result.toJSON())),
						user: user.toJSON()
					});
				});
			});
		} else {
			res.redirect("/section");
		}
	});
	app.get('/view_source/:username/:taskNo', function(req, res) {
		var no = req.params.taskNo,
			name = req.params.username;
		if (no && name) {
			Result.get(name, no, function(err, result) {
				if (err) return handleError(err, req, res);
				if (!result) return handleError("No such result:" + no + "," + name, req, res);
				User.get(name, function(err, user) {
					if (err) return handleError(err, req, res);
					if (!user) return handleError("No such user" + name, req, res);
					res.render("view_source", {
						result: escape(JSON.stringify(result.toJSON())),
						user: user.toJSON()
					});
				});
			});
		} else {
			res.redirect("/section");
		}
	});
	app.get('/result', function(req, res) {
		res.redirect("/u/" + req.query.name + "/" + req.query.taskNo);
	});
	app.post('/like_result', function(req, res) {
		var no = req.body.taskNo,
			name = req.body.name;
		if (no && name) {
			Result.get(name, no, function(err, result) {
				if (err) return handleError(err, req, res);
				if (result) {
					result.liked_num = result.liked_num ? 1 : result.liked_num + 1;
					Task.get(result.taskNo, function(err, task) {
						if (task) {
							task.info.liked_num = task.info.liked_num ? 1 : task.info.liked_num + 1;
							task.save();
						}
					});
					result.save();
					res.end("OK");
				}
			});
		}
	});
	app.post('/get_first', function(req, res) {
		if (req.body.taskNo) {
			Result.findOne({
				taskNo: taskNo
			})
				.sort({
					liked_num: -1
				})
				.exec(function(err, result) {
					console.log(err);
					console.log(result);
				})
		}
	});
	app.get('/allResult/:taskNo', function(req, res) {
		var taskNo = req.params.taskNo;
		Result.find({
			taskNo: taskNo,
			status: "done"
		})
			.exec(function(err, results) {
				var count = 0;
				if (err) return handleError(err, req, res);
				res.setHeader("Content-Type", "text/html");
				results.forEach(function(result) {
					res.write(count + ".<a href=" + "http://moshifang.com/u/" + result.username + "/" + taskNo + ">" + result.username + "</a></br>");
					count++;
					if (count === results.length) res.end();
				});
			});
	});
	app.get('/analyse', function(req, res) {
		Task.find({}, function(err, tasks) {
			var countTask = 0;
			//res.setHeader("Content-Type", "text/html");

			function sendData() {
				data.sort(function(a, b){
					return a.no - b.no;
				})
				res.send(data);
			}
			//tasks.sort(sortNumber);
			var data = [];
			tasks.forEach(function(task) {
				if (task.no.length > 2) {
					countTask += 2;
					if (countTask === tasks.length * 2) sendData();
					return;
				}
				var taskData = {};
				data.push(taskData);
				taskData.no = task.no;

				Result.find({
					taskNo: task.no
				}).count(function(err, count) {
					taskData.accepted = count;
					if (++countTask === tasks.length * 2) sendData();
				});
				Result.find({
					taskNo: task.no,
					status: "done"
				}).count(function(err, count) {
					taskData.done = count;
					if (++countTask === tasks.length * 2) sendData();
				});
			});
		});
	});
	app.get("/specialAward", function(req, res) {
		res.render("specialAward");
	});
	app.post("/specialAward", function(req, res) {
		var username = req.body.username,
			taskNo = req.body.taskNo,
			gain = req.body.gain;
		if (req.body.password != "woshikaige") return res.end("@_@");
		gain = parseInt(gain);
		Result.get(username, taskNo, function(err, result) {
			if (result) {
				var old = result.energy ? result.energy : 0;
				result.energy = gain;
				User.get(username, function(err, user) {
					if (user) {
						user.energy = user.energy + gain - old;
						result.save();
						user.save();
						res.end("ok");
					}
				});
			}
		});
	});
};
var cluster = require('cluster');
var os = require('os');

//get CPU Amount
var numCPUs = os.cpus().length;

var workers = {};
if (cluster.isMaster) {
	//main branch
	cluster.on('death', function (worker) {
		delete workers[worker.pid];
		worker = cluster.fork();
		workers[worker.pid] = worker;
	});
	for (var i = 0; i < numCPUs;i++) {
		var worker = cluster.fork();
		workers[worker.pid] = worker;
		console.log("fork"+ worker.pid);
	}
} else{
	var app = require('./app');
	app.listen(80);
}

process.on('SIGTERM', function () {
	for (var pid in workers){
		process.kill(pid);
		console.log("kill"+pid);
	}
	process.exit(0);
});

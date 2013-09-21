var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var taskSchema = new Schema({
	no: String,
	info: {
		target:String,
		requiredEnergy:Number,
		title:String,
		taskImg:String,
		gain:Number,
		description:String,
		hint:String,
		liked_num:Number
		//startTime:Number,
		//stopTime:Number
	},
	stageArray: Array,
});

var Task = mongoose.model('tasks', taskSchema);
module.exports = Task;

Task.get = function get(taskNo, callback) {
  Task.findOne({no:taskNo}, function(err, doc){
    if (err) {
      return callback(err, null);
    }
    return callback(err, doc);
  });
};
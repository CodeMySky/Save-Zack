var mongoose = require('mongoose');

var resultSchema = new mongoose.Schema({
	username:String,
	taskNo:String,
	status:String,
	passedStage:Number,
	energy:Number,
	code:Array,
	liked_num:Number,
	ranking:Number
});

var Result = mongoose.model('results', resultSchema);

module.exports = Result;

Result.get = function get(username,taskNo, callback) {
  Result.findOne({username:username,taskNo:taskNo}, function(err, result){
	if (err) {return callback(err, null);}
    if (!result){return callback(null,null);}
    if (result){
        if (!result.liked_num) result.liked_num = 0;
    	Result.count({taskNo:taskNo,liked_num:{$gt:result.liked_num}}, function(err,count){
    		if (err) return callback(err,null);
    		result.ranking = count;
    		return callback(err, result);
    	});
    }
  });
};

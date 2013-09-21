var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		User = require('./user'),
		Task = require('./task');

var sectionSchema = new Schema({
	no: String,
	taskNoArray: Array,
	taskArray:Array
});

var Section = mongoose.model('sections', sectionSchema);
module.exports = Section;

Section.get = function get(sectionNo, callback) {
  Section.findOne({no:sectionNo}, function(err, doc){
    if (err) {
      return callback(err, null);
    }
    return callback(err,doc);
  });
};
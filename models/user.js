var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {type: String, index: {unique: true}},
  password: String,
  energy: Number,
  info: Array,
  email: String,
  sendEmail: Number
});

var User = mongoose.model('users', userSchema);

module.exports = User;

User.get = function (username, callback) {
  User.findOne({name:username}, function(err, doc){
    if (err) {
      return callback(err, null);
    }
    return callback(err, doc);
  });
};
User.getEmail = function (callback) {
  User.find({email:{$ne:null}/*,sendEmail:0*/}, function(err, doc){
    if (err) {
      return callback(err, null);
    }
    return callback(err, doc);
  });
};
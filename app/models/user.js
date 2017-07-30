// User model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true },
    passwd: { type: String }
});

mongoose.model('User', userSchema, 'user');


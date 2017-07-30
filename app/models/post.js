// Post model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    content: { type: String, required: true },
    created: { type: Date }
});

mongoose.model('Post', PostSchema, 'sec');


var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var animeSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        require: true
    },
    other: {
        type: String,
        required: true
    },
    link: {
        type: String,
        require: true
    }
});

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    anime: [animeSchema]
});

var User = mongoose.model('User', userSchema);
module.exports = User;
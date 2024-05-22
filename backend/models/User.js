const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    contact: {
        type: String,
    },
    description: {
        type: String,
    },
    dob: {
        type: Date,
    },
    date: {
        type: Date,
        default: Date.now,
    },

})
UserSchema.plugin(passportlocalmongoose);
UserSchema.plugin(findOrCreate);

const User = mongoose.model('user', UserSchema);
module.exports = User;
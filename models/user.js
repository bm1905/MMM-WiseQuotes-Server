// User Schema.

// More attributes will be added. User controller should then be updated. 
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        min: [4, 'Too Short, minimum 4 characters'],
        max: [32, 'Too long, maximum 32 characters'],
    },
    password: {
        type: String,
        min: [4, 'Too Short, minimum 4 characters'],
        max: [32, 'Too long, maximum 32 characters'],
        required: 'Pasword is required'
    },
    quotes: [{ type: Schema.Types.ObjectId, ref: 'Quote' }]
});

// Method to check for correct password. Just call this function anywhere.
userSchema.methods.hasSamePassword = function (requestedPassword) {
    return bcrypt.compareSync(requestedPassword, this.password);
}

// Encrypt user password.
userSchema.pre('save', function (next) {
    var saltRounds = 10;
    const user = this;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);

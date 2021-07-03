const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: function(v) {
            const isEmail = validator.isEmail(v);
            if(!isEmail) {
                throw new Error('Not an email')
            }
            return isEmail;
        }     
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
} );

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.email;
    delete userObject.password;

    return userObject;
}

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password);
    }
    next();
});

module.exports = new mongoose.model('User', userSchema);
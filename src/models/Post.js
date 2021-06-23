const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bcrypt = require('bcrypt');

autoIncrement.initialize(mongoose.connection);

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        require: true
    },
    author: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    seq: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

postSchema.plugin(autoIncrement.plugin, {
    model: 'Post',
    field: 'seq',
    startAt: 1,
    increment: 1
});

postSchema.methods.toJSON = function() {
    const post = this;
    const postObject = post.toObject();

    delete postObject.password;
    delete postObject.author;

    return postObject;
}

postSchema.statics.certificate = async function(req) {
    const post = await this.findOne({ seq: Number(req.params.number), author: req.body.author });
    const isMatch = await bcrypt.compare(req.body.password, post.password);
    
    if(!post) {
        throw new Error('No such post');
    } else if(!isMatch) {
        throw new Error('Invalid password');
    }
    return post;
}

postSchema.statics.certiAndUpdate = async function(req) {
    const post = await this.certificate(req);
    post.title = req.body.title;
    post.body = req.body.body;
    return await post.save();
}

postSchema.statics.certiAndDelete = async function(req) {
    const post = await this.certificate(req);
    return await post.delete();
}

postSchema.pre('save', async function(next) {
    const post = this;
    if(post.isModified('password')){
        post.password = await bcrypt.hash(post.password, 8);
    }
    next();
});
module.exports = new mongoose.model('Post', postSchema);
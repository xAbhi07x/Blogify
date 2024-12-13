const mongoose = require('mongoose'); // Fixed 'required' to 'require'
const { Schema } = mongoose; // Destructure Schema from mongoose

const blogSchema = new Schema({ // Use 'new Schema'
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String, // Fixed the structure here; 'type' was misplaced
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId, // Correctly reference Schema.Types.ObjectId
        ref: 'user' // Assuming 'user' is the name of your user model
    }
}, 
{ timestamps: true });

const Blog = mongoose.model('blog', blogSchema); // Use 'mongoose.model' instead of 'model'

module.exports = Blog;

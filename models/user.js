const mongoose = require('mongoose');
const {createHmac, randomBytes} = require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true    //so that users don't use the same email again
    },
    salt:{
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/User.jpg"
    },
    role:{
        type: String,
        enum: ['USER', 'ADMIN'],
        default: "USER"
    }
},
{timestamps: true}
);

userSchema.pre('save', function (next) {
    const user = this;
    if(!user.isModified("password")) return next(); //if password is not modifying
    
    const salt = randomBytes(16).toString('hex');    // Proper random salt generation
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;      // Set the salt properly
    this.password = hashedPassword;  // Store the hashed password
    next();
});


userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error('user not found!');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex");

    if(hashedPassword!==userProvidedHash) throw new Error('something went wrong...');
    const token = createTokenForUser(user);
    return token;
})

module.exports = mongoose.model('user', userSchema);
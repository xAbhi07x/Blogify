const JWT = require("jsonwebtoken");
const SECRET = "whatever";

function createTokenForUser(user) {
    const payload = {
        _id: user.id,
        email: user.email,
        profileImageURL: user.profileImageURL, // Fixed typo here
        role: user.role,
    };

    const token = JWT.sign(payload, SECRET); // Optional: Set expiration time
    return token;
}

function validateToken(token) {
    try {
        const payload = JWT.verify(token, SECRET);
        return payload;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};

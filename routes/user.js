const express = require('express');
const User = require("../models/user");

const router = express.Router();

router.get('/signin', (req, res) => {
    return res.render("signin");
})

router.get('/signup', (req, res) => {
    return res.render("signup");
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password); // Await the token generation
        return res.cookie('token', token).redirect('/'); // Redirect after successful signin
    } catch (error) {
        console.error('Error during signin:', error.message);
        return res.status(401).render("signin", { error: "incorrect email or password" }); // Send back to signin with error message
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
})


router.post('/signup', async (req, res) => {
    const {fullname, email, password} = req.body;
    const createdUser = await User.create({
        fullname,
        email,
        password
    })
    return res.redirect('/');
})


module.exports = router;
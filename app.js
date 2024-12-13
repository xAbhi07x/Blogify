const express = require('express');
const user = require('./models/user');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/auth');
const Blog = require('./models/blog');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/blogify')
    .then(()=> console.log('mongodb is connected...'))

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(checkForAuthenticationCookie("token")); //token is the name of our cookie
app.use(express.static(path.resolve('./public')));
app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
})


app.listen(PORT, ()=> console.log("server started..."));
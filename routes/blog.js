const express = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require("../models/blog");
const Comment = require('../models/comment');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    return res.render("addblog", {
        user: req.user, //navbar blog page mein he
    })
})

// Route to get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
      const blog = await Blog.findById(req.params.id).populate("createdBy");
      if (!blog) {
          return res.status(404).send('Blog not found');
      }
      
      // Fetch comments for the specific blog
      const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

      // Render the blog details along with the comments
      res.render('blogDetail', { blog, comments, user: req.user }); // Pass comments to the view
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});


router.post('/', upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const coverImageURL = req.file ? `/uploads/${req.file.filename}` : null; // Handle optional image

  const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageURL
  });
  
  return res.redirect(`/blog/${blog._id}`); // Corrected redirect
});

router.post('/comment/:blogId', async (req, res) => {
  try {
      const { content } = req.body;
      const blogId = req.params.blogId;
      const createdBy = req.user._id; // Assuming req.user is populated with the logged-in user

      const comment = await Comment.create({
          content,
          blogId,
          createdBy,
      });

      res.redirect(`/blog/${blogId}`); // Redirect back to the blog post
  } catch (error) {
      console.error(error);
      res.status(500).send('Error creating comment');
  }
});



module.exports = router;
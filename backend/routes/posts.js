const express = require("express");
const router = express.Router();
const Post = require("../models/post"); // Corrected the require path

// Create a new post
router.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    post.save()
        .then(createdPost => {
            res.status(201).json({
                message: "Post added",
                postId: createdPost._id
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

// Update a post
router.put(":id", (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });

    Post.updateOne({ _id: req.params.id }, post)
        .then(result => {
            console.log(result);
            if (result.nModified > 0) {
                res.status(200).json({ message: "Update successful" });
            } else {
                res.status(404).json({ message: "Post not found" });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

// Get all posts
router.get("", (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: "Posts fetched successfully",
                posts: documents
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

// Get a single post by ID
router.get(":id", (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

// Delete a post by ID
router.delete(":id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: "Post deleted" });
            } else {
                res.status(404).json({ message: "Post not found" });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

module.exports = router;
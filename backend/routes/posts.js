const express = require("express");
const router = express.Router();
const Post = require("../models/post"); // Corrected the require path

// Create a new post
const multer = require("multer");
const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}



const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error=new Error("Invalid mime type");
      if(isValid){
        error = NULL;
      }
      cb(null,"backend/images");
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext=MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext);
    }
});
router.post("",multer({storage:storage}).single("image"), (req, res, next) => {
    const url = req.protocol+'://'+req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath:url+"/images/"+req.file.filename
    });

    post.save()
        .then(createdPost => {
            res.status(201).json({
                message: "Post added",
                post:{
                    ...createdPost,
                    id:createdPost._id,
                    
                    
                }
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
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery= Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
       postQuery
       .skip(pageSize*(currentPage+1))
       .limit(pageSize); 
    }
    
    postQuery.then(documents => {
            return Post.count();
    })
    .then(count=>{
            console.log(documents);
            res.status(200).json({
                message: "Posts fetched successfully",
                posts: fetchedPosts,
                maxPosts:count
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

// Get a single post by ID
router.get("/:id", (req, res, next) => {
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

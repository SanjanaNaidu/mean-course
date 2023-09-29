const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser to parse request bodies
const mongoose = require("mongoose");
const Post = require('./models/post');
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const app = express();

mongoose.connect("mongodb+srv://Sanjana:Sanju2708@cluster0.r3d2nvw.mongodb.net/node-angular")
.then(()=>{
    console.log("Connected to database!");
})
.catch((error) =>{
    console.log('Connection failed: ' + error);
});

app.use(bodyParser.json()); // Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
});

app.post("/api/posts", (req, res, next) => {
    // Assuming the request body has the 'title' and 'content' properties
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost=>{
        res.status(201).json({
            message:"Post added",
            postId:createdPost._id
        });
    });
});

app.put("/api/posts/:id",(req,res,next)=>{
    const post = new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content
    });
    Post.updateOne({_id:req.params.id},post).then(result=>{
        console.log(result);
        res.status(200).json({message: "Update successful"});
    });
});

app.get("/api/posts", (req, res, next) => {

    Post.find()
    .then(documents =>{
        console.log(documents);
    
    res.status(200).json({
        message: "Posts fetched successfully",
        posts: documents
    });
});
});

app.get("/api/posts/:id",(req,res,next) =>{
    Post.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json();
        }else{
           res.status(404).json({message:'Post not found!'}); 
        }
    })
})
app.delete("/api/posts/:id",(req,res,next) =>{
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(req.params.id);  
    
    res.status(200).json({message:"Post deleted!"});
});
});


app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);

module.exports = app;

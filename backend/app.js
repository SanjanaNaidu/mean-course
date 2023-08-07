const express = require('express');
const app = express();
app.use((req,res,next)=>{
    //console.log("first middleware");
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,PUT,OPTIONS");
    next();
});

app.post("/api/posts",(req,res,next)=>{
    const post =req.body;
    console.log();
    res.status(201).json({
        message:'Post added Successfully'
    });
});

app.get("/api/posts",(req,res,next)=>{
    const posts =[
        {
        id: 'yurnak11ojdn99',
        title:"First Server side post",
        content:"This is coming from server"
        },
        {
            id: 'ysjdh81ojdn88499',
            title:"Second Server side post",
            content:"This is coming from server!!"
            }
    ];
    res.status(200).json({
        message:"Posts fetched successfully",
        posts:posts
    });
    
});


module.exports = app;
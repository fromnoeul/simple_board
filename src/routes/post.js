const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const pagination = require('../middleware/pagination');


//  getting posts
router.get('/posts', pagination, async (req, res) => {
    try {
        res.render('posts', {
            boardData: res.paginatedResults.results,
            numOfPage: res.paginatedResults.numOfPage,
            pageArray: req.pageArray,
            limit: req.query.limit,
            page: req.query.page
        });
    } catch (e) {
        res.json({
            error: e.message
        })
    }
})

//  creating posts
router.get('/posts/new', (req, res) => {
    res.render('posts_new');
})
router.post('/posts/new', async (req, res) => {
    console.log(req.body);
    try {
        const post = new Post(req.body);
        await post.save();
        res.redirect('/posts?limit=5&page=1');
    } catch (e) {
        res.status(400).send('<script>alert("Fill all of your form");history.back();</script>')
    }
})

//  getting certain posts
router.get('/posts/:number', async (req, res) => {
    try {
        const certain = await Post.findOne({"seq" : Number(req.params.number)});
        if(!certain){
            throw new Error('No such post');
        }
        
        res.render('posts_certain', {
            title: certain.title,
            body: certain.body,
            seq: Number(req.params.number),
            createdAt: certain.createdAt
        });
    } catch (e) {
        res.status(404).redirect('/posts?limit=5&page=1');
    }
})

//  editing certain posts
router.get('/posts/:number/edit', async (req, res) => {
    try{
        const certain = await Post.findOne({"seq" : Number(req.params.number)});
        if(!certain){
            throw new Error('No such post');
        }
   
        res.render('post_edit', {
            title: certain.title,
            body: certain.body,
            seq: req.params.number
        });
    } catch (e) {
        res.status(404).redirect('/posts?limit=5&page=1');
    }
})
router.post('/posts/:number/edit', async (req, res) => {
    try {
        await Post.certiAndUpdate(req);
        res.redirect('/posts/' + req.params.number );
    } catch (e) {
        res.status(400).send('<script>alert("Check your name or password");history.back();</script>');
    }
})

//  deleting certain posts
router.get('/posts/:number/delete', async (req, res) => {
    try {
        res.render('post_delete', {
            seq: req.params.number
        })
    } catch (e) {
        res.status(400).redirect('/posts?limit=5&page=1');
    }
})

router.post('/posts/:number/delete', async (req, res) => {
    try {
        await Post.certiAndDelete(req);
        res.redirect('/posts?limit=5&page=1');
    } catch (e) {
        res.status(400).send('<script>alert("Check your name or password");history.back();</script>');
    }
})


module.exports = router;
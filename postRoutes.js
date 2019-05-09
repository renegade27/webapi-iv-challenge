const express = require('express');
const postRouter = express.Router();
const db = require('./data/helpers/postDb');

const sendUserError = (status, message, res) => {
    res.status(status).json({ errorMessage: message });
    return;
};

//POST request handler for new post
postRouter.post('/posts', (req, res) => {
    const { text, user_id } = req.body;
    if(!text || !user_id) {
        sendUserError(400, "Text or ID field blank.", res)
    }
    db.insert({ text, user_id})
    .then(response => {
        res.status(201).json(response)
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, "Error saving new post to DB.", res)
        return;
    })
})

//GET request handler for all posts
postRouter.get('/posts', (req, res) => {
    db.get()
    .then(posts => {
        res.json({posts})
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, "Unable to fetch posts.", res)
        return;
    })
})

//GET request handler for specific post by ID
postRouter.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.getById(id)
    .then(post => {
        if (!post.text || !post.user_id) {
            sendUserError(404, 'Post not found', res);
            return;
        }
        res.json(post);
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, "Fetching post failed", res);
    })
})

//DELETE handler for specific post by ID
postRouter.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
    .then(response => {
        if(!response) {
            sendUserError(404, "The post with that ID doesn't exist", res);
            return;
        }
        res.json({ success: `Post with id: ${id} removed from system` });
        return;
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, "The post couldn't be removed", res)
    })
})

//PUT request handler for specific post by ID
postRouter.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
        sendUserError(400, "Text field has no content.", res)
    }
    db.update(id, {text})
    .then(response => {
        response ? res.status(201).json({ success: `Post ${id} was edited` }) : sendUserError(404, "User not found", res);
        return;
    })
    .catch(error => {
        console.log(error);
        sendUserError(500, "Editing post has failed.", res)
    })
})

module.exports = postRouter;
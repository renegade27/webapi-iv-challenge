const express = require('express');
const db = require('./data/helpers/userDb');
const middleware = require('./middlewares');
const userRouter = express.Router();

const sendUserError = (status, message, res) => {
    res.status(status).json({ errorMessage: message });
    return;
};

userRouter.get('/user', (req, res) => {
    db.get()
    .then(users => {
        res.status(200).json({users})
    })
    .catch(error => {
        sendUserError(500, "Users couldn't be fetched", res)
        return;
    })
})

userRouter.post('/user', middleware.capital, (req, res) => {
    const { name } = req.body;
    const name_uppercase = req.upperCase;
    let newName = !name_uppercase ? name : name_uppercase
    if(!name) {
        sendUserError(400, "Name field is blank", res)
    }
    db.insert({name : newName})
    .then(response => {
        res.status(201).json(response);
    })
    .catch(error => {
        sendUserError(500, "Error creating new user.", res)
        return;
    })
})

userRouter.get('/user/:id', (req, res) => {
    const {id} = req.params;
    db.getById(id)
    .then(user => {
        user ? res.status(200).json(user) : sendUserError(404, "User not found", res)
    })
    .catch(error => {
        sendUserError(500, "Fetch to DB failed.", res)
    })
})

userRouter.delete('/user/:id', (req, res) => {
    const {id} = req.params;
    db.remove(id)
    .then(response => {
        response ? res.status(200).send(`User ${id} has been removed.`) : sendUserError(404, "User with that ID doesn't exist", res)
    })
    .catch(error => {
        sendUserError(500, "User couldn't be removed", res)
    })
})

userRouter.put('/user/:id', middleware.capital, (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    const name_uppercase = req.upperCase;
    let newName = !name_uppercase ? name : name_uppercase
    db.update(id, {name : newName})
    .then(response => {
        response ? res.status(201).send(`User ${id} has been edited`) : sendUserError(404, "User with that ID doesn't exist", res)
    })
    .catch(error => {
        sendUserError(500, "User couldn't be edited", res)
    })
})

userRouter.get('/user/posts/:id', (req, res) => {
    const {id} = req.params;
    db.getUserPosts(id)
    .then(posts => {
        if(posts.length===0) {
            res.status(200).send("No posts for this user.")
        }
        res.status(200).json({posts})
    })
    .catch(error => {
        sendUserError(500, "Posts unable to be fetched", res);
    })
})

module.exports = userRouter;
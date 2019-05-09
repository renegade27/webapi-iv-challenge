// code away!
require('dotenv').config();

const express = require('express');
const middleware = require('./middlewares');
const cors = require('cors');

const port = process.env.PORT || 5000;

const server = express();

const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');


server.use(express.json());
server.use(cors());
server.use(middleware.capital);
server.use('/api', postRoutes);
server.use('/api', userRoutes);

server.listen(port, () => {
    console.log("Server is listening on port 5000.")
})

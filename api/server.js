const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require("dotenv").config();

const authenticate = require('..');
const authRouter = require('..');
const usersRouter = require('..');

const server = express();

server.use(helmet())
server.use(cors())
server.use(express.json())

server.use('/api/auth', authRouter);
server.use('/api/users',authenticate, usersRouter);

server.get('/', (req, res) => {
    res.status(200).json({message: "It's alive!"})
})

module.exports = server;
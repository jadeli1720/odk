const express = require("express");
const cors = require('cors');
const helmet = require('helmet');

//Routers


//Server = express framework
const server = express();

//Server use ...
server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).send(`Api server up and running!`)
})

module.exports = server;
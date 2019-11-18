const express = require("express");
const cors = require('cors');
const helmet = require('helmet');

//Router const
const odkRouter = require("../odk/odkRouter")

//Server = express framework
const server = express();

//Server dependency use ...
server.use(helmet());
server.use(cors());
server.use(express.json());

//Server Route use...
server.use('/odk', odkRouter );

server.get('/', (req, res) => {
    res.status(200).send(`Api server is up and running!`)
})

module.exports = server;
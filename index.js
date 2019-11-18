require('dotenv').config({path: "./.env"});

const server = require('./api/server');
const defaults = require('./config/default');

const PORT = defaults.port;

server.listen(PORT, () => console.log(`\n** Server up on port ${PORT} **\n`));
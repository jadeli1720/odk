require('dotenv').config();

const server = require('./api/server');
const defaults = require('./config/default');

const port = defaults.port;

server.listen(port, () => console.log(`\n** Server up on port ${port} **\n`));
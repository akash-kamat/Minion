// Minion Configuration
// Loads from .env file - create one based on .env.example

require('dotenv').config();

module.exports = {
    // Server connection
    host: process.env.MC_HOST || 'yourserver.aternos.me',
    port: parseInt(process.env.MC_PORT) || 25565,

    // Minion identity
    username: process.env.MC_USERNAME || 'Minion',

    // Minecraft version
    version: process.env.MC_VERSION || '1.21.1',

    // API server port
    apiPort: parseInt(process.env.API_PORT) || 3000
};

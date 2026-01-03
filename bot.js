const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const express = require('express');
const path = require('path');
const config = require('./config');

// Express API server
const app = express();
const API_PORT = config.apiPort;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let bot = null;
let isConnecting = false;
let botStats = {
    health: 0,
    food: 0,
    position: null,
    deaths: 0,
    uptime: null,
    startTime: null
};

// ========== API ENDPOINTS ==========

// Serve the control page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get bot status
app.get('/status', (req, res) => {
    const isOnline = bot && bot.entity;
    res.json({
        online: isOnline,
        connecting: isConnecting,
        stats: isOnline ? {
            health: Math.round(bot.health),
            food: Math.round(bot.food),
            position: {
                x: Math.round(bot.entity.position.x),
                y: Math.round(bot.entity.position.y),
                z: Math.round(bot.entity.position.z)
            },
            deaths: botStats.deaths,
            uptime: botStats.startTime ? Math.round((Date.now() - botStats.startTime) / 1000) : 0
        } : null
    });
});

// Start bot (webhook)
app.post('/start', (req, res) => {
    if (bot && bot.entity) {
        return res.json({ success: false, message: 'Bot is already running!' });
    }
    if (isConnecting) {
        return res.json({ success: false, message: 'Bot is already connecting...' });
    }

    console.log('📡 Webhook: Start bot');
    createBot();
    res.json({ success: true, message: 'Bot is starting...' });
});

// Stop bot (webhook)
app.post('/stop', (req, res) => {
    if (!bot) {
        return res.json({ success: false, message: 'Bot is not running!' });
    }

    console.log('📡 Webhook: Stop bot');
    if (bot) {
        bot.quit('Stopped via API');
        bot = null;
    }
    isConnecting = false;
    botStats.startTime = null;
    res.json({ success: true, message: 'Bot stopped!' });
});

// ========== BOT FUNCTIONS ==========

function createBot() {
    isConnecting = true;
    botStats.deaths = 0;
    console.log(`\n🤖 Connecting to ${config.host}:${config.port} as "${config.username}"...`);

    bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        auth: 'offline',
        version: config.version,
        hideErrors: false,
        checkTimeoutInterval: 30000,
    });

    bot.loadPlugin(pathfinder);

    bot.once('spawn', () => {
        isConnecting = false;
        botStats.startTime = Date.now();
        console.log('✅ Bot spawned in the world!');
        console.log(`📍 Position: ${bot.entity.position}`);

        const mcData = require('minecraft-data')(bot.version);
        const defaultMove = new Movements(bot, mcData);
        bot.pathfinder.setMovements(defaultMove);

        setTimeout(() => {
            bot.chat('Hello! I am a bot 🤖');
        }, 2000);
    });

    bot.on('login', () => {
        console.log(`🔐 Logged in! Minecraft version: ${bot.version}`);
    });

    bot.on('kicked', (reason) => {
        isConnecting = false;
        console.log(`❌ Bot was kicked: ${reason}`);
        bot = null;
    });

    bot.on('error', (err) => {
        console.log(`⚠️ Error: ${err.message}`);
    });

    bot.on('end', (reason) => {
        isConnecting = false;
        console.log(`🔌 Disconnected: ${reason}`);
        bot = null;
        // No auto-reconnect - user must call /start again
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        console.log(`💬 ${username}: ${message}`);

        const msg = message.toLowerCase();
        if (msg === 'hi' || msg === 'hello') {
            bot.chat(`Hello ${username}! 👋`);
        }
        else if (msg === 'pos') {
            const pos = bot.entity.position;
            bot.chat(`I'm at X:${Math.floor(pos.x)} Y:${Math.floor(pos.y)} Z:${Math.floor(pos.z)}`);
        }
    });

    bot.on('playerJoined', (player) => {
        if (player.username !== bot.username) {
            console.log(`👋 ${player.username} joined the game`);
        }
    });

    bot.on('playerLeft', (player) => {
        console.log(`👋 ${player.username} left the game`);
    });

    bot.on('death', () => {
        botStats.deaths++;
        console.log('💀 Bot died! Respawning...');
    });

    bot.on('respawn', () => {
        console.log('✨ Bot respawned!');
    });
}

// ========== STARTUP ==========

console.log('🎮 Minion - Minecraft Companion');
console.log('='.repeat(40));

if (config.host.includes('YOUR_SERVER')) {
    console.log('⚠️  WARNING: Edit config.js first!');
    process.exit(1);
}

app.listen(API_PORT, () => {
    console.log(`\n🌐 Server running at http://localhost:${API_PORT}`);
    console.log(`\n📡 Endpoints:`);
    console.log(`   GET  /        - Control panel`);
    console.log(`   POST /start   - Start the bot`);
    console.log(`   POST /stop    - Stop the bot`);
    console.log(`   GET  /status  - Get bot status`);
    console.log('\n⏳ Waiting for /start command...\n');
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    if (bot) {
        bot.quit('Server shutting down');
    }
    process.exit(0);
});

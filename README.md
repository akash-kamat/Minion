# 👾 Minion

> *Your loyal Minecraft companion that never sleeps, never eats (well, it does in-game), and never complains about your 3 AM gaming sessions.*

## The Problem 😭

You know the pain. You're a **broke Minecraft player** using Aternos because paying for a server is basically a crime when you're saving up for that Steam sale. But Aternos has rules:

- 🕐 **Server goes to sleep after 5 minutes of inactivity** - *"Sorry, we noticed nobody is suffering on your server, so we shut it down."*
- 🌾 **Your beautiful farms stop working** - Those iron golems? Sleeping. The crop farm? Frozen in time. That mob grinder you spent 6 hours building? Absolutely useless.
- 👻 **You log off for dinner and come back to a dead server** - Now you gotta wait 2 minutes for it to start again like some kind of peasant.

## The Solution 🎉

**Minion** - A tireless digital soul that:

- ✅ **Keeps your Aternos server alive** - Just by existing
- ✅ **Keeps your farms running** - Chunks stay loaded, hoppers keep hopping
- ✅ **Never asks for food** - Okay it might die a few times, but it respawns
- ✅ **Works for free** - Unlike those fancy Mojang accounts

## Features

| Feature | Description |
|---------|-------------|
| 🔌 **Webhook Control** | Start/stop via API calls - perfect for automation |
| 🎛️ **Web Dashboard** | Pretty UI at `localhost:3000` to babysit your minion |
| 💀 **Death Counter** | Watch your minion suffer so you don't have to |
| 🚫 **No Premium Account** | Works on cracked/offline servers (we're all broke here) |
| 📊 **Live Stats** | Health, food, position, uptime - all the vitals |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/minion.git
cd minion
npm install
```

### 2. Configure

Copy the example config and edit it:

```bash
cp .env.example .env
```

Edit `.env`:
```env
MC_HOST=yourserver.aternos.me
MC_PORT=25565
MC_USERNAME=Minion
MC_VERSION=1.21.1
API_PORT=3000
```

> ⚠️ **Don't forget to enable "Cracked" mode on your Aternos server!**  
> Aternos → Options → Cracked → ON

### 3. Run

```bash
npm start
```

### 4. Control Your Minion

- **Dashboard**: http://localhost:3000
- **Start**: `POST /start`
- **Stop**: `POST /stop`
- **Status**: `GET /status`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Web dashboard |
| `/start` | POST | Spawn the minion |
| `/stop` | POST | Despawn the minion |
| `/status` | GET | Get minion status & stats |

### Webhook Examples

```bash
# Start the minion
curl -X POST http://localhost:3000/start

# Stop the minion
curl -X POST http://localhost:3000/stop

# Check status
curl http://localhost:3000/status
```

## Pro Tips 💡

1. **Run it 24/7** - Use PM2 or a similar process manager:
   ```bash
   npm install -g pm2
   pm2 start bot.js --name minion
   ```

2. **Deploy on a free tier** - Render, Railway, or that old Raspberry Pi collecting dust

3. **Auto-start your Aternos server first** - Minion can't connect to a sleeping server (yet)

## FAQ

**Q: Will I get banned?**  
A: It's your own server. Ban yourself if you want.

**Q: My minion keeps dying!**  
A: Spawn it somewhere safe, or embrace the chaos. The death counter is a feature, not a bug.

**Q: Can it mine diamonds for me?**  
A: Not yet, but contributions are welcome 😉

**Q: Why "Minion"?**  
A: Because "Unpaid-Digital-Labor-That-Keeps-My-Broke-Server-Alive" was too long.

## Tech Stack

- [Mineflayer](https://github.com/PrismarineJS/mineflayer) - The real MVP
- [Express](https://expressjs.com/) - For the fancy API
- Node.js - JavaScript goes brrr

## Contributing

Found a bug? Want to add features? PRs welcome! Just don't ask me to add premium account support - we're too broke for that.

## License

MIT - Do whatever you want, just don't blame me when your minion falls in lava.

---

*Made with 💔 by someone who was tired of their Aternos server going to sleep.*

*Now go touch grass... or let your minion do it for you.*

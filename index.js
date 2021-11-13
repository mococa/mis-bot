require("dotenv").config();
const discord = require("discord.js");
const express = require("express");
const express_config = require("./config/express");
const MisBot = require("./controllers/discord");
const botConfig = require("./config/discord");
const set_discord_events = require("./events/discord");
const app = express();
express_config(app);

connectLoop();

function connectLoop() {
  const client = new discord.Client(botConfig);
  MisBot.setClient(client);
  try {
    set_discord_events(client);
    client.login(process.env.DISCORD_TOKEN).catch(connectLoop);
  } catch (err) {
    set_discord_events(client);
    client.login(process.env.DISCORD_TOKEN).catch(connectLoop);
  } finally {
    console.log("Bot online");
  }
}
console.log();

const config = require("../config.json");
const MisBot = require("../controllers/discord");
function set_discord_events(client) {
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.toLowerCase().startsWith(config.prefix)) return;
    const args = message.content
      .trim()
      .slice(config.prefix.length)
      .split(/ +/g);
    const command_name = args.shift().toLowerCase();
    try {
      require(`../commands/${command_name}.js`)(client, message, args);
    } catch (err) {
      set_discord_events(MisBot.getClient());
      console.error(err.message);
    }
  });
}
module.exports = set_discord_events;

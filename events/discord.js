const config = require("../config.json");
const Discord = require("discord.js");
const { LOG_CHANNEL, INITIAL_ROLE } = require("../constants");
const MisBot = require("../controllers/discord");
function set_discord_events(client) {
  function execCommand(message) {
    console.log(message.content);
    const args = message.content
      .trim()
      .slice(config.prefix.length)
      .split(/ +/g);
    const command_name = args.shift().toLowerCase();
    try {
      require(`../commands/${command_name}.js`) &&
        require(`../commands/${command_name}.js`)(client, message, args);
    } catch (err) {
      //set_discord_events(MisBot.getClient());
      console.error(err.message);
    }
  }

  client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.toLowerCase().startsWith(config.prefix)) return;
    console.log("created message");
    execCommand(message);
  });
  client.on("messageUpdate", (oldMessage, newMessage) => {
    if (oldMessage.content === newMessage.content) return;
    if (oldMessage.author.bot) return;
    if (newMessage.author.bot) return;
    if (newMessage.content === `${config.prefix}stop all`) return;
    if (newMessage.content.startsWith(config.prefix)) {
      execCommand(newMessage);
      return;
    }
    if (oldMessage.author.id === "528933602914992129") return;
    if (newMessage.author.id === "528933602914992129") return;
    const embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setAuthor(oldMessage.author.tag, oldMessage.author.avatarURL)
      .setDescription("A mensagem desse usuário foi editada.")
      .addField("**Antes:**", `\`${oldMessage.content}\``, true)
      .addField("**Depois:**", `\`${newMessage.content}\``, true)
      .addField("*Canal:*", `<#${newMessage.channel.id}>`)
      .setThumbnail(oldMessage.author.avatarURL())
      .setTimestamp()
      .setFooter("ID do usuário: " + newMessage.author.id);
    client.channels.cache.get(LOG_CHANNEL).send({ embeds: [embed] });
  });
  client.on("messageDelete", async (deletedMessage) => {
    if (deletedMessage.author.bot) return;
    if (deletedMessage.author.id === "528933602914992129") return;

    const channel = deletedMessage.channel.id;

    const embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setAuthor(deletedMessage.author.tag, deletedMessage.author.avatarURL)
      .setDescription("A mensagem desse usuário foi apagada.")
      .addField("**Mensagem:**", `\`${deletedMessage.content}\``, true)
      .addField("*Canal:*", `<#${channel}>`)
      .setThumbnail(deletedMessage.author.avatarURL())
      .setTimestamp()
      .setFooter("ID do usuário: " + deletedMessage.author.id);

    client.channels.cache.get(LOG_CHANNEL).send({ embeds: [embed] });
  });
  client.on("guildMemberAdd", async (member) => {
    const role = member.guild.roles.cache.get(INITIAL_ROLE); //ID do cargo Convidados
    await member.roles.add(role);
    const embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`Entrou no servidor`)
      .setDescription(
        `${member.user} entrou!\n\n${member.guild.memberCount}º membro`
      )
      .setThumbnail(
        member.user.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 1024,
        })
      )
      .setFooter("ID do usuário " + member.user.id)
      .setTimestamp();
    await channel.send({ embeds: [embed] });
  });
  client.on("guildMemberRemove", async (member) => {
    const embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`Saiu do servidor.`)
      .setDescription(`${member.user} foi embora!`)
      .setThumbnail(
        member.user.displayAvatarURL({
          dynamic: true,
          format: "png",
          size: 1024,
        })
      )
      .setFooter("ID do usuário " + member.user.id)
      .setTimestamp();
    await channel2.send({ embeds: [embed] });
  });
}
module.exports = set_discord_events;

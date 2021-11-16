const MisBot = require("../controllers/discord");

const sendInviteDM = async (member, msg, channel) => {
  if (member.user.bot) return;
  if (typeof channel === "string") {
    channel = await MisBot.getGuild().channels.fetch(channel);
  }
  const { code } = await channel.createInvite();
  await member.send({ content: `${msg}\nhttps://discord.gg/${code}` });
};
module.exports = sendInviteDM;

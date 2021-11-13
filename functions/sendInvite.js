const sendInviteDM = async (member, msg, channel) => {
  if (member.user.bot) return;
  const { code } = await channel.createInvite();
  await member.send(msg);
  return member.send(`https://discord.gg/${code}`);
};
module.exports = sendInviteDM;

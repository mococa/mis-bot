const {
  LUNCH_CHANNEL,
  LUNCH_TIME_MESSAGE,
  IDLE_MESSAGE,
} = require("../constants");

async function meet(client, message, args) {
  try {
    //todo: s+meet :nome-da-reuniao: [...@mention] -> cria uma reuniao com esse nome e taca @mention nela
    const meeting_name = args.slice(
      0,
      args.findIndex((arg) => arg.startsWith("<@"))
    );
    const members = args
      .slice(meeting_name.length)
      .map((member) => member.slice(3, member.length - 1));
    const category_name = meeting_name.join(" ") || "Sem tema";

    const parsedMembers = members
      .map((__member) => {
        const ___member = message.guild.members.cache.get(__member);
        if (!___member) return null;
        if (___member.id === message.member.id) return null;
        if (___member.id === message.author.id) return null;
        return ___member;
      })
      .filter((el) => el);

    const category = await message.guild.channels.create(category_name, {
      type: "GUILD_CATEGORY",
    });
    const meeting_voice = await message.guild.channels.create("Reunião", {
      type: "GUILD_VOICE",
      parent: category,
    });
    const meeting_media = await message.guild.channels.create("Mídia", {
      parent: category,
    });
    const sendInviteDM = async (member, msg) => {
      if (member.user.bot) return;
      const { code } = await meeting_voice.createInvite();
      await member.send(msg);
      return member.send(`https://discord.gg/${code}`);
    };
    parsedMembers.forEach((parsedMember) => {
      if (parsedMember.user.bot) return;
      const rest_of_members = parsedMembers.filter(
        (m) => m.id !== parsedMember.id
      );
      const members_msg = rest_of_members.map((m) => m.nickname || m.username);
      if (parsedMember.voice && !parsedMember.voice.channelId) {
        const msg1 = IDLE_MESSAGE.replace(
          "{host}",
          message.member.nickname || message.member.user.username
        ).replace("{nome_reuniao}", category_name);
        const msg = members_msg.length ? msg1 + " com " + members_msg : msg1;
        sendInviteDM(parsedMember, msg);
      }
      if (
        parsedMember.voice &&
        parsedMember.voice.channelId === LUNCH_CHANNEL
      ) {
        const msg1 = LUNCH_TIME_MESSAGE.replace(
          "{host}",
          message.member.nickname || message.member.user.username
        ).replace("{nome_reuniao}", category_name);
        const msg = members_msg.length ? msg1 + " com " + members_msg : msg1;
        sendInviteDM(parsedMember, msg);
        return;
      }
      if (parsedMember.voice.channelId)
        parsedMember.voice.setChannel(meeting_voice);
    });
    if (message.member.voice.channelId)
      message.member.voice.setChannel(meeting_voice);
  } catch (err) {
    console.error(err);
  }
}
module.exports = meet;

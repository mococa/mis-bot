const {
  LUNCH_CHANNEL,
  LUNCH_TIME_MESSAGE,
  IDLE_MESSAGE,
} = require("../constants");
const Meet = require("../controllers/meet");

async function meet(client, message, args) {
  try {
    //todo: s+meet :nome-da-reuniao: [...@mention] -> cria uma reuniao com esse nome e taca @mention nela
    //todo: s+meet stop :nome-da-reuniao: -> para uma reuniao com esse nome
    const history = Meet.getAll();
    const meeting_name = args.slice(
      0,
      args.findIndex((arg) => arg.startsWith("<@"))
    );
    const members = args
      .slice(meeting_name.length)
      .map((member) => member.slice(3, member.length - 1));
    let category_name = meeting_name.join(" ") || "Sem tema";

    if (category_name.startsWith("Sem tema")) {
      category_name +=
        history.filter((meet) => meet.name.startsWith("Sem tema")).length > 1
          ? +" " +
            history.filter((meet) => meet.name.startsWith("Sem tema")).length +
            1
          : "";
    } else if (history.find((meet) => meet.name === category_name)) {
      category_name += Math.floor(Math.random() * 20);
    }
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
    await new Promise.all(
      parsedMembers.forEach(async (parsedMember) => {
        if (parsedMember.user.bot) return;
        const rest_of_members = parsedMembers.filter(
          (m) => m.id !== parsedMember.id
        );
        const members_msg = rest_of_members.map(
          (m) => m.nickname || m.username
        );
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
      })
    );
    if (message.member.voice.channelId)
      message.member.voice.setChannel(meeting_voice);

    const meetNameOccurences =
      Meet.getAll()
        .map((m) => m.name)
        .filter((name) => name.startsWith(category_name)).length + 1;

    Meet.add({
      id: category.id,
      channels: [meeting_voice, meeting_media, category],
      name: category_name + (meetNameOccurences > 1 ? meetNameOccurences : ""),
    });

    console.log({ history: Meet.getAll() });
  } catch (err) {
    console.error(err);
  }
}
module.exports = meet;

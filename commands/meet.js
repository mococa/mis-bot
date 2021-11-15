const {
  LUNCH_CHANNEL,
  LUNCH_TIME_MESSAGE,
  IDLE_MESSAGE,
  UNAMED_MEET,
} = require("../constants");
const sendInviteDM = require("../functions/sendInvite");
const MeetModel = require("../models/Meet");

async function meet(client, message, args) {
  try {
    //todo: s+meet :nome-da-reuniao: [...@mention] -> cria uma reuniao com esse nome e taca @mention nela
    //todo: s+meet stop :nome-da-reuniao: -> para uma reuniao com esse nome
    const history = await MeetModel.find({active: true});
    const meeting_name = args.slice(
      0,
      args.findIndex((arg) => arg.startsWith("<@"))
    );
    const members = args
      .slice(meeting_name.length)
      .map((member) => member.slice(3, member.length - 1));
    let category_name = meeting_name.join(" ") || UNAMED_MEET;
    const meetNameOccurences =
      history
        .map((m) => m.name)
        .filter((name) => name.startsWith(category_name)).length + 1;

    if (category_name.startsWith(UNAMED_MEET)) {
      category_name += meetNameOccurences > 1 ? " " + meetNameOccurences : "";
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
    const previousChannels = [
      {
        id: message.author.id,
        channel: message.member.voice.channelId || "",
      },
    ];
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
    await Promise.all(
      parsedMembers.map(async (parsedMember) => {
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
          sendInviteDM(parsedMember, msg, meeting_voice);
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
          sendInviteDM(parsedMember, msg, meeting_voice);
          return;
        }
        if (parsedMember.voice.channelId) {
          previousChannels.push({
            id: parsedMember.id,
            channel: parsedMember.voice.channelId,
          });
          parsedMember.voice.setChannel(meeting_voice);
        }
      })
    );
    if (message.member.voice.channelId) {
      message.member.voice.setChannel(meeting_voice);
    }

    MeetModel.create({
      channels: [meeting_voice, meeting_media, category].map((chann) => ({
        id: chann.id,
      })),
      name: category_name,
      owner: message.author.id,
      members: previousChannels,
    });
  } catch (err) {
    console.error(err);
  }
}
module.exports = meet;

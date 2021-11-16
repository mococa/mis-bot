const {
  LUNCH_CHANNEL,
  LUNCH_TIME_MESSAGE,
  IDLE_MESSAGE,
  UNAMED_MEET,
} = require("../constants");
const Meet = require("../controllers/meet");
const addToMeet = require("../functions/addToMeet");
const membersFromArgs = require("../functions/membersFromArgs");
const sendInviteDM = require("../functions/sendInvite");
const MeetModel = require("../models/Meet");

async function meet(client, message, args) {
  try {
    //todo: s+meet :nome-da-reuniao: [...@mention] -> cria uma reuniao com esse nome e taca @mention nela
    //todo: s+meet stop :nome-da-reuniao: -> para uma reuniao com esse nome
    const history = await MeetModel.find({ active: true });
    const meeting_name = args.slice(
      0,
      args.findIndex((arg) => arg.startsWith("<@"))
    );
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
    const parsedMembers = await membersFromArgs(
      args.slice(meeting_name.length),
      { ignore: [message.member.id, message.author.id] }
    );
    const previousChannels = [
      {
        id: message.author.id,
        channel: message.member.voice.channelId || "",
      },
    ];
    const { category, meeting_voice, meeting_media } = await Meet.add(
      category_name
    );

    await Promise.all(
      parsedMembers.map(async (parsedMember) => {
        if (parsedMember.user.bot) return;
        await addToMeet(
          parsedMember,
          meeting_voice,
          message.member,
          meeting_name,
          parsedMembers
        );
        previousChannels.push({
          id: parsedMember.id,
          channel: parsedMember.voice.channelId || "",
        });
        return true;
      })
    );

    if (message.member.voice && message.member.voice.channelId) {
      message.member.voice.setChannel(meeting_voice);
    }

    await MeetModel.create({
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

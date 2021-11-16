const addToMeet = require("../functions/addToMeet");
const membersFromArgs = require("../functions/membersFromArgs");
const MeetModel = require("../models/Meet");

async function inviteMember(client, message, args = []) {
  if (!args.length) return;
  if (!message.member.voice) {
    console.error("Membro que tentou convidar não está em uma call");
    return;
  }
  if (!message.member.voice.channelId) {
    console.error("Canal de quem convidou aparemente não existe 🤔");
    return;
  }

  const members = await membersFromArgs(args, {
    ignore: [message.member.id, message.author.id],
  });
  console.log({ members });
  const channel = message.member.voice.channelId;

  const meet = await MeetModel.findOne(
    { channels: { $elemMatch: { id: channel } }, active: true },
    {},
    { sort: { createdAt: -1 } }
  );
  if (!meet) {
    console.error("Meet não encontrada 🥺");
    return;
  }
  console.log({ meet });
  await Promise.all(
    members.map(async (member) => {
      try {
        await addToMeet(member, channel, message.member, meet.name, members);
      } catch (err) {
        console.error(err.message);
      }
    })
  );
  await MeetModel.updateOne(
    {
      _id: meet._id,
    },
    {
      $set: {
        members: [
          ...meet.members,
          ...members
            .filter((el) => el)
            .map((member) => ({
              id: member.id || member.user.id,
              channel: member.voice.channelId,
            })),
        ],
      },
    }
  );
}
module.exports = inviteMember;

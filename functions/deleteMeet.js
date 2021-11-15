const { FALLBACK_CHANNEL } = require("../constants");
const MisBot = require("../controllers/discord");
const MeetModel = require("../models/Meet");

const deleteMeet = async (meet) => {
  if (!meet) return;
  //* Movendo usuários de volta para onde estavam
  await Promise.all(
    meet.members.map(async (memberObj) => {
      const channelFrom = await MisBot.getClient()
        .channels.fetch(memberObj.channel)
        .catch(() => false);
      return new Promise(async (res, rej) => {
        const member = MisBot.getClient()
          .guilds.cache.first()
          .members.cache.get(memberObj.id);
        try {
          if (!member) return res("skip: member not found");
          if (!member.voice) return res("skip: member has not voice property");
          if (member.voice.channelId !== meet.channels[0].id)
            return res("skip: member is not in this voice channel anymore");
          if (!channelFrom) {
            await member.voice.setChannel(FALLBACK_CHANNEL);
            return res("skip: channelFrom not found");
          }

          if (!channelFrom.deleted) {
            await member.voice.setChannel(memberObj.channel);
            return res(true);
          }
          await member.voice.setChannel(FALLBACK_CHANNEL);
        } catch (e) {
          if (member) await member.voice.setChannel(FALLBACK_CHANNEL);
          rej(e);
          console.error(e);
        }
      });
    })
  );
  //* Deletando meet
  await Promise.all(
    meet.channels.map(async (channel) => {
      return new Promise(async (res, rej) => {
        const fetchedChannel = MisBot.getClient().channels.cache.get(
          channel.id
        );
        await MeetModel.updateOne({ _id: meet._id }, { active: false });
        if (fetchedChannel)
          setTimeout(async () => {
            fetchedChannel.delete().then(res).catch(rej);
          }, 150);
      });
    })
  );
};
module.exports = deleteMeet;

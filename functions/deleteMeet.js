const MisBot = require("../controllers/discord");
const MeetModel = require("../models/Meet");

const deleteMeet = (meet) =>
  meet.channels.forEach(async (channel) => {
    const fetchedChannel = MisBot.getClient().channels.cache.get(channel.id); //.delete()
    if (fetchedChannel) setTimeout(() => fetchedChannel.delete(), 150);
    await MeetModel.updateOne({ _id: meet._id }, { active: false });
  });
module.exports = deleteMeet;

const Meet = require("../controllers/meet");
const deleteMeet = require("../functions/deleteMeet");
const { findOne } = require("../models/Meet");
const MeetModel = require("../models/Meet");

async function stop(client, message, args) {
  if (args.length) {
    if (args[0] === "all") {
      const meets = await MeetModel.find({ active: true });
      meets.forEach(async (meet) => {
        await deleteMeet(meet);
      });
    } else {
      const meet = await MeetModel.find({ name: args[0] });
      await deleteMeet(meet);
    }
  } else {
    //? no args passed
    const meet = await MeetModel.findOne(
      { owner: message.author.id },
      {},
      { sort: { createdAt: -1 } }
    );
    deleteMeet(meet);
  }
}
module.exports = stop;

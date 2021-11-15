const Meet = require("../controllers/meet");
const deleteMeet = require("../functions/deleteMeet");
const { findOne } = require("../models/Meet");
const MeetModel = require("../models/Meet");

async function stop(client, message, args) {
  if (args.length) {
    if (args[0] === "all") {
      if (!message.member.permissions.has(["ADMINISTRATOR"])) {
        message.reply({
          content: "Apenas gestores podem apagar todos os meets",
        });
        return;
      }
      const meets = await MeetModel.find({ active: true });
      await Promise.all(
        meets.map(async (meet) => {
          return new Promise(async (res, rej) => {
            await deleteMeet(meet);
            res(true);
          });
        })
      );
    } else {
      const meet = await MeetModel.findOne({
        name: args.join(" ").toLowerCase(),
        active: true,
      });
      await deleteMeet(meet);
    }
  } else {
    //? no args passed
    const meet = await MeetModel.findOne(
      { owner: message.author.id, active: true },
      {},
      { sort: { createdAt: -1 } }
    );
    deleteMeet(meet);
  }
}
module.exports = stop;

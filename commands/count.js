const MeetModel = require("../models/Meet");

async function count(client, message, args) {
  const meetCount = await MeetModel.countDocuments();
  message.reply({ content: "Já fizemos " + String(meetCount) + " meets" });
}
module.exports = count;

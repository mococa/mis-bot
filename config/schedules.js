const schedule = require("node-schedule");
const deleteMeet = require("../functions/deleteMeet");
const MeetModel = require("../models/Meet");

const schedules = () =>
  schedule.scheduleJob("*/1 * * * *", async function () {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    const meets = await MeetModel.find({
      active: true,
      createdAt: { $lt: start },
    });
    if (meets.length) console.log(`deleting ${meets.length} meets`);
    meets.forEach(deleteMeet);
  });

module.exports = schedules;

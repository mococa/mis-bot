const { model, Schema } = require("mongoose");

const MeetSchema = new Schema(
  {
    name: String,
    channels: [{ id: String }],
    owner: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const MeetModel = model("Meet", MeetSchema, "meets");
module.exports = MeetModel;

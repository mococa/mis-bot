const { model, Schema } = require("mongoose");

const MeetSchema = new Schema(
  {
    name: { type: String, lowercase: true },
    channels: [{ _id: false, id: String }],
    owner: String,
    active: { type: Boolean, default: true },
    members: [
      {
        _id: false,
        id: String,
        channel: String,
      },
    ],
  },
  { timestamps: true }
);
const MeetModel = model("Meet", MeetSchema, "meets");
module.exports = MeetModel;

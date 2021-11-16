const MisBot = require("./discord");

class Meet {
  meets = null;
  static async add(name) {
    const category = await MisBot.getGuild().channels.create(name, {
      type: "GUILD_CATEGORY",
    });
    const meeting_voice = await MisBot.getGuild().channels.create("Reunião", {
      type: "GUILD_VOICE",
      parent: category,
    });
    const meeting_media = await MisBot.getGuild().channels.create("Mídia", {
      parent: category,
    });
    return { category, meeting_voice, meeting_media };
  }
  static get(id) {
    if (!this.meets) this.meets = [];
    return this.meets.find((meet) => meet.id === id);
  }
  static getAll() {
    if (!this.meets) this.meets = [];
    return this.meets;
  }
  static remove(name) {
    if (!this.meets) this.meets = [];
    this.meets
      .find((meet) => meet.name.toLowerCase() === name.toLowerCase())
      .channels.forEach((channel) => {
        channel.delete();
      });
    this.meets = this.meets.filter(
      (meet) => meet.name.toLowerCase() !== name.toLowerCase()
    );
  }
}
module.exports = Meet;

const MisBot = require("./discord");

class Meet {
  meets = null;
  static add(meet) {
    if (!this.meets) this.meets = [];
    this.meets.push(meet);
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

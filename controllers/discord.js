class MisBot {
  client = null;
  static setClient(client) {
    this.client = client;
  }
  static getClient() {
    return this.client;
  }
  static login(token) {
    if (!client) return null;
    this.getClient().login(token);
  }
}
module.exports = MisBot;

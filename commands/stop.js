const Meet = require("../controllers/meet");

function stop(client, message, args) {
  Meet.remove(args[0]);
}
module.exports = stop;

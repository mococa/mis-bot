const {
  LUNCH_CHANNEL,
  LUNCH_TIME_MESSAGE,
  IDLE_MESSAGE,
} = require("../constants");
const MisBot = require("../controllers/discord");
const sendInviteDM = require("./sendInvite");

function addToMeet(member, channel, hostMember, meetName, membersWith) {
  const restOfMembers = membersWith
    .filter((m) => m.id !== member.id && m.user && !m.user.bot)
    .map((m) => m.nickname || m.username);

  if (!member)
    throw {
      message: "Membro não encontrado",
    };
  if (member.voice && member.voice.channelId === LUNCH_CHANNEL) {
    const msg1 = LUNCH_TIME_MESSAGE.replace(
      "{host}",
      hostMember.nickname || hostMember.user.username
    ).replace("{nome_reuniao}", meetName);
    const msg = restOfMembers.length ? msg1 + " com " + restOfMembers : msg1;
    sendInviteDM(member, msg, channel.id || channel || "");
    return;
  }
  if (member.voice && !member.voice.channelId) {
    const msg1 = IDLE_MESSAGE.replace(
      "{host}",
      hostMember.nickname || hostMember.user.username
    ).replace("{nome_reuniao}", meetName);
    const msg = restOfMembers.length ? msg1 + " com " + restOfMembers : msg1;
    sendInviteDM(member, msg, channel.id || channel || "");
    return;
  }

  if (!member.voice) {
    throw {
      message: { msg: "Membro não possui member.voice o.O", member },
    };
  }
  member.voice.setChannel(channel.id || channel || "");
}
module.exports = addToMeet;

const MisBot = require("../controllers/discord");

async function membersFromArgs(args, opt) {
  const members = args
    .filter((arg) => arg.startsWith("<@") && arg.endsWith(">"))
    .map((member) => member.slice(3, member.length - 1));
  return await Promise.all(
    members
      .map(async (member) => {
        if (opt && opt.ignore) {
          if (opt.ignore.includes(member)) return null;
        }
        const fetchedMember = await MisBot.getGuild().members.fetch(member);
        if (!fetchedMember) return null;
        return fetchedMember;
      })
      .filter((el) => el)
  );
}
module.exports = membersFromArgs;

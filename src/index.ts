import "dotenv/config";
import Discord, { MessageEmbed, Channel, TextChannel } from "discord.js";

const client = new Discord.Client();

client.login(process.env.DISCORD_API_KEY).then(() => {
  console.log("Ready");

  client.on("message", async (msg) => {
    if (msg.channel.id == process.env.WELCOME_CHANNEL) {
      if (msg.guild?.roles.highest.members.has(msg.author.id)) {
        const regex = msg.content.match(/ban (7\d{17}) (7\d{17})/i);
        if (regex) {
          let toBan: Discord.Message[] = [];
          console.log(regex[1], regex[2]);
          const highest = regex[1] > regex[2] ? regex[1] : regex[2];
          const low = regex[1] > regex[2] ? regex[2] : regex[1];
          let lowestReached = false;
          let lowestYet: number | undefined = undefined;
          while (!lowestReached) {
            await msg.channel.messages
              .fetch({
                limit: 50,
                before: lowestYet ? lowestYet : (BigInt(highest) + 1n).toString(),
              })
              .then((msgs) => {
                msgs.forEach((m) => {
                  if (lowestYet == undefined || lowestYet > +m.id) lowestYet = +m.id;

                  if (m.id >= low && m.id <= highest) toBan.push(m);
                  else if (m.id < low && !lowestReached) lowestReached = true;
                });
              });
          }
          console.log(toBan.map((r) => r.author.username));

          await msg.channel
            .send({
              content: `Are you sure? You are going to ban ${toBan.length} users who joined from ${toBan[toBan.length - 1].author.username}#${
                toBan[toBan.length - 1].author.discriminator
              } (\`${toBan[toBan.length - 1].createdAt.toUTCString()}\`) ${toBan[0].author.username}#${
                toBan[0].author.discriminator
              } to (\`${toBan[0].createdAt.toUTCString()}\`)`,
            })
            .then(async (m) => {
              await m.react("👍").then(() => m.react("👎"));

              const filter: Discord.CollectorFilter = (reaction, user) => {
                if (!msg.guild) return false;
                return ["👍", "👎"].includes(reaction.emoji.name) && (msg.guild?.roles.highest.members.has(user.id));
              };
              await m
                .awaitReactions(filter, {
                  max: 1,
                  time: 60000,
                  errors: ["time"],
                })
                .then(async (collected) => {
                  const reaction = collected.first();

                  if (!reaction || reaction.emoji.name !== "👍") return;
                  if (reaction.emoji.name === "👍") {
                    for (const userMessage of toBan) {
                      console.log(`Banning: ${userMessage.author.username}#${userMessage.author.discriminator} (${userMessage.author.id})`);
                      if (userMessage.guild)
                        await userMessage.guild.members.ban(userMessage.author.id, { days: 7, reason: "AntiBot, please contact an admin to be unbanned" });
                    }
                  }
                })
                .catch((e) => {});
              await m.delete();
              await msg.delete();
            });
        }
      }
    }
  });
});

const { MessageEmbed } = require("discord.js");
const { red_light } = require("../../colours.json");
const db = require("quick.db");
const { defaul_prefix } = require("../../botconfig.json");
const config = require('../../botconfig.json')

module.exports = {
    config: {
        name: "ban",
        description: "Bans a user from the guild!",
        usage: "-ban",
        category: "moderation",
        accessableby: "Administrators",
    },
    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;

        const embed1 = new MessageEmbed()
        .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
        .setDescription("I don't have enough permissions to do this command. \n - Please, give me permission -> ``BAN MEMBERS``")
        .setColor(0xd12828)

        const embed2 = new MessageEmbed()
        .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
        .setDescription("You don't have enough permissions to do this command. \n - Required permission -> ``BAN MEMBERS``")
        .setColor(0xd12828)

    if(!message.member.hasPermission(["BAN_MEMBERS"])) {
        message.channel.send(embed2)
        .then(m => m.delete({ timeout: 10000 }));
        return message.delete({ timeout: 10000 });
    }
        if(!message.guild.me.hasPermission(["BAN_MEMBERS"])) {
            message.channel.send(embed1)
            .then(m => m.delete({ timeout: 10000 }));
            return message.delete({ timeout: 10000 });
        }

        
   let banMember = message.guild.members.cache.get(args[0]) || message.mentions.members.first()

   const noreason = new MessageEmbed()
    .setDescription("Please provide a valid user to ban!")

   if(!banMember) {
    message.channel.send(noreason)
    .then(m => m.delete({ timeout: 10000 }));
    return message.delete({ timeout: 10000 });
}

   let reason = args.slice(1).join(" ");
   if(!reason) reason = "No reason given!"

   const embed4 = new MessageEmbed()
        .setDescription("You can't ban yourself!")

   if(banMember.id === message.author.id) {
    message.channel.send(embed4)
    .then(m => m.delete({ timeout: 10000 }));
    return message.delete({ timeout: 10000 });
}

   const embed3 = new MessageEmbed()
        .setDescription("You can't ban a moderator!")

   if(message.guild.member(banMember).hasPermission(["BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_GUILD", "MANAGE_CHANNELS", "KICK_MEMBERS"])) {
    message.channel.send(embed3)
    .then(m => m.delete({ timeout: 10000 }));
    return message.delete({ timeout: 10000 });
}
message.delete()
try {
    try {
        await banMember.send(`Hi, you were banned from \n **${message.guild.name}**! \n\n __**Reason:**__ \n ${reason}`)
    } catch(err) {
        let lawdw = await bot.channels.cache.get('627846724609769491');
        await lawdw.send("I can't send a message to this user, you can ignore this report..")
    }
    await message.guild.members.ban(banMember, { reason: reason})


   const banned = new MessageEmbed()
   .setTitle(":warning: BANNED")
   .setDescription(`User has been banned from this server! \n\n **Reason:** \n ${reason}\n\n[ ${banMember.user.tag} ]`)
   .setFooter(`Banned by ${message.author.tag}`)
   .setTimestamp()
   .setColor(red_light);
   message.channel.send(banned);


   let embeddw = new MessageEmbed()
   .setColor(red_light)
   .setAuthor(`Modlogs`)
   .addField("Moderation:", "Ban")
   .setThumbnail(message.guild.iconURL())
   .addField("Banned:", `${banMember.user.tag} [${banMember.id}]`)
   .addField("Moderator:", message.author.tag)
   .addField("Reason:", reason)
   .addField("Date:", message.createdAt.toLocaleString())
   
   let lawdw = await message.guild.channels.cache.get(config.logchannel)
        return lawdw.send(embeddw)

    } catch(err) {
        const embed33 = new MessageEmbed()
        .setDescription(`I don't have enough permissions to do this.. Maybe my role is below user's role, please fix it.`)

        return message.channel.send(embed33);
    }
}
}
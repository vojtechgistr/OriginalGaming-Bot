const { MessageEmbed } = require("discord.js");
const { red_light } = require("../../colours.json");
const db = require("quick.db");
const config = require('../../botconfig.json')

module.exports = {
    config: {
        name: "unban",
        description: "Unban a user from the guild!",
        usage: "-unban",
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

        if(!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) {
            message.channel.send(embed2)
            .then(m => m.delete({ timeout: 10000 }));
            return message.delete({ timeout: 10000 });
        }
        if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) {
            message.channel.send(embed1)
            .then(m => m.delete({ timeout: 10000 }));
            return message.delete({ timeout: 10000 });
        }

	const id = new MessageEmbed()
      .setDescription("You need to provide an valid ID.")

    const idprovide = new MessageEmbed()
      .setDescription("Please provide a valid user id to unban someone!")


  if(isNaN(args[0])) {
    message.channel.send(id)
    .then(m => m.delete({ timeout: 10000 }));
    return message.delete({ timeout: 10000 });
}

    let bannedMember = await bot.users.fetch(args[0])
        if(!bannedMember) {
            message.channel.send(idprovide)
            .then(m => m.delete({ timeout: 10000 }));
            return message.delete({ timeout: 10000 });
        }

    let reason = args.slice(1).join(" ")
        if(!reason) reason = "- No reason given -"

    const embed4 = new MessageEmbed()
    .setDescription("You're not banned!")


    if(bannedMember.id === message.author.id) {
        message.channel.send(embed4)
        .then(m => m.delete({ timeout: 10000 }));
        return message.delete({ timeout: 10000 });
    }

    message.delete()
    try {
        await message.guild.members.unban(bannedMember, reason);

        const unbasnned = new MessageEmbed()
            .setTitle(":warning: UNBANNED")
            .setDescription(`${bannedMember.tag} has been unbanned from this server! \n\n[ ${message.author} ]`)
            .setFooter(`Unbanned by ${message.author.tag}`)
            .setTimestamp()
            .setColor(red_light);
            message.channel.send(unbasnned)

        let embeddw = new MessageEmbed()
        .setColor(red_light)
        .setAuthor(`Modlogs`)
        .setThumbnail(message.guild.iconURL())
        .addField("Moderation:", "Unban")
        .addField("Unbanned:", `${bannedMember.tag} [${bannedMember.id}]`)
        .addField("Moderator:", message.author.tag)
        .addField("Date:", message.createdAt.toLocaleString());
        
        let lawdw = await message.guild.channels.cache.get(config.logchannel)
        return lawdw.send(embeddw)

    } catch(err) {
        if (err.code === 10026) {
            let dwnj = new MessageEmbed()
            .setDescription("This user is not banned!")

            return message.channel.send(dwnj);
        } else if (err.code === 50013) {
            const embed33 = new MessageEmbed()
            .setDescription(`I don't have enough permissions to do this.. Maybe my role is below user's role, please fix it.`)
    
            return message.channel.send(embed33);
        }
    }

    }
}
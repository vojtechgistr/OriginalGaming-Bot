const { MessageEmbed } = require("discord.js")
const { cyan } = require("../../colours.json");
const db = require("quick.db")

const moment = require('moment')

module.exports = {
    config: {
        name: "user-info",
        description: "Pulls the user info!",
        usage: "-user-info",
        category: "basic",
        accessableby: "Members",
        aliases: ["ui", "userinfo"]
    },

    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;
    
        let cannotfind = new MessageEmbed()
            .setDescription("User is not on this server!")
            .setColor(cyan);

        let botuserlmao = new MessageEmbed()
            .setDescription("Bot is not a real person! Try someone else..")
            .setColor(cyan);


    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!args[0]) {
        user = message.guild.members.cache.get(message.author.id)
    }

    if(!user) {
         message.channel.send(cannotfind)
        .then(m => m.delete({ timeout: 30000 }));
    message.delete({ timeout: 30000 });
    return;
    }

    if(user.user.bot) {
        message.channel.send(botuserlmao)
        .then(m => m.delete({ timeout: 30000 }));
            message.delete({ timeout: 30000 });
            return;
    }

    let blacklist = await db.fetch(`blacklist_${user.id}`);
    if(blacklist === null) {
        await db.set(`blacklist_${user.id}`, "Not");
    }

    if(blacklist === "Blacklisted") blacklist = "Yes";
    if(blacklist === "Not") blacklist = "No";

    let nickname = user ? user.displayName : null;
    if(nickname === null) nickname = "None"

    rolee = user.roles.highest

    let sEmbed = await new MessageEmbed()
        .setColor(cyan)
        .setTitle("User Informations")
        .setThumbnail(user.user.displayAvatarURL())
        .addField("**Name:**", `${user.user.username}`, true)
        .addField("**Nickname:**", `${nickname}`, true)
        .addField("**Tag:**", `${user.user.discriminator}`, true)
        .addField("**ID:**", `${user.user.id}`, true)
	    .addField("**Avatar:**", `[Link to avatar](${user.user.displayAvatarURL({ dynamic: true })})`, true)
        .addField("**Game:**", `${user.presence.game || 'Not playing a game'}`, true)
        .addField("**Blacklisted:**", `${blacklist}`, true)
        .addField("**Joined on this server:**", `<t:${Math.trunc(message.member.guild.members.cache.get(user.id).joinedAt.getTime()/1000)}>`, true)
        .addField("**Account Created at:**", `<t:${Math.trunc(message.member.guild.members.cache.get(user.id).user.createdAt.getTime()/1000)}>`, true)
        .addField("**Highest server role:**", rolee, true)
        .setFooter(`Requested by ${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL());
    message.channel.send(sEmbed);
    }
}

const { MessageEmbed } = require('discord.js');
const { red_light } = require("../../colours.json");
const db = require("quick.db");
const config = require('../../botconfig.json')

module.exports = {
    config: {
        name: "freeze",
        description: "Freezes current channel!",
        category: "moderation",
        accessableby: "Administrators",
        aliases: ["lock"]
    },
    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;

        const embed1 = new MessageEmbed()
        .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
        .setDescription("I don't have enough permissions to do this command. \n Please, give me permission -> ``ADMINISTRATOR``")
        .setColor('#d12828');
        
        const embed2 = new MessageEmbed()
        .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
        .setDescription("You don't have enough permissions to use this command. \n - Required permission -> ``MANAGE CHANNELS``")
        .setColor('#d12828');


        if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
            message.channel.send(embed1)
            .then(m => m.delete({ timeout: 7000 }));
            return message.delete({ timeout: 7000 });
        }
        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            message.channel.send(embed2)
            .then(m => m.delete({ timeout: 7000 }));
            return message.delete({ timeout: 7000 });
        }

        const embed = new MessageEmbed()
        .setTitle("<:disagree:782705809359765526> CLOSED <:disagree:782705809359765526>")
        .setTimestamp()
        .setColor(red_light)
        .setFooter(`Requested by ${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
        .setDescription(`This room have been temporarily closed\n\n[ ${message.author} ]`);

        await message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });

        message.channel.send(embed);
        message.delete();


        let embeddw = new MessageEmbed()
        .setColor(red_light)
        .setAuthor(`Modlogs`)
        .setThumbnail(message.guild.iconURL())
        .addField("Moderation:", "Freeze")
        .addField("Channel", `${message.channel}`)
        .addField("Moderator:", message.author.tag)
        .addField("Date:", message.createdAt.toLocaleString())

        let lawdw = await message.guild.channels.cache.get(config.logchannel)
        return lawdw.send(embeddw)
  }
    
}
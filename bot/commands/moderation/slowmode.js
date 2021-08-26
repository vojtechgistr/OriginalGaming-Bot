const { MessageEmbed } = require('discord.js');
const { blue_light, red_light } = require('../../colours.json');
const db = require("quick.db");
const { default_prefix } = require('../../botconfig.json');
const config = require('../../botconfig.json')

module.exports = { 
    config: {
        name: "slowmode",
        usage: "-slowmode",
        category: "moderation",
        accessableby: "Member",
        aliases: ["slow", "setslow", "setslowmode"]
    },
    run: async (bot, message, args) => {

        const warne = bot.emojis.cache.get('715481249082245141');

        let prefix = db.get(`prefix_${message.guild.id}`)
        if(prefix === null) prefix = default_prefix;

        const embed = new MessageEmbed()
            .setDescription(`You did not specify the time in seconds you wish to set this channel's slow mode too!\n\n${warne} **__Usage__:**\n\`${prefix}slowmode [seconds]\``)

        const em = new MessageEmbed()
            .setDescription(`Please provide an number between 0 and 2160! (seconds)\n\n${warne} **__Usage__:**\n\`${prefix}slowmode [seconds]\``)



        if(!args[0]) {
            message.channel.send(embed)
            .then(m => m.delete({ timeout: 10000 }))
            return message.delete({ timeout: 10000 });
        }

        if(isNaN(args[0])) {
            message.channel.send(em)
            .then(m => m.delete({ timeout: 10000 }))
            return message.delete({ timeout: 10000 });
        }

        if(args[0] >= 2161) {
            message.channel.send(em)
            .then(m => m.delete({ timeout: 10000 }))
            return message.delete({ timeout: 10000 });
        }

        if(args[0] < 0) {
            message.channel.send(em)
            .then(m => m.delete({ timeout: 10000 }))
            return message.delete({ timeout: 10000 });
        }

        let reason = args.slice(1).join(' ');
        if(!reason) reason = "- No reason given -";

        message.channel.setRateLimitPerUser(args[0], reason);

        try {

            const slow = new MessageEmbed()
            .setTitle(`🐢 Slowmode set`)
            .setDescription(`Slowmode has been set to **\`${args[0]}\`**\`seconds\`\n\n[ ${message.author} ]`)
            .setColor(blue_light)

            message.channel.send(slow)
            message.delete()

            let embeddw = new MessageEmbed()
            .setColor(red_light)
            .setAuthor(`Modlogs`)
            .setThumbnail(message.guild.iconURL())
            .addField("Moderation:", "Slowmode")
            .addField("Moderator:", message.author.tag)
            .addField("Duration", args[0])
            .addField("Reason", reason)
            .addField("Channel", message.channel)
            .addField("Date:", message.createdAt.toLocaleString())

            let lawdw = await message.guild.channels.cache.get(config.logchannel)
            return lawdw.send(embeddw)

    } catch(err) {
        console.log(err);
        const embed33 = new MessageEmbed()
                .setDescription(`I don't have enough permissions to do this.. please fix it or contact the bot developer if your permissions are 100% correctly set up.`)
                return message.channel.send(embed33);
    }

    }
}
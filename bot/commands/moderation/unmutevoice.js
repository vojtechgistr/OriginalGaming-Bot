const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { red_light } = require('../../colours.json');
const config = require('../../botconfig.json')

module.exports = {
    config: {
        name: "unmutevoice",
        description: "Mute all users in Voice Channel!",
        usage: "ok unmutevoice",
        category: "antiraid",
        accessableby: "Administrators",
        aliases: ["unvoicemute", "unvm", "unmv", "voiceunmute", "vunm", "unmv"]
    },
    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;

        const embed1 = new MessageEmbed()
        .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
        .setDescription("I don't have enough permissions to do this command. \n - Please, give me permission -> ``ADMINISTRATOR``")
        .setColor('#d12828');

        const embed2 = new MessageEmbed()
        .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
        .setDescription("You don't have enough permissions to do this command. \n - Required permission -> ``MANAGE CHANNELS``")
        .setColor('#d12828');

        if(!message.member.hasPermission(["MANAGE_CHANNELS"])) {
            message.channel.send(embed2)
            .then(m => m.delete({ timeout: 7000 }));
            return message.delete({ timeout: 7000 });
    }
            
        if(!message.guild.me.hasPermission(["ADMINISTRATOR"])) {
            message.channel.send(embed1)
        .then(m => m.delete({ timeout: 7000 }));
        return message.delete({ timeout: 7000 });
}

        let channel = message.member.voice.channel;
        
        if(!channel) {
            const er = new MessageEmbed()
                .setDescription(`You are not in any voice channel!`)
            return message.channel.send(er)
        }

            for (let member of channel.members) {
                member[1].voice.setMute(false)
            }

            message.channel.send('<:agree:782705809142448159> Voice has been unmuted')
            const logs = require('../../botconfig.json');
            const default_logs = require('../../botconfig.json');
    
            let channellog = db.get(`logging_${message.guild.id}`)
                if(channellog === null) {
                    channellog = default_logs;
                }
                if(channellog === "none") return;
                
            let section2 = db.get(`logs_${message.guild.id}`) //section logs - on/off
            if(section2 === null) section2 = logs;
            if(section2 === "false") return;
        let embeddw = new MessageEmbed()
        .setColor(red_light)
        .setAuthor(`Modlogs`)
        .setThumbnail(message.guild.iconURL())
        .addField("Moderation:", "Unmuted Voice")
        .addField("Moderator:", message.author.tag)
        .addField("Date:", message.createdAt.toLocaleString())
        
        let lawdw = await message.guild.channels.cache.get(config.logchannel)
        return lawdw.send(embeddw)
    }
}
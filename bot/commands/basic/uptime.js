const { MessageEmbed } = require("discord.js");
const moment = require("moment");
         require("moment-duration-format");

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "uptime",
        usage: "-uptime",
        aliases: ["ut"],
        category: "basic",
        accessableby: "Members",
    },

    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;
        if(message.author.bot) return;

        const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

        let embed = new MessageEmbed()
        .setTitle(`Bot's uptime is now:`)
        .setDescription(`:clock1: ${duration}`)
        return message.inlineReply(embed);
    
}
}
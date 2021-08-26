const { MessageEmbed } = require('discord.js');
const { cyan } = require("../../colours.json");
require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "support",
        description: "Shows support server",
        usage: "-support",
        category: "basic",
        accessableby: "Members",
    },
    run: async (bot, message, args) => {
        if(message.author.bot) return;
        if(message.channel.type === "dm") return;

        let i = bot.guilds.cache.get('462649794637070347');

        if(message.guild.id == i) return message.inlineReply("Sorry, but this is the support server for this bot!")
        const embed = new MessageEmbed()
        .addField("__**Bot's Support Server:**__", `https://discord.gg/ZhZcruFq2W`)
        .setDescription("Do you have any questions? Right!")
        .setThumbnail(i.iconURL())
        .setColor(cyan);
        return message.inlineReply(embed)
    }
}
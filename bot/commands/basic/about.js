const { MessageEmbed } = require("discord.js");
const { default_prefix } = require("../../botconfig.json");
const { gold } = require('../../colours.json');
require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "about",
        usage: "-about",
        category: "basic",
        accessableby: "Members",
    },
    run: async (bot, message, args) => {

        let embed = new MessageEmbed()
            .setTitle('Ultimate Power')
            .setColor(gold)
            .setThumbnail(bot.user.displayAvatarURL())
            .setDescription("A custom Discord bot made for Original Gaming community.\nOffers custom-made Journey command, a part of it's economy.\n\n[Home Discord Server](https://discord.gg/SuQtPvFUhM)\n[Support Server](https://discord.gg/dxyfc22)")
            .setFooter(`Coded by: ${bot.users.cache.get(`484448041609199620`).tag}`, bot.users.cache.get(`484448041609199620`).displayAvatarURL({dynamic: true}))
            return message.inlineReply(embed)
    }
   
}
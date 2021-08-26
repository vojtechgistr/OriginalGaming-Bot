const { MessageEmbed } = require("discord.js")
const { default_prefix } = require("../../botconfig.json");
require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "thanksgiving",
        usage: "-thanksgiving",
        category: "basic",
        aliases: ["thanksto", "thanks to", "thanks-to", "thanks-giving", "thx"],
        accessableby: "Members",
    },
    run: async (bot, message, args) => {

    const em = new MessageEmbed()
    .setTitle('Thanks to everyone below who participated in this project')
    .addField(`__Developers__`, `[${bot.users.cache.get('484448041609199620').tag}](https://github.com/VojtaG), ${bot.users.cache.get('279312833005486081').tag}`)
    .addField(`__Designers__`, `${bot.users.cache.get('197027942201556992').tag}, Jiří­ Bednář`)
    .addField(`__Translators__`, `${bot.users.cache.get('283522883890708480').tag}, ${bot.users.cache.get('208176742714572801').tag}, ${bot.users.cache.get('463414081286570005').tag}`)
    .addField(`__Journey Tale Creators__`, `${bot.users.cache.get('279312833005486081').tag}, ${bot.users.cache.get('204963159340089345').tag}, ${bot.users.cache.get('336844582199230466').tag}, ${bot.users.cache.get('419494227081297920').tag}`)
    .addField(`__Beta Testers__`, `${bot.users.cache.get('297059785155543041').tag}, ${bot.users.cache.get('419494227081297920').tag}, ${bot.users.cache.get('212521097155837952').tag}, ${bot.users.cache.get('301789389359677440').tag}`)
    return message.inlineReply(em);
    }
   
}
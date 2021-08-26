const { MessageEmbed } = require("discord.js");
const { gold } = require('../../colours.json');
require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "ping",
        usage: "-ping",
        category: "basic",
        accessableby: "Members",
    },
    run: async (bot, message, args) => {

            message.inlineReply(`🏓 | Latency is: **${Date.now() - message.createdTimestamp}ms.**, API Latency is: \`${Math.round(bot.ws.ping)}ms\``);
    }
}
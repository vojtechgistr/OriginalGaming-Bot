const { MessageEmbed } = require("discord.js")
const { orange } = require("../../colours.json");
const db = require("quick.db")

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "8ball",
        usage: "-8ball",
        category: "fun",
        aliases: ["ball", "magicball", "eightball"],
        accessableby: "Members",
    },

    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;

        const embedaw = new MessageEmbed()
        .setDescription(`Please ask a full question!`)

        if(!args[1]) return message.inlineReply(embedaw)
        let replies = ["Yes", "No", "I don't know", "I don't care", "Ask me later", "Definitely", "Idk bro, I'm dumb", "Do NOT ask me again pls, your questions are stupid"];

        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(0).join(" ");

      const embed = new MessageEmbed()
        .addField(`__Question__:`, question)
        .addField(`__Answer__:`, replies[result])
        .setColor(orange)

      message.inlineReply(embed)
    
}
}
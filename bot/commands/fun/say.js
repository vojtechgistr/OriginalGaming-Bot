const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const { red_light } = require('../../colours.json');

module.exports = {
    config: {
        name: "say",
        category: "fun",
        asseccableby: "Members",
        usage: "-say",
        aliases: ["tell"]
    },
    run: async (bot, message, args) => {

        const mess = args.join(" ");
        message.delete().catch(O_o=>{});
        message.channel.send(mess);
        try {
            message.delete().catch(O_o=>{});

                    let embeddw = new MessageEmbed()
                    .setColor(red_light)
                    .setAuthor(`Modlogs`)
                    .setThumbnail(message.guild.iconURL())
                    .addField("Moderation:", "Say [ normal message ]")
                    .addField("Author:", message.author.tag)
                    .addField("Message:", mess)
                    .addField("Date:", message.createdAt.toLocaleString())
                
                    let loginchannel = bot.channels.cache.get('627846724609769491');
                    loginchannel.send(embeddw)
            
                    } catch(err) {
                        const embed33 = new MessageEmbed()
                                .setDescription(`Something went wrong while logging this action, contact the developer of this bot!`)
                                return message.channel.send(embed33);
                    }
            }
    }
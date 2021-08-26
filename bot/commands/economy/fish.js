const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ms = require('parse-ms');

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "fish",
        category: "economy",
        accessableby: "Members",
        aliases: ["catch"],
    },
    run: async (bot, message, args) => {
        let bal = await db.fetch(`money_${message.author.id}`)
        if (bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.author.id}`)
        if (bank === null) bank = 0;

        let timeout = 60000;
        let fish = await db.fetch(`fish_${message.author.id}`)

        if (fish != null && timeout - (Date.now() - fish) > 0) {
            let time = ms(timeout - (Date.now() - fish));
            return message.inlineReply(`**Calm down!** You have to wait **${time.seconds}** more seconds to use this command again.`);

        } else {

            var randomNum = Math.floor(Math.random() * 100) + 1

            if (randomNum < 50) {
                const phraseList = [
                    "Damn..",
                    "You dumbass",
                    "Dang..",
                    "Oooooooof",
                    "Ahhh, noooo!",
                    "Again?"
                ]

                var randomPhrase = Math.floor(Math.random() * phraseList.length)
                const manaCount = Math.round(Math.random() + 2) + 1

                var dataEmbed = new MessageEmbed()
                    .setTitle(`🎣 ${phraseList[randomPhrase]} <:disagree:782705809359765526>`)
                    .setDescription(`Your fish has disappeared.. Maybe next time :sparkles:\n\n**__You paid for the bait:__**\n${manaCount} <:Mana:627845086851629056>`)
                    .setColor('0x0000FF')

                    
                db.add(`money_${message.author.id}`, manaCount * -1);
                db.set(`fish_${message.author.id}`, Date.now());
                return message.inlineReply(dataEmbed)

            } else {
                const randomCm = Math.ceil(Math.random() * 90) + 30
                const manaCount = Math.round(randomCm * 0.1)

                var dataEmbed = new MessageEmbed()
                    .setTitle(`🎣 Catcha! 🐟`)
                    .setDescription(`You caught a fish, that measures ${randomCm}cm! Good job fisherman :tropical_fish:\n\n**__You sold it for:__**\n${manaCount} <:Mana:627845086851629056>`)
                    .setColor('0x0000FF')

                db.add(`money_${message.author.id}`, manaCount);
                db.set(`fish_${message.author.id}`, Date.now());
                return message.inlineReply(dataEmbed)
            }
        }

    }
}
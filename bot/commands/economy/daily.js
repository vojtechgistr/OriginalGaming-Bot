const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ms = require('parse-ms');
const { ec } = require('../../colours.json');

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "daily",
        category: "economy",
        accessableby: "Members",
    },
    run: async (bot, message, args) => {
        let timeout = 86400000;
        let amount = Math.floor(Math.random() * (300 - 180 + 1)) + 180;
        
        let daily = await db.fetch(`daily_${message.author.id}`)

        if(daily != null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));
            return message.inlineReply(`You've already collected your daily award. Come back in ${time.hours} hours and ${time.minutes} minutes...`);

        } else {
            let time = ms(timeout - (Date.now() - daily));
            db.set(`daily_${message.author.id}`, Date.now());
            db.add(`money_${message.author.id}`, amount);

            let embed = new MessageEmbed()
            .setTitle(`Daily Reward Collected`)
            .setColor(ec)
            .setDescription(`You've received ${amount}<:Mana:627845086851629056> mana!`)
            .setFooter(`Next daily reward can be claimed in 24 hours`)
            .setTimestamp();
            
            await message.inlineReply(embed);
        }
    }
}
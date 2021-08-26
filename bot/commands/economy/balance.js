const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "balance",
        category: "economy",
        accessableby: "Members",
        aliases: ["bank", "money", "bal", "total", "mana", "wallet"],
    },
    run: async (bot, message, args) => {
        const user = message.mentions.users.first() || message.author;

        if(user.bot) return message.inlineReply(`Bots can't be part of this economy!`);

        let bal = await db.fetch(`money_${user.id}`)
        if(bal === null) bal = 0;

        let bank = await db.fetch(`bank_${user.id}`)
        if(bank === null) bank = 0;

        let embed = new MessageEmbed()
        .setTitle(`${user.username}'s mana`)
        .setDescription(`**Wallet:** ${bal}\n**Bank:** ${bank}\n**Total:** ${bal + bank}<:Mana:627845086851629056>`)
        .setColor(0x994C00)
        message.inlineReply(embed)
    }
}
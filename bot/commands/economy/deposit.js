const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { default_prefix } = require('../../botconfig.json')
const { ec } = require('../../colours.json')

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "deposit",
        category: "economy",
        accessableby: "Members",
        aliases: ["dep"],
    },
    run: async (bot, message, args) => {
        let bal = await db.fetch(`money_${message.author.id}`)
        if(bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.author.id}`)
        if(bank === null) bank = 0;

        if(args[0] === "all") {

            if(bal < args[0]) return message.inlineReply(`You can't generate money, dumbass! Make some money first and then you can deposit it into your bank account.`);
        if(args[0] === "0") {
            return message.inlineReply(`You can't deposit 0 money.. Just think bro`);

        } else {
            db.add(`money_${message.author.id}`, bal - bal - bal);
            db.add(`bank_${message.author.id}`, bal);
    
            let embed = new MessageEmbed()
                .setTitle(`Money was deposited`)
                .setColor(ec)
                .setDescription(`Successfully deposited ${bal}<:Mana:627845086851629056> to your bank account!`)
                .setTimestamp();
                
                await message.inlineReply(embed).then(m => {
                    m.react('<:agree:782705809142448159>')
                });
                return;
            }
        }
        if (isNaN(args[0]) || parseInt(args[0]) < 0) return message.inlineReply(`You can deposit only mana and not anything else! Please type a number.\n**Usage ->** \`${default_prefix}deposit [amount of mana | all]\``)


        if(bal < args[0]) return message.inlineReply(`You can't generate money, dumbass! Make some money first and then you can deposit it into your bank account.`);
        if(args[0] === "0") {
            return message.inlineReply(`You can't deposit 0 money.. Just think bro`);

        } else {
            let todep = parseInt(args[0]);
            db.add(`money_${message.author.id}`, todep - todep - todep);
            db.add(`bank_${message.author.id}`, todep);
    
            let embed = new MessageEmbed()
                .setTitle(`Money was deposited`)
                .setColor(ec)
                .setDescription(`Successfully deposited ${args[0]}<:Mana:627845086851629056> to your bank account!`)
                .setTimestamp();
                
                await message.inlineReply(embed);
        }
    }
}
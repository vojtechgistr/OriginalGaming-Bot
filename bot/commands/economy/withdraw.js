const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { default_prefix } = require('../../botconfig.json')
const { ec } = require('../../colours.json')

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "withdraw",
        category: "economy",
        accessableby: "Members",
        aliases: ["wd", "with"],
    },
    run: async (bot, message, args) => {
        let bal = await db.fetch(`money_${message.author.id}`)
        if(bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.author.id}`)
        if(bank === null) bank = 0;

        if(args[0] === "all") {

            if(bank < args[0]) return message.inlineReply(`You can't generate money, dumbass! Make some money first and then you can withdraw it from your bank account.`);
        if(args[0] === "0") {
            return message.inlineReply(`You can't withdraw 0 money.. Just think bro`);

        } else {
            
            db.add(`bank_${message.author.id}`, bank * -1);
            db.add(`money_${message.author.id}`, bank);
    
            let embed = new MessageEmbed()
                .setTitle(`Money was withdrew`)
                .setColor(ec)
                .setDescription(`Successfully withdrew ${bank}<:Mana:627845086851629056> from your bank account!`)
                .setTimestamp();
                
                await message.inlineReply(embed).then(m => {
                    m.react('<:agree:782705809142448159>')
                });
                return;
            }
        }
        if (isNaN(args[0]) || parseInt(args[0]) < 0) return message.inlineReply(`You can withdraw only mana and not anything else! Type a number please.\n**Usage ->** \`${default_prefix}withdraw [amount of mana | all]\``)


        if(bank < args[0]) return message.inlineReply(`You can't generate money, dumbass! Make some money first and then you can withdraw it from your bank account.`);
        if(args[0] === "0") {
            return message.inlineReply(`You can't withdrew 0 money.. Just think bro`);

        } else {
        let tosend = parseInt(args[0]);

            db.add(`bank_${message.author.id}`, tosend - tosend - tosend);
            db.add(`money_${message.author.id}`, tosend);
    
            let embed = new MessageEmbed()
                .setTitle(`Money was withdrew`)
                .setColor(ec)
                .setDescription(`Successfully withdrew ${args[0]}<:Mana:627845086851629056> from your bank account!`)
                .setTimestamp();
                
                await message.inlineReply(embed);
        }
    }
}
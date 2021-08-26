const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { default_prefix } = require('../../botconfig.json')
const { ec } = require('../../colours.json')

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "pay",
        category: "economy",
        accessableby: "Members",
        aliases: ["send", "givemoney", "give", "donate"],
    },
    run: async (bot, message, args) => {
        
        const user = message.mentions.users.first() || message.guild.members.cache.find(user => user.username === args[0]) || message.guild.members.cache.get(args[0]);

        if(!args[0]) return message.inlineReply(`Please mention someone, or just enter member's ID or username.\n**Usage ->** \`${default_prefix}pay [user] [amount of mana]\``)
        
        if(!user) return message.inlineReply(`Sorry, but I can't find this user.. Try it again\n**Usage ->** \`${default_prefix}pay [user] [amount of mana]\``)

        if (isNaN(args[1]) || parseInt(args[1]) <= 99) return message.inlineReply(`You can give only mana and not anything else! Type a number higher than 100.\n**Usage ->** \`${default_prefix}pay [user] [amount of mana]\``)

        if(user.bot) return message.inlineReply(`Bots can't be part of this economy!`);

        let bal = await db.fetch(`money_${message.author.id}`)
        if(bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.author.id}`)
        if(bank === null) bank = 0;

        if(bal < args[1]) return message.inlineReply(`You can't generate money, dumbass! Make money first and then you can give it to someone.`)

        let tosend = parseInt(args[1]);
        db.add(`money_${message.author.id}`, tosend - tosend - tosend);
        db.add(`money_${user.id}`, tosend);

        let embed = new MessageEmbed()
            .setTitle(`Money was sent`)
            .setColor(ec)
            .setDescription(`${user} received ${args[1]}<:Mana:627845086851629056> from ${message.author}!`)
            .setTimestamp();
            
            await message.inlineReply(embed).then(m => {
                m.react('<:agree:782705809142448159>')
            });
    }
}
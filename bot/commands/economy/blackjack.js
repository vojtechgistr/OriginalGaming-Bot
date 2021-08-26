const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { default_prefix } = require('../../botconfig.json');
const { ec, red_light, green_light } = require('../../colours.json');
const ms = require('parse-ms');

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "blackjack",
        category: "economy",
        aliases: ["bj"],
        accessableby: "Members",
    },
    run: async (bot, message, args) => {
        let timeout = 37000;

        
        let bj = await db.fetch(`bj_${message.author.id}`)

        if(bj != null && timeout - (Date.now() - bj) > 0) {
            let time = ms(timeout - (Date.now() - bj));
            return message.inlineReply(`**Calm down!** You have to wait **${time.seconds}** more seconds to use this command again.`);

        } else {

        if(!message.guild.me.hasPermission("ADD_REACTIONS")) return message.reply("I do not have the permission to add reactions.")


        let bal = await db.fetch(`money_${message.author.id}`)
        if(bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.author.id}`)
        if(bank === null) bank = 0;

        if (isNaN(args[0]) || parseInt(args[0]) < 0) return message.inlineReply(`Please place a bet! The bet must be higher than 100<:Mana:627845086851629056> mana.\n**Usage ->** \`${default_prefix}blackjack [amount of mana]\``)


        if(bal < args[0]) return message.inlineReply(`You can't generate money, dumbass! Make some money first and then you can place a bet..`);
        if(args[0] < 100) {
            return message.inlineReply(`The bet must be higher than 100<:Mana:627845086851629056> mana! If you don't have enough mana you can start working.`);
        }

        if(!args[0]) return message.inlineReply(`Please place a bet! The bet must be higher than 150<:Mana:627845086851629056> mana.\n**Usage ->** \`${default_prefix}blackjack [amount of mana]\``)
        

        if(args[0] > 1000) return message.inlineReply(`The bet must be lower than 1000<:Mana:627845086851629056> mana!`)

        let bet = parseInt(args[0])

        let playerCard1 = Math.floor(Math.random() * 11) + 2;
        let playerCard2 = Math.floor(Math.random() * 11) + 2;
        let botCard1 = Math.floor(Math.random() * 11) + 2;
        let botCard2 = Math.floor(Math.random() * 11) + 2;
        let playerTotal = playerCard1 + playerCard2;
        let botTotal = botCard1 + botCard2;
        let playerArray = [];
        let botArray = [];

        for(var i = 0;i < 10;i++) {
           if(playerTotal > 11) {
            playerCard1 = Math.floor(Math.random() * 11) + 2;
            playerCard2 = Math.floor(Math.random() * 11) + 2;
            playerTotal = playerCard1 + playerCard2
        }
            if(botTotal > 15) {
                botCard1 = Math.floor(Math.random() * 11) + 2;
                botCard2 = Math.floor(Math.random() * 11) + 2;
                botTotal = botCard1 + botCard2
            } 
        }
        


        playerArray.push(playerCard1);
        playerArray.push(playerCard2);
        botArray.push(botCard1);
        botArray.push(botCard2);

        db.set(`bj_${message.author.id}`, Date.now());

        let embed = new MessageEmbed()
        .setTitle(`:black_joker: ${message.author.username}'s Blackjack Game`)
        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerCard1}\`](https://discord.com/) [\`${playerCard2}\`](https://discord.com/)\nTotal: \`${playerTotal}\``, true)
        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botCard1}\`](https://discord.com/) [\`?\`](https://discord.com/)**\nTotal: \`?\``, true)
        .setColor(ec)
        .setDescription('React `H` to **hit** or `S` to **stand**');
        
        message.inlineReply(embed).then(async msg => {
            msg.react("<:Hit:783236986974240808>").then(async r => {
                msg.react("<:Stand:783236686657617972>")

                const standFilter = (reaction, user) =>
                    reaction.emoji.name === "Stand" && user.id === message.author.id;
                const hitFilter = (reaction, user) =>
                    reaction.emoji.name === "Hit" && user.id === message.author.id;


                const stand = msg.createReactionCollector(standFilter, {
                    time: 60000
                });
                const hit = msg.createReactionCollector(hitFilter, {
                    time: 60000
                });

                let sum2 = botArray.reduce(function (a, b) {
                    return a + b;
                }, 0);
                let botCount;
                botCount = sum2;
                
                
                let sum1 = playerArray.reduce(function(a, b) {
                    return a + b;
                }, 0);
                let playerCount;
                playerCount = sum1;

                
                if(playerCount > 21 && botCount > 21) {
                    embed.fields = [];
                    embed
                    .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                    .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                    .setColor(red_light)
                    .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                    hit.stop();
                    stand.stop();
                    msg.edit(embed);
                    await msg.reactions.removeAll();
                    return db.add(`money_${message.author.id}`, bet - bet - bet);

                } else if(playerCount === 21 && botCount < 21) {
                    embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(green_light)
                        .setDescription(`**You won the blackjack game!** GG my guy\nYou won ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${Math.ceil(bal+bet*1.5)}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet*1.5);

                } else if(botCount === 21 && playerCount < 21) {
                    embed.fields = [];
                    embed
                    .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                    .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                    .setColor(red_light)
                    .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                    hit.stop();
                    stand.stop();
                    msg.edit(embed);
                    await msg.reactions.removeAll();
                    return db.add(`money_${message.author.id}`, bet - bet - bet);
                    
                } else if(botCount === 21 && playerCount > 21) {
                    embed.fields = [];
                    embed
                    .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                    .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                    .setColor(red_light)
                    .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                    hit.stop();
                    stand.stop();
                    msg.edit(embed);
                    await msg.reactions.removeAll();
                    return db.add(`money_${message.author.id}`, bet - bet - bet);
                    
                } else if(playerCount === 21 && botCount > 21) {
                    embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(green_light)
                        .setDescription(`**You won the blackjack game!** GG my guy\nYou won ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${Math.ceil(bal+bet*1.5)}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet*1.5);
                    
                }
                stand.on("collect", async r => {
                    let sum2 = botArray.reduce(function(a, b) {
                        return a + b;
                    }, 0);
                    let botCount;
                    botCount = sum2;
                    
                    let sum1 = playerArray.reduce(function(a, b) {
                        return a + b;
                    }, 0);
                    let playerCount;
                    playerCount = sum1;

                    if(playerCount > 21 && botCount > 21) {
                        embed.fields = [];
                    embed
                    .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                    .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                    .setColor(red_light)
                    .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                    hit.stop();
                    stand.stop();
                    msg.edit(embed);
                    await msg.reactions.removeAll();
                    return db.add(`money_${message.author.id}`, bet * -1);
    
                    } else if(playerCount === 21 && botCount < 21) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(green_light)
                        .setDescription(`**You won the blackjack game!** GG my guy\nYou won ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${Math.ceil(bal+bet*1.5)}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet*1.5);
    
                    } else if(botCount === 21 && playerCount < 21) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(red_light)
                        .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet - bet - bet);
                        
                    } else if(botCount === 21 && playerCount > 21) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(red_light)
                        .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet - bet - bet);

                    } else if(playerCount === 21 && botCount > 21) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(green_light)
                        .setDescription(`**You won the blackjack game!** GG my guy\nYou won ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${Math.ceil(bal+bet*1.5)}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet*1.5);

                    } else if(playerCount >= 22 && botCount < playerCount) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(red_light)
                        .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet - bet - bet);
                        
                    } else if(botCount >= 22 && playerCount < botCount) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(green_light)
                        .setDescription(`**You won the blackjack game!** GG my guy\nYou won ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${Math.ceil(bal+bet*1.5)}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet*1.5);
                        
                    } else if(playerCount > botCount) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(green_light)
                        .setDescription(`**You won the blackjack game!** GG my guy\nYou won ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${Math.ceil(bal+bet*1.5)}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet*1.5);
                        
                    } else if(playerCount < botCount) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(red_light)
                        .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet - bet - bet);
                        
                    }
                    
                })
                hit.on("collect", async r => {
                    let playerCard3 = Math.floor(Math.random() * 11) + 2;
                    let botCard3 = Math.floor(Math.random() * 11) + 2;
                    playerArray.push(playerCard3);
                    botArray.push(botCard3);

                    
                    r.users.remove(message.author.id);

                    let sum2 = botArray.reduce(function(a, b) {
                        return a + b;
                    }, 0);
                    let botCount;
                    botCount = sum2;
                    
                    
                    let sum1 = playerArray.reduce(function(a, b) {
                        return a + b;
                    }, 0);
                    let playerCount;
                    playerCount = sum1;

                    if(playerCount > 21 && botCount > 21) {
                            embed.fields = [];
                    embed
                    .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                    .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                    .setColor(red_light)
                    .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                    hit.stop();
                    stand.stop();
                    msg.edit(embed);
                    await msg.reactions.removeAll();
                    return db.add(`money_${message.author.id}`, bet - bet - bet);
    
                    } else if(playerCount === 21 && botCount < 21) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(green_light)
                        .setDescription(`**You won the blackjack game!** GG my guy\nYou won ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${Math.ceil(bal+bet*1.5)}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet*1.5);
    
                    } else if(botCount === 21 && playerCount < 21) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(red_light)
                        .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet - bet - bet);
                        
                    } else if(botCount === 21 && playerCount > 21) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(red_light)
                        .setDescription(`**I won the blackjack game!** yayyy you loooseeer\nYou lost ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${bal - bet}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet - bet - bet);
                        
                    } else if(playerCount === 21 && botCount > 21) {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botArray}\`](https://discord.com/)**\nTotal: \`${botCount}\``, true)
                        .setColor(green_light)
                        .setDescription(`**You won the blackjack game!** GG my guy\nYou won ${bet}<:Mana:627845086851629056> mana. Your total balance is now ${Math.ceil(bal+bet*1.5)}<:Mana:627845086851629056>`);
                        hit.stop();
                        stand.stop();
                        msg.edit(embed);
                        await msg.reactions.removeAll();
                        return db.add(`money_${message.author.id}`, bet*1.5);
                        
                    } else {
                        embed.fields = [];
                        embed
                        .addField(`${message.author.username}'s hand `, `Cards: [\`${playerArray}\`](https://discord.com/)\nTotal: \`${playerCount}\``, true)
                        .addField(`${bot.user.username}'s hand`, `Cards: **[\`${botCard1}\`](https://discord.com/) [\`?\`](https://discord.com/)**\nTotal: \`?\``, true)
                        .setColor(ec)
                        .setDescription('React `H` to **hit** or `S` to **stand**');

                        msg.edit(embed);
                    }
                    
                })
            });
            
        });
        }

    }
}

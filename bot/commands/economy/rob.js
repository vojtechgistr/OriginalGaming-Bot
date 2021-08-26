const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ms = require('parse-ms');
const { ec } = require('../../colours.json');

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "rob",
        category: "economy",
        accessableby: "Members",
    },
    run: async (bot, message, args) => {
        let timeout = 1800000;

        const user = message.mentions.users.first();

        let rob = await db.fetch(`rob_${message.author.id}`)

        if(rob != null && timeout - (Date.now() - rob) > 0) {
            let time = ms(timeout - (Date.now() - rob));
            return message.inlineReply(`You have to wait ${time.minutes} minutes and ${time.seconds} seconds to use this command again.`);

        } else {
            
            if(!user) return message.inlineReply(`Sorry, but I can't find this user..`)

            if(user.bot) return message.inlineReply(`Bots can't be part of this economy!`);

            if(user.id === message.author.id) return message.inlineReply(`You can't rob yourself dummy.`)
            
            let bal = await db.fetch(`money_${message.author.id}`)
            if(bal === null) bal = 0;
    
            
            let bank = await db.fetch(`bank_${message.author.id}`)
            if(bank === null) bank = 0;


            let hisBal = await db.fetch(`money_${user.id}`)
            if(hisBal === null) hisBal = 0;
    
            
            let hisBank = await db.fetch(`bank_${user.id}`)
            if(hisBank === null) hisBank = 0;


            let amountToRob = Math.floor(Math.random() * (hisBal - 2 + 1)) + 2;

            if(hisBal < 1) {
                db.set(`rob_${message.author.id}`, Date.now());
                return message.inlineReply(`<:disagree:782705809359765526> ${user.username}'s wallet is almost empty! F for the wallet.`);
                
            }

            if(bal < 500) {
                return message.inlineReply('You have to have at least 500 mana to start a robbery! <:disagree:782705809359765526>');
            }
        
                let paid = new MessageEmbed()
                .setTitle(`The Robbery Started`)
                .setColor(ec)
                .setDescription(`You stole ${amountToRob}<:Mana:627845086851629056> mana from ${user}! Run away before he notices you robbed him!`)
                .setFooter(`The police can be called within 30 seconds.`)
                .setTimestamp();

                message.inlineReply(paid);

                message.channel.send(`Hey ${user}, ${message.author} is running away! Call the police, but hurry up.. Type \`call\` to start the call, but hurry up you have 30 seconds!`)

                message.channel.awaitMessages(message => user.id === message.author.id,
                    {max: 1, time: 30000}).then(collected => {

                        if (collected.first().content.toLowerCase() == 'call') {

                            let calling = new MessageEmbed()
                                .setDescription(`📴 Starting mobile...`)
                            message.inlineReply(calling).then(m => {
                                setTimeout(() => {
                                    calling.setDescription(`📲 Searching the contact...`)
                                    m.edit(calling)
                                }, 1000)

                                setTimeout(() => {
                                    calling.setDescription(`📱 Dialing...`)
                                    m.edit(calling)
                                }, 4000)

                                setTimeout(() => {
                                    calling.setDescription(`🔔 Call accepted!`)
                                    m.edit(calling)
                                }, 7000)

                                setTimeout(() => {
                                    calling.setTitle(`The robber was caught!`)
                                            .setColor(ec)
                                            .setDescription(`The robber paid 500<:Mana:627845086851629056> mana as a fine...`)
                                            .setTimestamp();
                                        m.edit(calling)
                            
                                            db.set(`rob_${message.author.id}`, Date.now());
                                            db.add(`money_${message.author.id}`, 500 - 500 - 500);
                                            db.set(`rob_${message.author.id}`, Date.now());

                                            
                                }, 7700)

                                
                            })
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            /*.then(m => {
                                setTimeout(async() => {
                                    calling.setDescription(`📲 Searching the contact...`)
                                    m.edit(calling).then(m => {
                                        setTimeout(async() => {
                                            calling.setDescription(`📱 Dialing...`)
                                            
                                            
                                        }, 1000)
                                        m.edit(calling).then(m => {
                                        setTimeout(async() => {
                                            calling.setDescription(`🔔 Call accepted!`)
                                            
                                            
                                        }, 1000)
                                        m.edit(calling).then(m => {
                                        setTimeout(async() => {
                                            calling.setTitle(`The robber were caught!`)
                                            .setColor(ec)
                                            .setDescription(`The robber paid 500<:Mana:627845086851629056> mana as a fine...`)
                                            .setTimestamp();
                            
                                            db.set(`rob_${message.author.id}`, Date.now());
                                            db.add(`money_${message.author.id}`, 500 - 500 - 500);
                                            
                                            
                                        }, 1000)
                                        m.edit(calling)
                                    })
                                    })
                                    })
                                
                                    
                                }, 1000)
                                
                            })*/
                        } else {
                            db.set(`rob_${message.author.id}`, Date.now());
                            db.add(`money_${message.author.id}`, amountToRob);
                            db.add(`money_${user.id}`, amountToRob - amountToRob - amountToRob);
                            return;
                        }}).catch(() => {
                            message.inlineReply(`Bad news for you ${user}, the robber ran away! He stole ${amountToRob}<:Mana:627845086851629056> mana from your wallet..`)

                            db.set(`rob_${message.author.id}`, Date.now());
                            db.add(`money_${message.author.id}`, amountToRob);
                            db.add(`money_${user.id}`, amountToRob - amountToRob - amountToRob);
                            return;
                    });
                }
            }
    
}
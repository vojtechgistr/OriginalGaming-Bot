const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ms = require('ms');
const fs = require('fs');
const { default_prefix } = require('../../botconfig.json');

require("../../ExtendedMessage");

const prompts = [
    "What are you giving away?",
    "How long do you want this giveaway to last? (__valid formats:__ s, m, h, d)",
    "How many people will win this giveaway?"
];

module.exports = {
    config: {
        name: "giveaway",
        category: "moderation",
        accessableby: "Members",
        aliases: ["gw"],
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission(["ADMINISTRATOR"])) return

        let bal = await db.fetch(`money_${message.author.id}`)
        if (bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.author.id}`)
        if (bank === null) bank = 0;

        var fileName = 'giveawayData.json';
        var fileData = JSON.parse(fs.readFileSync(fileName).toString());

        if (!args[0]) return message.inlineReply(`Invalid usage <:disagree:782705809359765526>\n\n**Valid format:** \`${default_prefix}giveaway [start/end/reroll] [if start - channel]\``)

        if (args[0] === "start") {
            const [id] = args;
            const channel = message.guild.channels.cache.get(id) || message.mentions.channels.first() || message.guild.channels.cache.find(c => c.name === args[0])
            if (channel) {
                try {
                    const response = await getResponses(message);

                    response.endsOn = Math.floor((Date.now() / 1000) + (ms(response.duration) / 1000));
                    const embed = new MessageEmbed()
                            .setTitle(response.prize)
                            .setDescription(`Number of **__Winners__:** ${response.winners}\n**__Ends on__:** <t:${response.endsOn}:F>\n\n**REACT WITH 🎉 TO ENTER**`)
                            .setFooter(`Hosted by ${message.author.tag}`)
                            .setColor('0x99FF33')

                    const msg = await message.inlineReply('React to confirm', embed);
                    await msg.react('👍')
                    await msg.react('👎')

                    const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && !user.bot & user.id === message.author.id;
                    const reactions = await msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    const choice = reactions.get('👍') || reactions.get('👎');
                    if (choice.emoji.name === '👍') {
                        const giveawayEmbed = new MessageEmbed()
                            .setTitle(response.prize)
                            .setDescription(`Number of **__Winners__:** ${response.winners}\n**__Ends on__:** <t:${response.endsOn}:F>\n\n**REACT WITH 🎉 TO ENTER**`)
                            .setColor('0x99FF33')
                            .setFooter(`Hosted by ${message.author.tag}`)

                        const giveawayMsg = await channel.send(giveawayEmbed);
                        await giveawayMsg.react('🎉')

                        var thisGuild = {
                            messageID: giveawayMsg.id,
                            guildID: giveawayMsg.guild.id,
                            channelID: channel.id,
                            winnersNumber: response.winners,
                            stillgoing: true,
                            item: response.prize,
                            host: message.author.id,
                            end: Date.now() + ms(response.duration)
                        };

                        var guildIDData = message.guild.id + "|" + channel.id +"|" + giveawayMsg.id
                        fileData[guildIDData] = thisGuild

                      
                        fs.writeFileSync(fileName, JSON.stringify(fileData, null, '\t'));

                    } else if (choice.emoji.name === '👎') {
                        message.inlineReply('Giveaway cancelled..').then(m => {
                            m.react('❌');
                        });
                    }

                } catch(err) {}

            } else {
                const chann = new MessageEmbed()
                    .setDescription('Please enter an valid channel name')

                message.inlineReply(chann);
            }


        } else if(args[0] == "end") {
            const channel = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first() || message.guild.channels.cache.find(c => c.name === args[1])

            if(!channel) return message.inlineReply(new MessageEmbed().setDescription('Please enter an valid channel name or ID'))

            if(!args[2]) return message.inlineReply(new MessageEmbed().setDescription('Please enter an valid message ID'))

            try {
                var messageData = await bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).messages.fetch(args[2])
            } catch(error) {
                return message.inlineReply(new MessageEmbed().setDescription("Sorry, but I can't find a message with this ID in this channel.."))
            }
        

            Object.keys(fileData).forEach(key => {
                if(key === `${message.guild.id}|${channel.id}|${messageData.id}` && fileData[key].stillgoing === true) {
                    delete fileData[key]
                    fs.writeFileSync(fileName, JSON.stringify(fileData, null, '\t'));

                    messageData.delete()
                    message.delete()
                    channel.send(new MessageEmbed().setColor('green').setDescription(`Giveaway has ended manually. *[Administrator - ${message.author}]*`))
                    return
                }
            });


        } else if(args[0] == 'reroll') {
            const channel = message.guild.channels.cache.get(args[1]) || message.mentions.channels.first() || message.guild.channels.cache.find(c => c.name === args[1])

            if(!channel) return message.inlineReply(new MessageEmbed().setDescription('Please enter an valid channel name or ID'))

            if(!args[2]) return message.inlineReply(new MessageEmbed().setDescription('Please enter an valid message ID'))

            try {
                var messageData = await bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).messages.fetch(args[2])
            } catch(error) {
                return message.inlineReply(new MessageEmbed().setDescription("Sorry, but I can't find a message with this ID in this channel.."))
            }

            Object.keys(fileData).forEach(async key => {
                if(key === `${message.guild.id}|${channel.id}|${messageData.id}`) {
                    if(fileData[key].stillgoing === true) return message.inlineReply(`This giveaway isn't over yet!`)
                    
                    const embedSent = await bot.guilds.cache.get(fileData[key].guildID).channels.cache.get(fileData[key].channelID).messages.fetch(fileData[key].messageID)

                    const peopleReactedBot = await embedSent.reactions.cache.get("🎉").users.fetch();
                    var peopleReacted = peopleReactedBot.array().filter(u => u.id !== bot.user.id);
                    var index
                    var winnerString = ""
                    var winners = []
                    var finalUpdate = fileData[key].lastWinners

                    var lastIndex = 0
                    var lastWinners = fileData[key].lastWinners

                    if(lastWinners == undefined) {
                        fileData[key].lastWinners = []
                        lastWinners = fileData[key].lastWinners
                    }
                    if(finalUpdate == undefined) {
                        fileData[key].lastWinners = []
                        finalUpdate = fileData[key].lastWinners
                    }

                    

                    for (var z = 0; z < parseInt(fileData[key].winnersNumber); z++) {
                        if(winners.length == parseInt(fileData[key].winnersNumber)) break
                        
                        for (var x = 0; x < peopleReacted.length; x++) {
                            if(winners.length == parseInt(fileData[key].winnersNumber)) break

                            index = Math.floor(Math.random() * peopleReacted.length);

                            if (index == lastIndex) index = Math.floor(Math.random() * peopleReacted.length);
                            if (lastWinners.includes(peopleReacted[index].id)) {
                                for(var i = 0;i < 11; i++) {
                                    if(i === 10) return message.inlineReply(`Not enough participants to execute the draw of the giveaway **${fileData[key].item}**`);
                                    
                                    index = Math.floor(Math.random() * peopleReacted.length);
                                    if(!lastWinners.includes(peopleReacted[index].id)) break
                                }
                            }

                            winnerString += "<@" + peopleReacted[index].id + "> "
                            winners.push(peopleReacted[index].id)
                            finalUpdate.push(peopleReacted[index].id)
                            lastIndex = index

                        }

                    }
                    fs.writeFileSync(fileName, JSON.stringify(fileData, null, '\t'));
                    if(winners.length < fileData[key].winnersNumber) return message.inlineReply(`Not enough participants to execute the draw of the giveaway **${fileData[key].item}**`);

                    let host = await bot.users.cache.get(fileData[key].host)
                    
                    let thiss = new MessageEmbed().setTitle(fileData[key].item).setDescription(`**__Winners__:** ${winnerString}\n\n**__GIVEAWAY HAS ENDED__**`).setColor('0xC0C0C0').setTimestamp().setFooter(`Hosted by ${host.tag} | Ended at`).setTimestamp(fileData[key].end)
                    
                    const GWembed = await bot.guilds.cache.get(fileData[key].guildID).channels.cache.get(fileData[key].channelID).messages.fetch(fileData[key].messageID)
                    GWembed.edit(thiss)
                    bot.guilds.cache.get(fileData[key].guildID).channels.cache.get(fileData[key].channelID).send(`🎉 **${winnerString}**has won the giveaway **${fileData[key].item}** ! Congratulations ! 🎉 [ RE-ROLLED ]`);

                    return
                }
            });

            
        }

    }
}

const time = new MessageEmbed()
    .setDescription('Invalid time format.. Try it again')

const value = new MessageEmbed()
    .setDescription('Invalid entry for winners.. Try it again')

async function getResponses(message) {
    const validTime = /^\d+(s|m|h|d)$/;
    const validNumber = /\d+/;
    const responses = {}

    for (let i = 0; i < prompts.length; i++) {
        await message.inlineReply(prompts[i]);
        const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 });
        const { content } = response.first();

        if (i === 0) responses.prize = content;
        else if (i === 1) {
            if (validTime.test(content))
                responses.duration = content;
            else {
                message.inlineReply(time)
                throw new Error('Invalid time format.. Try it again');
            }
        }
        else if (i === 2) {
            if (validNumber.test(content))
                responses.winners = content;
            else {
                message.inlineReply(value)
                throw new Error('Invalid entry for winners.. Try it again')
            }
        }
    }
    return responses;
}

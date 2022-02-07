const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const { red_light } = require('../../colours.json');
const modules = require('../../modules');
const { default_prefix } = require("../../botconfig.json");

const { MessageButton } = require('discord-buttons');

module.exports = {
    config: {
        name: "karma",
        category: "fun",
        asseccableby: "Members",
        usage: "-karma",
    },
    run: async (bot, message, args) => {
        
        
        var karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: message.guild.id});
        if(karmaGuild == null) {
            await modules.mongodb.collections.karmaSetup.insertOne({guild_id: message.guild.id, enabled: false, emoji1: "💪", emoji2: "👌", emoji3: "👎", emoji4: "🐒", emoji1enabled: true, emoji4enabled: true});
            karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: message.guild.id});
        }

        // karma setup
        if(args[0] == "setup") {
            const embed2 = new MessageEmbed()
            .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
            .setDescription("You don't have enough permissions to use this command. \n - Required permission -> ``MANAGE SERVER``")
            .setColor('#d12828');
    
            if (!message.member.hasPermission('MANAGE_GUILD')) {
                message.channel.send(embed2)
                .then(msg => {msg.delete({timeout: 7000})});
                return message.delete({ timeout: 7000 });
                
            } else {
                // buttons
                let enableButton = new MessageButton()
                .setStyle('3')
                .setLabel('Enable')
                .setID('enablebutton');

                let emojiButton = new MessageButton()
                .setStyle('1')
                .setLabel('Emoji Setup')
                .setID('emojibutton');

                let disableButton = new MessageButton()
                .setStyle('red')
                .setLabel('Disable')
                .setID('disablebutton');

                let resetButton = new MessageButton()
                .setStyle('2')
                .setLabel('Reset Settings')
                .setID('resetsettings');

                // setup Message
                let setupMsg = new MessageEmbed()
                .setTitle(`⭕ Karma - Setup Page`)
                .setFooter(`Author - ` + message.author.id)
                .setColor('0xFF4500');

                if(karmaGuild.enabled == false) {
                    setupMsg.setDescription(`Before you will do anything, you need to enable this feature.`);
                    disableButton.setDisabled();
                    emojiButton.setDisabled();
                    resetButton.setDisabled();
                    return message.channel.send(setupMsg, {buttons: [emojiButton, enableButton, disableButton, resetButton]});
                }

                enableButton.setDisabled();
                setupMsg.setDescription(`Select one of the options below to continue.`);
                
                return message.channel.send(setupMsg, {
                    buttons: [emojiButton, enableButton, disableButton, resetButton]
                });
            }

        }

        if(karmaGuild.enabled == false) return message.channel.send(new MessageEmbed().setDescription(`This feature is not enabled yet. You can enable it by typing \`${default_prefix}karma setup\` command.\n\n*Requires you to have \`MANAGE SERVER\` permision.*`));
        
        if(args[0] == "top" || args[0] == "leaderboard" || args[0] == "board") {
            const board = await modules.mongodb.collections.karmaData.find({guild_id: message.guild.id}).sort({amount: -1}).toArray();
            let content = ``
    
            for(let i = 0; i < board.length; i++) {
                if(i === 10) {
                    break
                } else {
                    content = await content + `\n**${i+1}.)** <@${await board[i].user_id}> ➤ **${board[i].amount}** karma\n`
                }
                
            }
            let em = new MessageEmbed()
                .setTitle(`⭕ Karma - Server Leaderboard`)
                .setDescription(await content)
                .setColor('0xFF4500')
    
            await message.inlineReply(em);

        } else if(args[0] == "help") {
            let helpEmbed = new MessageEmbed()
                .setTitle(`⭕ Karma - Help Page`)
                .setDescription(`Karma is a user-based score for other users, add or remove it by giving a said **emoji reactions** to their messages!\n\n\`${default_prefix}karma [user]\` - shows user's karma\n\`${default_prefix}karma top\` - shows karma server leaderboard\n\`${default_prefix}karma setup\` - runs a server setup\n\`${default_prefix}karma list\` - shows list of karma emojis\n\`${default_prefix}karma help\` - shows this page`)
                .setColor('0xFF4500')
            return message.channel.send(helpEmbed);
            
        } else if(args[0] == "list") {
            if(karmaGuild.emoji1enabled == false && karmaGuild.emoji4enabled == false) {
                return message.channel.send(new MessageEmbed().setDescription(`__Current emojis:__\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**`).setColor('0xFF4500'));
            } else if(karmaGuild.emoji1enabled == false) {
                return message.channel.send(new MessageEmbed().setDescription(`__Current emojis:__\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**`).setColor('0xFF4500'));
            } else if(karmaGuild.emoji4enabled == false) {
                return message.channel.send(new MessageEmbed().setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**`).setColor('0xFF4500'));
            } else {
                return message.channel.send(new MessageEmbed().setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**`).setColor('0xFF4500'));
            }
        
        } else if(args[0] == "disable") {
            // buttons
            let enableButtonPlus = new MessageButton()
            .setStyle('3')
            .setLabel('Enable')
            .setID('enableplus');

            let disableButtonPlus = new MessageButton()
            .setStyle('red')
            .setLabel('Disable')
            .setID('disableplus');

            let enableButtonMinus = new MessageButton()
            .setStyle('3')
            .setLabel('Enable')
            .setID('enableminus');

            let disableButtonMinus = new MessageButton()
            .setStyle('red')
            .setLabel('Disable')
            .setID('disableminus');

            // setup Message
            let setupMsg = new MessageEmbed()
            .setTitle(`⭕ Karma - Disable Emoji`)
            .setColor('0xFF4500');

            if(args[1] == "plus2") {
                if(karmaGuild.emoji1enabled == true) {enableButtonPlus.setDisabled();disableButtonPlus.setDisabled(false);}
                else {enableButtonPlus.setDisabled(false);disableButtonPlus.setDisabled();}
                
                setupMsg.setDescription(`By clicking the button below, you can disable or enable a \`+2 karma\` feature`);

                return message.channel.send(setupMsg, {buttons: [enableButtonPlus, disableButtonPlus]});

            } else if(args[1] == "minus2") {
                if(karmaGuild.emoji4enabled == true) {enableButtonMinus.setDisabled();disableButtonMinus.setDisabled(false);}
                else {enableButtonMinus.setDisabled(false);disableButtonMinus.setDisabled();}
                
                setupMsg.setDescription(`By clicking the button below, you can disable or enable a \`-2 karma\` feature`);

                return message.channel.send(setupMsg, {buttons: [enableButtonMinus, disableButtonMinus]});

            }

            return;
        }
        
        else {
            let memb = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if(!memb) memb = message.member;
            let karmaAmount = 0;
            let karmaDB = await modules.mongodb.collections.karmaData.findOne({user_id: memb.id, guild_id: message.guild.id});
            
            if(karmaDB == null) {
                await modules.mongodb.collections.karmaData.insertOne({user_id: memb.id, guild_id: message.guild.id, amount: 0});
            } else {
                if(karmaDB.amount == undefined) await modules.mongodb.collections.karmaData.findOneAndUpdate({user_id: memb.id, guild_id: message.guild.id}, {$set: {amount: 0}});
                else karmaAmount = karmaDB.amount;
            }
        
            const karmastatsembed = new MessageEmbed()
            .setTitle(`⭕ Karma - ${memb.user.username}'s stats`)
            .setDescription(`__Your current amount of karma is:__ ${karmaAmount}`)
            return message.channel.send(karmastatsembed);
        }
    }
}

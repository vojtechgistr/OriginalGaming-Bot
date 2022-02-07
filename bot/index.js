const { Client, Collection, Util } = require("discord.js");
const { MessageEmbed, Discord } = require('discord.js');
const { red_light } = require("./colours.json");
const { token, default_prefix } = require("./botconfig.json");
const message = require("./events/guild/message");
const bot = new Client();

var modules = require("./modules");

require('discord-buttons')(bot)
const { MessageButton } = require('discord-buttons');

bot.options.fetchAllMembers = true;

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["command", "event"].forEach(x => require(`./handlers/${x}`)(bot));


bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    if(message.content === "<@486271782949486602>" || message.content === "<@!486271782949486602>" || message.content === "<@782313686403383318>" || message.content === "<@!782313686403383318>") {
        let sEmbed = new MessageEmbed()
        .setColor(0xffa500)
        .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`**My server's prefix is \`${default_prefix}\`**\n\nType \`${default_prefix}help\` to show the help list!‎`)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL(), false);
    return message.channel.send(sEmbed)
    }

    
})


bot.on('clickButton', async (button) => {

    let emojiButton = new MessageButton()
    .setStyle('1')
    .setLabel('Emoji Setup')
    .setID('emojibutton');

    let disableButton = new MessageButton()
    .setStyle('red')
    .setLabel('Disable')
    .setID('disablebutton');
    
    let enableButton = new MessageButton()
    .setStyle('3')
    .setLabel('Enable')
    .setID('enablebutton');

    let backButton = new MessageButton()
    .setStyle('2')
    .setEmoji('↩️')
    .setID('backbutton');

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

    let resetButton = new MessageButton()
    .setStyle('2')
    .setLabel('Reset Settings')
    .setID('resetsettings');

    const permsNeeded = new MessageEmbed()
    .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
    .setDescription("You don't have enough permissions to use this command. \n - Required permission -> ``MANAGE SERVER``")
    .setColor('#d12828');

    if(button.id === "enablebutton") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});

        enableButton.setDisabled();
        disableButton.setDisabled(false);
        if(karmaGuild.enabled == true) {
            button.message.edit(new MessageEmbed().setDescription('Karma system is already **enabled** on this server.').setFooter(button.message.embeds[0].footer.text), {buttons: [enableButton, disableButton, backButton]});
            return button.reply.defer();
        }

        await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {enabled: true}});
        button.message.edit(new MessageEmbed().setDescription('Karma system has been **enabled** on this server.').setFooter(button.message.embeds[0].footer.text), {buttons: [enableButton, disableButton, backButton]});
        return button.reply.defer();

    } else if(button.id === "disablebutton") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});

        enableButton.setDisabled(false);
        disableButton.setDisabled();
        if(karmaGuild.enabled == false) {
            button.message.edit(new MessageEmbed().setDescription('Karma system is already **disabled** on this server.').setFooter(button.message.embeds[0].footer.text), enableButton);
            return button.reply.defer();
        }
        
        await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {enabled: false}});
        button.message.edit(new MessageEmbed().setDescription('Karma system has been **disabled** on this server.').setFooter(button.message.embeds[0].footer.text), {buttons: [enableButton, disableButton]})
        return button.reply.defer();

    } else if(button.id == "emojibutton") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.enabled == false) {
            button.message.edit(new MessageEmbed().setDescription('Karma system is currently **disabled** on this server.').setFooter(button.message.embeds[0].footer.text), {buttons: [enableButton, disableButton]});
            return button.reply.defer();
        }

        let emoji1 = new MessageButton().setStyle('2').setLabel(`+2 Emoji`).setID('emoji1');
        let emoji2 = new MessageButton().setStyle('2').setLabel(`+1 Emoji`).setID('emoji2');
        let emoji3 = new MessageButton().setStyle('2').setLabel(`-1 Emoji`).setID('emoji3');
        let emoji4 = new MessageButton().setStyle('2').setLabel(`-2 Emoji`).setID('emoji4');
        
        let emojiMsg = new MessageEmbed()
        .setTitle(`⭕ Karma - Emoji Setup`)
        .setColor('0xFF4500');

        button.reply.defer("gay");
        
        if(karmaGuild.emoji1enabled == false && karmaGuild.emoji4enabled == false) {
            emojiMsg.setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setFooter(button.message.embeds[0].footer.text).setColor('0xFF4500');
        
        } else if(karmaGuild.emoji1enabled == false) {
            emojiMsg.setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setFooter(button.message.embeds[0].footer.text).setColor('0xFF4500');
        
        } else if(karmaGuild.emoji4enabled == false) {
            emojiMsg.setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setFooter(button.message.embeds[0].footer.text).setColor('0xFF4500');
        
        } else {
            emojiMsg.setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setFooter(button.message.embeds[0].footer.text).setColor('0xFF4500');
        }
    

        return button.message.edit(emojiMsg, {buttons: [emoji1, emoji2, emoji3, emoji4, backButton]});

    } else if(button.id == "backbutton") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.enabled == false) {
            button.message.edit(new MessageEmbed().setDescription('Karma system is currently **disabled** on this server.'), {buttons: [enableButton, disableButton]});
            return button.reply.defer();
        }
        enableButton.setDisabled();
        button.message.edit(new MessageEmbed().setDescription(`Select one of the options below to continue.`).setFooter(button.message.embeds[0].footer.text).setTitle(`⭕ Karma - Setup Page`).setColor('0xFF4500'), {buttons: [emojiButton, enableButton, disableButton, resetButton]});
        return button.reply.defer();

    // emoji setup handler
    } else if(button.id == "emoji1") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();
        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.enabled == false) {
            return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription('Karma system is currently **disabled** on this server.'), {buttons: [enableButton, disableButton]});
        }

        button.message.channel.send(`Send a new emoji to replace the old one.\n*\`You have got 30 seconds!\`*`).then((msg) => {
            button.message.channel.awaitMessages(m => m.author.id === button.clicker.id, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(async message => {
                setTimeout(async () => {
                message = message.first();

                if(message.content == "cancel" || message.content == "exit" || message.content == "none") {
                    return button.message.channel.send('Action has been cancelled.');
                }

                if(message.content.match(/[a-z]/i) && !(message.content.startsWith('<:') && message.content.slice(-1) == ">")) {
                    return button.message.channel.send('Action has been cancelled, invalid emoji.');
                }

                karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});

                if(message.content == karmaGuild.emoji1 || message.content == karmaGuild.emoji2 || message.content == karmaGuild.emoji3 || message.content == karmaGuild.emoji4) {
                    return button.message.channel.send('Action has been cancelled, this emoji is already in use.');
                }

                let freq = {};
                message.content.replace(/[\u{1F300}-\u{1F6FF}]/gu, char => freq[char] = (freq[char] || 0) + 1);

                if(Object.keys(freq).length > 1 && !(message.content.startsWith('<:') && message.content.slice(-1) == ">")) {
                    return button.message.channel.send('Action has been cancelled, you can\'t use more than one emoji.');
                }

                button.message.channel.send(`Emoji has been changed to ${message.content}`);
                
                await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {emoji1: message.content}});
                karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
                
                if(karmaGuild.emoji1enabled == false && karmaGuild.emoji4enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else if(karmaGuild.emoji1enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else if(karmaGuild.emoji4enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                }
            }, 100)
            }).catch(collected => {
                msg.delete();
                return button.message.channel.send('Action has been cancelled, timed out.').then(m => m.delete({timeout: 7000}));
            });
        })

    } else if(button.id == "emoji2") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();
        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.enabled == false) {
            return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription('Karma system is currently **disabled** on this server.'), {buttons: [enableButton, disableButton]});
        }

        button.message.channel.send(`Send a new emoji to replace the old one.\n*\`You have got 30 seconds!\`*`).then((msg) => {
            button.message.channel.awaitMessages(m => m.author.id === button.clicker.id, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(async message => {
                setTimeout(async () => {
                message = message.first();

                if(message.content == "cancel" || message.content == "exit" || message.content == "none") {
                    return button.message.channel.send('Action has been cancelled.');
                }

                if(message.content.match(/[a-z]/i) && !(message.content.startsWith('<:') && message.content.slice(-1) == ">")) {
                    return button.message.channel.send('Action has been cancelled, invalid emoji.');
                }

                karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});

                if(message.content == karmaGuild.emoji1 || message.content == karmaGuild.emoji2 || message.content == karmaGuild.emoji3 || message.content == karmaGuild.emoji4) {
                    return button.message.channel.send('Action has been cancelled, this emoji is already in use.');
                }

                let freq = {};
                message.content.replace(/[\u{1F300}-\u{1F6FF}]/gu, char => freq[char] = (freq[char] || 0) + 1);

                if(Object.keys(freq).length > 1 && !(message.content.startsWith('<:') && message.content.slice(-1) == ">")) {
                    return button.message.channel.send('Action has been cancelled, you can\'t use more than one emoji.');
                }


                button.message.channel.send(`Emoji has been changed to ${message.content}`);
                
                await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {emoji2: message.content}});
                karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
                
                if(karmaGuild.emoji1enabled == false && karmaGuild.emoji4enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else if(karmaGuild.emoji1enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else if(karmaGuild.emoji4enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                }
            }, 200)
            }).catch(collected => {
                msg.delete();
                return button.message.channel.send('Action has been cancelled, timed out.').then(m => m.delete({timeout: 7000}));
            });
        })
    } else if(button.id == "emoji3") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();
        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.enabled == false) {
            return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription('Karma system is currently **disabled** on this server.'), {buttons: [enableButton, disableButton]});
        }

        button.message.channel.send(`Send a new emoji to replace the old one.\n*\`You have got 30 seconds!\`*`).then((msg) => {
            button.message.channel.awaitMessages(m => m.author.id === button.clicker.id, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(async message => {
                setTimeout(async () => {
                message = message.first();

                if(message.content == "cancel" || message.content == "exit" || message.content == "none") {
                    return button.message.channel.send('Action has been cancelled.');
                }

                if(message.content.match(/[a-z]/i) && !(message.content.startsWith('<:') && message.content.slice(-1) == ">")) {
                    return button.message.channel.send('Action has been cancelled, invalid emoji.');
                }

                karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});

                if(message.content == karmaGuild.emoji1 || message.content == karmaGuild.emoji2 || message.content == karmaGuild.emoji3 || message.content == karmaGuild.emoji4) {
                    return button.message.channel.send('Action has been cancelled, this emoji is already in use.');
                }

                let freq = {};
                message.content.replace(/[\u{1F300}-\u{1F6FF}]/gu, char => freq[char] = (freq[char] || 0) + 1);

                if(Object.keys(freq).length > 1 && !(message.content.startsWith('<:') && message.content.slice(-1) == ">")) {
                    return button.message.channel.send('Action has been cancelled, you can\'t use more than one emoji.');
                }


                button.message.channel.send(`Emoji has been changed to ${message.content}`);
                
                await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {emoji3: message.content}});
                karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
                
                if(karmaGuild.emoji1enabled == false && karmaGuild.emoji4enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else if(karmaGuild.emoji1enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else if(karmaGuild.emoji4enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                }
                
            }, 300);
            }).catch(collected => {
                msg.delete();
                return button.message.channel.send('Action has been cancelled, timed out.').then(m => m.delete({timeout: 7000}));
            });
        })
    } else if(button.id == "emoji4") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();
        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.enabled == false) {
            return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription('Karma system is currently **disabled** on this server.'), {buttons: [enableButton, disableButton]});
        }

        button.message.channel.send(`Send a new emoji to replace the old one.\n*\`You have got 30 seconds!\`*`).then((msg) => {
            button.message.channel.awaitMessages(m => m.author.id === button.clicker.id, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(async message => {
                message = message.first();

                if(message.content == "cancel" || message.content == "exit" || message.content == "none") {
                    return button.message.channel.send('Action has been cancelled.');
                }

                if(message.content.match(/[a-z]/i) && !(message.content.startsWith('<:') && message.content.slice(-1) == ">")) {
                    return button.message.channel.send('Action has been cancelled, invalid emoji.');
                }

                karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});

                if(message.content == karmaGuild.emoji1 || message.content == karmaGuild.emoji2 || message.content == karmaGuild.emoji3 || message.content == karmaGuild.emoji4) {
                    return button.message.channel.send('Action has been cancelled, this emoji is already in use.');
                }

                let freq = {};
                message.content.replace(/[\u{1F300}-\u{1F6FF}]/gu, char => freq[char] = (freq[char] || 0) + 1);

                if(Object.keys(freq).length > 1 && !(message.content.startsWith('<:') && message.content.slice(-1) == ">")) {
                    return button.message.channel.send('Action has been cancelled, you can\'t use more than one emoji.');
                }


                button.message.channel.send(`Emoji has been changed to ${message.content}`);
                
                await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {emoji4: message.content}});
                karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
                
                if(karmaGuild.emoji1enabled == false && karmaGuild.emoji4enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else if(karmaGuild.emoji1enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n~~${karmaGuild.emoji1} \`+2 karma\`~~\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else if(karmaGuild.emoji4enabled == false) {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n~~${karmaGuild.emoji4} \`-2 karma\`~~\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                
                } else {
                    return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setDescription(`__Current emojis:__\n${karmaGuild.emoji1} **\`+2 karma\`**\n${karmaGuild.emoji2} **\`+1 karma\`**\n${karmaGuild.emoji3} **\`-1 karma\`**\n${karmaGuild.emoji4} **\`-2 karma\`**\n\n__How to disable 2 point emojis:__\n\`${default_prefix}karma disable plus2\` - disables +2 emoji option\n\`${default_prefix}karma disable minus2\` - disables -2 emoji option`).setColor('0xFF4500'));
                }
            }).catch(collected => {
                msg.delete();
                return button.message.channel.send('Action has been cancelled, timed out.').then(m => m.delete({timeout: 7000}));
            });
        })
    } else if(button.id == "enableplus") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();
        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.emoji1enabled == true) return;
        enableButtonPlus.setDisabled();
        disableButtonPlus.setDisabled(false);
        await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {emoji1enabled: true}})
        return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setColor('0xFF4500').setTitle(`⭕ Karma - Disable Emoji`).setDescription(`+2 option has been enabled.`), {buttons: [enableButtonPlus, disableButtonPlus]});

    } else if(button.id == "disableplus") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();
        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.emoji1enabled == false) return;
        enableButtonPlus.setDisabled(false);
        disableButtonPlus.setDisabled();
        await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {emoji1enabled: false}})
        return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setColor('0xFF4500').setTitle(`⭕ Karma - Disable Emoji`).setDescription(`+2 option has been disabled.`), {buttons: [enableButtonPlus, disableButtonPlus]});

    } else if(button.id == "enableminus") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();
        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.emoji4enabled == true) return;
        enableButtonMinus.setDisabled();
        disableButtonMinus.setDisabled(false);
        await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {emoji4enabled: true}})
        return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setColor('0xFF4500').setTitle(`⭕ Karma - Disable Emoji`).setDescription(`-2 option has been enabled.`), {buttons: [enableButtonMinus, disableButtonMinus]});

    } else if(button.id == "disableminus") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();
        let karmaGuild = await modules.mongodb.collections.karmaSetup.findOne({guild_id: button.guild.id});
        if(karmaGuild.emoji4enabled == false) return;
        enableButtonMinus.setDisabled(false);
        disableButtonMinus.setDisabled();
        await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {emoji4enabled: false}})
        return button.message.edit(new MessageEmbed().setFooter(button.message.embeds[0].footer.text).setColor('0xFF4500').setTitle(`⭕ Karma - Disable Emoji`).setDescription(`-2 option has been disabled.`), {buttons: [enableButtonMinus, disableButtonMinus]});

    } else if(button.id == "resetsettings") {

        let messageAuthor = button.message.guild.members.cache.get(button.message.embeds[0].footer.text.split('Author - ')[1]);
        if(messageAuthor == undefined || messageAuthor == null) return;
        if(messageAuthor !== button.clicker.user && !messageAuthor.hasPermission('MANAGE_GUILD')) {
            return;
        }

        button.reply.defer();

        button.message.channel.send(`Type **\`confirm\`** to continue, or \`cancel\` to exit this process.\n*\`You have got 30 seconds!\`*`).then((msg) => {
            button.message.channel.awaitMessages(m => m.author.id === button.clicker.id, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(async message => {
                message = message.first();

                if(message.content == "confirm" || message.content == "continue") {
                    await modules.mongodb.collections.karmaSetup.findOneAndUpdate({guild_id: button.guild.id}, {$set: {enabled: false, emoji1: "💪", emoji2: "👌", emoji3: "👎", emoji4: "🐒", emoji1enabled: true, emoji4enabled: true}})
                    return button.message.edit(new MessageEmbed().setDescription(`All Karma settings have been set to default.`), null);
                }

                if(message.content == "cancel" || message.content == "exit") {
                    return button.message.channel.send('Action has been cancelled.');
                }

            }).catch(collected => {
                msg.delete();
                return button.message.channel.send('Action has been cancelled, timed out.').then(m => m.delete({timeout: 7000}));
            });
        })
    }
})

bot.on('messageReactionAdd', async (reaction_orig, user) => {
    if (reaction_orig.message.author.id === user.id) {return;}
    else {
        let karmaDB = await modules.mongodb.collections.karmaData.findOne({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id});
        if(karmaDB == null) {
            await modules.mongodb.collections.karmaData.insertOne({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id, amount: 0});
        } else {
            if(karmaDB.amount == undefined) await modules.mongodb.collections.karmaData.findOneAndUpdate({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id}, {$set: {amount: 0}});
        }

        let karmaSetup = await modules.mongodb.collections.karmaSetup.findOne({guild_id: reaction_orig.message.guild.id});

        if(karmaSetup.emoji1enabled == true && (reaction_orig._emoji.name == karmaSetup.emoji1 || karmaSetup.emoji1 == `<:${reaction_orig._emoji.name}:${reaction_orig._emoji.id}>`)) {
            var curAmount = await modules.mongodb.collections.karmaData.findOne({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id});
            await modules.mongodb.collections.karmaData.findOneAndUpdate({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id}, {$set: {amount: parseInt(curAmount.amount) + 2}})

        } else if(reaction_orig._emoji.name == karmaSetup.emoji2 || karmaSetup.emoji2 == `<:${reaction_orig._emoji.name}:${reaction_orig._emoji.id}>`) {
            var curAmount = await modules.mongodb.collections.karmaData.findOne({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id});
            await modules.mongodb.collections.karmaData.findOneAndUpdate({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id}, {$set: {amount: parseInt(curAmount.amount) + 1}})

        } else if(reaction_orig._emoji.name == karmaSetup.emoj3 || karmaSetup.emoj3 == `<:${reaction_orig._emoji.name}:${reaction_orig._emoji.id}>`) {
            var curAmount = await modules.mongodb.collections.karmaData.findOne({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id});
            await modules.mongodb.collections.karmaData.findOneAndUpdate({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id}, {$set: {amount: parseInt(curAmount.amount) - 1}})

        } else if(karmaSetup.emoji4enabled == true && (reaction_orig._emoji.name == karmaSetup.emoji4 || karmaSetup.emoji4 == `<:${reaction_orig._emoji.name}:${reaction_orig._emoji.id}>`)) {
            var curAmount = await modules.mongodb.collections.karmaData.findOne({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id});
            await modules.mongodb.collections.karmaData.findOneAndUpdate({user_id: reaction_orig.message.author.id, guild_id: reaction_orig.message.guild.id}, {$set: {amount: parseInt(curAmount.amount) - 2}})

        }
    }
});

bot.login(token);

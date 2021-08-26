const { Client, Collection, Util } = require("discord.js");
const { MessageEmbed, Discord } = require('discord.js');
const { red_light } = require("./colours.json");
const { token, default_prefix } = require("./botconfig.json");
const message = require("./events/guild/message");
const bot = new Client();

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

bot.login(token);
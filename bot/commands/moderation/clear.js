const { MessageEmbed } = require("discord.js")
const { red_light } = require("../../colours.json");
const db = require("quick.db")
const moderation = require("../../botconfig.json")
const config = require('../../botconfig.json')

module.exports = {
    config: {
        name: "clear",
        description: "Clears the chat.",
        usage: "-clear",
        category: "moderation",
        accessableby: "Administrators",
    },
    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;
        let section = db.get(`moderation_${message.guild.id}`)
        if(section === null) section = moderation;

        if(section === "false") return

const embed1 = new MessageEmbed()
    .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
    .setDescription("I don't have enough permissions to do this command. \n - Please, give me permission -> ``MANAGE CHANNELS``")
    .setColor(0xd12828)
    const embed2 = new MessageEmbed()
    .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
    .setDescription("You don't have enough permissions to use this command. \n - Required permission -> ``MANAGE CHANNELS``")
    .setColor(0xd12828)
    const embed3 = new MessageEmbed()
    .setDescription('The number of messages cant contain letters or punctuation! \n\nWrite number from **1** to **100**!')
    .setColor(0xd12828)

if (!message.member.hasPermission("MANAGE_CHANNELS")) {
    message.channel.send(embed2).then(m => m.delete({ timeout: 10000 }));
    return message.delete({ timeout: 10000 })
}

if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
    message.channel.send(embed1).then(m => m.delete({ timeout: 10000 }));
    return message.delete({ timeout: 10000 })
}

if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
    message.channel.send(embed3).then(m => m.delete({ timeout: 10000 }));
    return message.delete({ timeout: 10000 })
}

await message.delete();

let deleteAmount = parseInt(args[0]);

if (parseInt(args[0]) > 100) {
    deleteAmount = 100;
} else {
    deleteAmount = parseInt(args[0]);
}

const mark = bot.emojis.cache.get("782705809142448159");

try {
await message.channel.bulkDelete(deleteAmount, true)
   .then(deleted => message.channel.send(`${mark} Deleted **\`${deleted.size} messages.\`**`)).catch(error =>{

    if(error) {
     const errorembed2 = new MessageEmbed()
     .setDescription(`:warning: Something went wrong`)
     .setColor(red_light);
 
     return message.channel.send(errorembed2)
    }
    })
    
    let embeddw = new MessageEmbed()
    .setColor(red_light)
    .setAuthor(`Modlogs`)
    .setThumbnail(message.guild.iconURL())
    .addField("Moderation:", "Clear")
    .addField("Moderator:", message.author.tag)
    .addField("Date:", message.createdAt.toLocaleString())

    let lawdw = await message.guild.channels.cache.get(config.logchannel)
        return lawdw.send(embeddw)

    } catch(err) {
        console.log(err);
        const embed33 = new MessageEmbed()
                .setDescription(`I don't have enough permissions to do this.. please fix it or contact the bot developer if your permissions are 100% correctly set up.`)
                return message.channel.send(embed33);
    }
    }
}
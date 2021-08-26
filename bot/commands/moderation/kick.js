const { MessageEmbed } = require("discord.js");
const { red_light } = require("../../colours.json");
const db = require("quick.db");
const { default_prefix } = require('../../botconfig.json');
const config = require('../../botconfig.json')

module.exports = {
    config: {
        name: "kick",
        usage: "-kick",
        category: "moderation",
        accessableby: "Administrators",
    },
    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;
        
const embed1 = new MessageEmbed()
        .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
        .setDescription("I don't have enough permissions to do this command. \n - Please, give me permission -> ``KICK MEMBERS``")
        .setColor(0xd12828)
        const embed2 = new MessageEmbed()
        .setTitle('<:disagree:782705809359765526> Error <:disagree:782705809359765526>')
        .setDescription("You don't have enough permissions to do this command. \n - Required permission -> ``KICK MEMBERS``")
        .setColor(0xd12828)
        if(!message.member.hasPermission(["KICK_MEMBERS", "ADMINISTRATOR"])) {
            message.channel.send(embed2)
            .then(m => m.delete({ timeout: 10000 }));
            return message.delete({ timeout: 10000 })
        }
	if(!message.guild.me.hasPermission(["KICK_MEMBERS", "ADMINISTRATOR"])) {
        message.channel.send(embed1)
        .then(m => m.delete({ timeout: 10000 }));
        return message.delete({ timeout: 10000 })
    }

    let kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    const embd = new MessageEmbed()
        .setDescription("Please provide a valid user to kick!")
        .setColor(red_light)
    if(!kickMember) {
        message.channel.send(embd)
        .then(m => m.delete({ timeout: 10000 }));
        return message.delete({ timeout: 10000 })
    }

    let reason = args.slice(1).join(" ");
    if(!reason) reason = "- No reason given -";

    const embed4 = new MessageEmbed()
    .setDescription("You can't kick yourself!")
    .setColor(red_light);
    
    if(kickMember.id === message.author.id) {
        message.channel.send(embed4)
        .then(m => m.delete({ timeout: 10000 }));
        return message.delete({ timeout: 10000 })
    }
    const embed3 = new MessageEmbed()
        .setDescription("You can't kick a moderator!")
        .setColor(red_light);

   if(message.guild.member(kickMember).hasPermission(["BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_GUILD", "MANAGE_CHANNELS", "KICK_MEMBERS"])) {
    message.channel.send(embed3)
    .then(m => m.delete({ timeout: 10000 }));
    return message.delete({ timeout: 10000 })
}
message.delete()
try {
    try {
        await kickMember.send(`Hi, you were kicked from \n **${message.guild.name}**! \n\n __**Reason:**__ \n ${reason}`);
    } catch(err) {
        let lawdw = await bot.channels.cache.get('627846724609769491');
            await lawdw.send("I can't send a message to this user, you can ignore this report..")
    }
    await kickMember.kick();

    const kicked = new MessageEmbed()
            .setTitle(":warning: KICKED")
            .setDescription(`**${kickMember.user.tag}** has been kicked from this server! \n\n __**Reason:**__ \n ${reason}\n\n[ ${message.author} ]`)
            .setFooter(`Kicked by ${message.author.username}#${message.author.discriminator}`)
            .setTimestamp()
            .setColor(red_light);
            message.channel.send(kicked)
                    
            
            let embeddw = new MessageEmbed()
            .setColor(red_light)
            .setAuthor(`Modlogs`)
            .setThumbnail(message.guild.iconURL())
            .addField("Moderation:", "Kick")
            .addField("Kicked:", `${kickMember.user.tag} [${kickMember.id}]`)
            .addField("Moderator:", message.author.tag)
            .addField("Reason:", reason)
            .addField("Date:", message.createdAt.toLocaleString())
        
            let lawdw = bot.channels.cache.get('627846724609769491')
            await lawdw.send(embeddw)
    
            } catch(err) {
                if(err.code === 50007) {
                    message.delete();

    const kicked = new MessageEmbed()
            .setTitle(":warning: KICKED")
            .setDescription(`**${kickMember.user.tag}** has been kicked from this server! \n\n __**Reason:**__ \n ${reason}\n\n[ ${message.author} ]`)
            .setFooter(`Kicked by ${message.author.tag}`)
            .setTimestamp()
            .setColor(red_light);
            message.channel.send(kicked)
                    
            
            let embeddw = new MessageEmbed()
            .setColor(red_light)
            .setAuthor(`Modlogs`)
            .setThumbnail(message.guild.iconURL())
            .addField("Moderation:", "Kick")
            .addField("Kicked:", `${kickMember.user.tag} [${kickMember.id}]`)
            .addField("Moderator:", message.author.tag)
            .addField("Reason:", reason)
            .addField("Date:", message.createdAt.toLocaleString())
        
            let lawdw = await message.guild.channels.cache.get(config.logchannel)
            return lawdw.send(embeddw)

                } else {
                   const embed33 = new MessageEmbed()
                        .setDescription(`I don't have enough permissions to do this.. Maybe my role is below user's role, please fix it.`)
                        return message.channel.send(embed33); 
                }
                
            }
    }
}
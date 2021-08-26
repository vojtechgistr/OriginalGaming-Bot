const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const { red_light } = require('../../colours.json');

module.exports = {
    config: {
        name: "embed",
	usage: "-embed",
        category: "fun",
        accessableby: "Members",
    },

    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;

	const embed1 = new MessageEmbed()
        .setTitle(':X: Error :X:')
        .setDescription("I don't have enough permissions to do this command. \n Please, give me permission -> ``MANAGE MESSAGES``")
        .setColor(0xd12828)
        const embed2 = new MessageEmbed()
        .setTitle(':x: Error :x:')
        .setDescription("You don't have enough permissions to use this command. \n - Required permission -> ``MANAGE MESSAGES``")
        .setColor(0xd12828)
            if (!message.guild.member(bot.user).hasPermission(['MANAGE_MESSAGES'])) {
	message.channel.send(embed1)
            .then(m => m.delete({ timeout: 5000 }));
        return message.delete({ timeout: 5000 });
}
            if (!message.member.hasPermission("MANAGE_MESSAGES")) {
	message.channel.send(embed2)
            .then(m => m.delete({ timeout: 5000 }));
        return message.delete({ timeout: 5000 });
}

        let mess = args.slice(0).join(" ")
    	if(!mess) return;
	
	let embed = new MessageEmbed()
        .setDescription(mess)
        message.delete().catch(O_o=>{});
        message.channel.send(embed)

        try {

            let embeddw = new MessageEmbed()
            .setColor(red_light)
            .setAuthor(`Modlogs`)
            .setThumbnail(message.guild.iconURL())
            .addField("Moderation:", "Say [ embed message ]")
            .addField("Author:", message.author.tag)
            .addField("Message:", mess)
            .addField("Date:", message.createdAt.toLocaleString())
        
            let lawdw = bot.channels.cache.get('627846724609769491')
            lawdw.send(embeddw)
    
            } catch(err) {
                const embed33 = new MessageEmbed()
                        .setDescription(`Something went wrong while logging this action, contact the developer of this bot!`)
                        return message.channel.send(embed33);
            }
    }

}

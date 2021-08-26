const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { red_light } = require("../../colours.json");

module.exports = {
	config: {
        name: "removeadmin",
        aliases: ["radmin", "ra", "removemod", "rm"],
        category: "admins",
     },
   run: async (bot, message, args) => {
	if (message.author.id !== "484448041609199620") {
		message.react('❌');
	return message.channel.send(`Only Owner of this bot can add Admins!`)
	}
	
	if(!args[0]) {
		return message.channel.send(`Please enter some id or mention`)
	}
	
	let user = bot.users.cache.get(args[0]);

	if(!user) {
		return message.channel.send(`I can't find this user!`);
	}

	const admin = db.get(`admin_${user.id}`);
	if(admin === null) {
		db.set(`admin_${user.id}`, "False");
	}

	if(admin === "False") {
		return message.channel.send(`${user.tag} is not Bot Admin!`);
	}
	if(admin === "True") {
		db.set(`admin_${user.id}`, "False");
		message.channel.send(`${user.tag} is no longer Admin.`);

		try {

            let embeddw = new MessageEmbed()
            .setColor(red_light)
            .setAuthor(`Modlogs`)
            .setThumbnail(message.guild.iconURL())
            .addField("Moderation:", "Remove Admin")
            .addField("Executed by:", message.author.tag)
            .addField("Removed:", user.tag)
            .addField("Date:", message.createdAt.toLocaleString())
        
            let lawdw = bot.channels.cache.get('627846724609769491');
            return lawdw.send(embeddw);
    
            } catch(err) {
				console.log(err);
                const embed33 = new MessageEmbed()
                        .setDescription(`Something went wrong while logging this action, contact the developer of this bot!`)
                        return message.channel.send(embed33);
            }
	}
  }
}
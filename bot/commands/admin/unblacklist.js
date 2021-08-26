const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { red_light } = require("../../colours.json");

module.exports = {
	config: {
	   name: "unblacklist",
	   aliases: ["unbl"],
	   category: "admins",
	},
   run: async (bot, message, args) => {

	const admin = db.fetch(`admin_${message.author.id}`);
	if(admin === null) {
		db.set(`admin_${message.author.id}`, "False");
	}

	if (admin === "False") return message.react('❌');

	if (admin === "True") {
		const user = bot.users.cache.get(args[0]);
		if(!user) return message.channel.send(`Please provide valid user id`);
		if(user.bot) return message.channel.send(`Bot cannot be blacklisted..`)
		if(user === admin) {
			return message.channel.send(`Bro.. this user is admin! Admins cannot be blacklisted`);
		}
		if(user.id === message.author.id) {
			return message.channel.send(`You cannot unblacklist yourself, cuz you can't be blacklisted..`);
		}
		let blacklist = await db.fetch(`blacklist_${user.id}`);
		if(blacklist === null) db.set(`blacklist_${user.id}`, "Not");
		

		if(blacklist === "Not") {
			let embed = new MessageEmbed()
				.setDescription(`${user.tag} is not blacklisted!`)
				.setColor('#000000')
				.setTimestamp();
			return message.channel.send(embed);

		} else if(blacklist === "Blacklisted") {

			db.set(`blacklist_${user.id}`, "Not");
			let embed = new MessageEmbed()
				.setDescription(`${user.tag} has been unblacklisted!`)
				.setColor('#000000')
				.setFooter(`By admin: ${message.author.tag}`)
				.setTimestamp();
			message.channel.send(embed)
			db.delete("blacklistedusers", {
				user: user.id
			});
			try {

				let embeddw = new MessageEmbed()
				.setColor(red_light)
				.setAuthor(`Modlogs`)
				.setThumbnail(message.guild.iconURL())
				.addField("Moderation:", "Removed from Blacklist")
				.addField("Executed by:", message.author.tag)
				.addField("Removed:", user.tag)
				.addField("Date:", message.createdAt.toLocaleString())
			
				let lawdw = bot.channels.cache.get('627846724609769491')
				return lawdw.send(embeddw)
		
				} catch(err) {
					console.log(err);
					const embed33 = new MessageEmbed()
							.setDescription(`Something went wrong while logging this action, contact the developer of this bot!`)
							return message.channel.send(embed33);
				}
				
		} else {
		db.set(`blacklist_${user.id}`, "Not");
			let embed = new MessageEmbed()
				.setDescription(`${user.tag} has been removed from the blacklist!`)
				.setColor('#000000')
				.setFooter(`By admin: ${message.author.tag}`)
				.setTimestamp();
			message.channel.send(embed);
			db.delete("blacklistedusers", {
				user: user.id
			});

			try {

				let embeddw = new MessageEmbed()
				.setColor(red_light)
				.setAuthor(`Modlogs`)
				.setThumbnail(message.guild.iconURL())
				.addField("Moderation:", "Removed from Blacklist")
				.addField("Executed by:", message.author.tag)
				.addField("Removed:", user.tag)
				.addField("Date:", message.createdAt.toLocaleString())
			
				let lawdw = bot.channels.cache.get('627846724609769491')
				return lawdw.send(embeddw)
		
				} catch(err) {
					const embed33 = new MessageEmbed()
							.setDescription(`Something went wrong while logging this action, contact the developer of this bot!`)
							return message.channel.send(embed33);
				}
}
   }
}
}
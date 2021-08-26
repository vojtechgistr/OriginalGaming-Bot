const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { red_light } = require("../../colours.json");

module.exports = {
	config: {
	   name: "blacklist",
	   aliases: ["bl"],
	   category: "admins",
	},
   run: async (bot, message, args) => {

	const admin = db.fetch(`admin_${message.author.id}`);
	if(admin === null) {
		db.set(`admin_${message.author.id}`, "False");
	}

	if(!args[0]) {
		if(message.channel.type === "dm") return;
      const admin = db.get(`admin_${message.author.id}`);
      if(admin === null) {
        db.set(`admin_${message.author.id}`, "False");
      }
    
        if(admin === "False") return message.react('❌');
        
        if(admin === "True") {

          let bl = db.get("blacklistedusers");
          if(bl === null) {
            bl = "Nobody is blacklisted";
            let embed = new MessageEmbed()
            .addField('List of users that are blacklisted:', bl, false)
            .setColor("#000");
            return message.channel.send(embed);
          } else {
            let string = "";
            bl.forEach(blacklisted => {
              let member = bot.users.cache.get(blacklisted.user);
              if(member === undefined) member = "-"
              string += ` \n<:Blacklist:786913689331564565>` + member.tag + ` **[**${blacklisted.user}**]**` + '\n';
            });
            let embed2 = new MessageEmbed()
            .addField(`List of users that are blacklisted:`, string, false)
            .setColor("#000")
        
            return message.channel.send(embed2)
          }

            
    }
	}

	if (admin === "False") return message.react('❌');

	if (admin === "True") {
		let user = bot.users.cache.get(args[0]);
		if(!user) return message.channel.send(`Please provide valid user id`);
		if(user.bot) return message.channel.send(`You cannot blacklist a bot..`)
		if(user === admin) {
			return message.channel.send(`Bro.. this user is admin!`);
		}
		if(user.id === message.author.id) {
			return message.channel.send(`You cannot blacklist yourself..`);
		}
		let blacklist = await db.fetch(`blacklist_${user.id}`);
		if(blacklist === null) db.set(`blacklist_${user.id}`, "Not");

		if(blacklist === "Blacklisted") {
			let embed = new MessageEmbed()
				.setDescription(`${user.tag} is already blacklisted!`)
				.setColor('#000000')
				.setTimestamp();
			return message.channel.send(embed)
		}

		if(blacklist === "Not") {
			db.set(`blacklist_${user.id}`, "Blacklisted");

			let embed = new MessageEmbed()
				.setDescription(`${user.tag} has been blacklisted!`)
				.setColor('#000000')
				.setFooter(`By admin: ${message.author.tag}`)
				.setTimestamp();
			message.channel.send(embed);

			db.push("blacklistedusers", {
				user: user.id
			});
			return;

		} else {
		db.set(`blacklist_${user.id}`, "Blacklisted");
			let embed = new MessageEmbed()
				.setDescription(`${user.tag} has been blacklisted!`)
				.setColor('#000000')
				.setFooter(`By admin: ${message.author.tag}`)
				.setTimestamp();
			message.channel.send(embed);

			db.push("blacklistedusers", {
				user: user.id
			});

			try {

				let embeddw = new MessageEmbed()
				.setColor(red_light)
				.setAuthor(`Modlogs`)
				.setThumbnail(message.guild.iconURL())
				.addField("Moderation:", "Added to Blacklist")
				.addField("Executed by:", message.author.tag)
				.addField("Added:", user.tag)
				.addField("Date:", message.createdAt.toLocaleString())
			
				let lawdw = bot.channels.cache.get('627846724609769491')
				return lawdw.send(embeddw)
		
				} catch(err) {
					console.log(err)
					const embed33 = new MessageEmbed()
							.setDescription(`Something went wrong while logging this action, contact the developer of this bot!`)
							return message.channel.send(embed33);
				}
	}
}
}
}
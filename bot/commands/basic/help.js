const { MessageEmbed } = require("discord.js")
const { default_prefix } = require("../../botconfig.json");
const db = require('quick.db');
require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "help",
        usage: "-help",
        category: "basic",
        accessableby: "Members",
    },
    run: async (bot, message, args) => {

        const mana = bot.emojis.cache.get('627845086851629056');
        const admin = db.get(`admin_${message.author.id}`);

        if(admin === null) {
            db.set(`admin_${message.author.id}`, "False");
          }
        
            if(admin === "False") {
                const em = new MessageEmbed()
                .setTitle('Command list')
                .setColor("#e4b400")
                .setDescription(`Bot's prefix is currently \`${default_prefix}\``)
                .addField(`:pager: General`, '`help`, `uptime`, `support`, `server-info`, `thanksto`, `about`, `ping`, `user-info`')
                .addField(`:rofl: Fun`, '`8ball`, `embed`, `say`, `rps`, `karma`')
                .addField(`${mana} Economy`, '`balance`, `blackjack`, `journey`, `daily`, `deposit`, `withdraw`, `pay`, `rob`, `fish`')
                .addField(`:crown: Moderation`, '`ban`, `unban`, `kick`, `lock`, `unlock`, `mutevoice`/`mv`, `unmutevoice`/`unmv`, `slowmode`, `clear`, `notice`, `giveaway`')
                return message.inlineReply(em);
            }
            
            if(admin === "True") {
                const em = new MessageEmbed()
                .setTitle('Command list')
                .setColor("#e4b400")
                .setDescription(`Bot's prefix is currently \`${default_prefix}\``)
                .addField(`:pager: General`, '`help`, `uptime`, `support`, `server-info`, `thanksto`, `about`, `ping`, `user-info`')
                .addField(`:rofl: Fun`, '`8ball`, `embed`, `say`, `rps`, `karma`')
                .addField(`${mana} Economy`, '`balance`, `blackjack`, `journey`, `daily`, `deposit`, `withdraw`, `pay`, `rob`, `fish`')
                .addField(`:crown: Moderation`, '`ban`, `unban`, `kick`, `lock`, `unlock`, `mutevoice`/`mv`, `unmutevoice`/`unmv`, `slowmode`, `clear`, `notice`, `giveaway`')
                message.inlineReply(em);

            try {
                const em = new MessageEmbed()
                .setTitle('Command list')
                .setColor("#e4b400")
                .setDescription(`Bot's prefix is currently \`${default_prefix}\``)
                .addField(`:pager: General`, '`help`, `uptime`, `support`, `server-info`, `thanksto`, `about`, `ping`, `user-info`')
                .addField(`:rofl: Fun`, '`8ball`, `embed`, `say`, `rps`, `karma`')
                .addField(`${mana} Economy`, '`balance`, `blackjack`, `journey`, `daily`, `deposit`, `withdraw`, `pay`, `rob`, `fish`')
                .addField(`:crown: Moderation`, '`ban`, `unban`, `kick`, `lock`, `unlock`, `mutevoice`/`mv`, `unmutevoice`/`unmv`, `slowmode`, `clear`, `notice`, `giveaway`')
                .addField(`:wrench: Admin`, '`addadmin`, `removeadmin`, `blacklist`, `unblacklist`, `blacklisted`, `eval`, `reloadcmd`')
                return message.author.send(em).catch(e => {});
            } catch(err) {}
        }
    }
   
}

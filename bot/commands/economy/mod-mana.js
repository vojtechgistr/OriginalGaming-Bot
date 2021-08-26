const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { default_prefix } = require('../../botconfig.json')

module.exports = {
    config: {
        name: "mod-mana",
        category: "economy",
        aliases: ["modmana"],
        accessableby: "Administrators",
    },
    run: async (bot, message, args) => {



        if(args[0] === "reset") {
            let user = message.guild.members.cache.get(args[1]);

            if(!args[0]) return message.channel.send(`Please provide a valid member ID..`)
            
            if(!user) return message.channel.send(`Sorry, but I can't find this user..`)

            if(user.bot) return message.channel.send(`Bots can't be part of this economy!`);

    
            const embed2 = new MessageEmbed()
            .setTitle(':X: Error :X:')
            .setDescription("You don't have enough permissions to do this command. \n - Required permission -> ``ADMINISTRATOR``")
            .setColor(0xd12828)
    
        if(!message.member.hasPermission(["ADMINISTRATOR"])) {
            message.channel.send(embed2)
            .then(m => m.delete({ timeout: 10000 }));
            return message.delete({ timeout: 10000 });
        }


            let bal = await db.fetch(`money_${user.id}`)
            if(bal === null) bal = 0;
            let bank = await db.fetch(`bank_${user.id}`)
            if(bank === null) bank = 0;

            await db.set(`money_${user.id}`, 0)
            await db.set(`bank_${user.id}`, 0)

            message.channel.send(`Mana for user [ ${user.user.tag} ] was successfully reseted <:agree:782705809142448159>`)

        } else if(args[0] === "set") {
            if(!args[1]) return message.channel.send(`Please provide a valid member ID..`)

            let user = message.guild.members.cache.get(args[1]);

            if(!user) return message.channel.send(`Sorry, but I can't find this user..`)

            if(isNaN(args[2])) return message.channel.send(`Please enter valid amount of the mana.`)
            if(args[2] < 0) return message.channel.send(`Please enter valid amount of the mana.`)
            if(args[2] > 10000000) return message.channel.send(`Please enter valid amount of the mana. Maximum is 10 000 000<:Mana:627845086851629056> mana`)

            let bal = await db.fetch(`money_${user.id}`)
            if(bal === null) bal = 0;
            let bank = await db.fetch(`bank_${user.id}`)
            if(bank === null) bank = 0;

            if(args[3] === "bank") {
                await db.set(`bank_${user.id}`, parseInt(args[2]))
                return message.channel.send(`Mana in **Bank** for user [ ${user.user.tag} ] was successfully set to ${args[2]} <:agree:782705809142448159>`)


            } else if(args[3] === "wallet") {
                await db.set(`money_${user.id}`, parseInt(args[2]))
                return message.channel.send(`Mana in **Wallet** for user [ ${user.user.tag} ] was successfully set to ${args[2]} <:agree:782705809142448159>`)


            }
         } else if(args[0] === "add") {
                if(!args[1]) return message.channel.send(`Please provide a valid member ID..`)
    
                let user = message.guild.members.cache.get(args[1]);


                if(!user) return message.channel.send(`Sorry, but I can't find this user..`)
    
                let bal = await db.fetch(`money_${user.id}`)
                if(bal === null) bal = 0;
                let bank = await db.fetch(`bank_${user.id}`)
                if(bank === null) bank = 0;

                if(isNaN(args[2])) return message.channel.send(`Please enter valid amount of the mana.`)
                if(args[2] < 0) return message.channel.send(`Please enter valid amount of the mana.`)
                if(args[2] > 10000000) return message.channel.send(`Please enter valid amount of the mana. Maximum is 10 000 000<:Mana:627845086851629056> mana`)

                if((bank + bal) > 10000000) return message.channel.send(`Please enter valid amount of the mana. Maximum mana per user is 10 000 000<:Mana:627845086851629056>`)

    
                if(args[3] === "bank") {
                    await db.add(`bank_${user.id}`, parseInt(args[2]))
                    return message.channel.send(`Successfully added ${args[2]}<:Mana:627845086851629056> to the user's **Bank** [ ${user.user.tag} ] <:agree:782705809142448159>`)
    
    
                } else if(args[3] === "wallet") {
                    await db.add(`money_${user.id}`, parseInt(args[2]))
                    return message.channel.send(`Successfully added ${args[2]}<:Mana:627845086851629056> to the user's **Wallet** [ ${user.user.tag} ] <:agree:782705809142448159>`)
    
    
                } else {
                return message.channel.send(`**Command Usage:**\n\`${default_prefix}mod-mana [reset | set | add | remove] [user] [amount of mana if it's required] [bank | wallet]\``)
            }

        } else if(args[0] === "remove") {
            if(!args[1]) return message.channel.send(`Please provide a valid member ID..`)

            let user = message.guild.members.cache.get(args[1]);

            if(!user) return message.channel.send(`Sorry, but I can't find this user..`)


            let bal = await db.fetch(`money_${user.user.id}`)
            if(bal === null) bal = 0;
            let bank = await db.fetch(`bank_${user.user.id}`)
            if(bank === null) bank = 0;


            if(isNaN(args[2])) return message.channel.send(`Please enter valid amount of the mana.`)
            if(args[2] < 0) return message.channel.send(`Please enter valid amount of the mana.`)
            if(args[2] > 10000000) return message.channel.send(`Please enter valid amount of the mana. Maximum is 10 000 000<:Mana:627845086851629056> mana`)

            //if((bal + bank) < 0) return message.channel.send(`Please enter valid amount of the mana. Minimum is 0<:Mana:627845086851629056> mana`)
            if((bank + bal) < args[2]) return message.channel.send(`Please enter valid amount of the mana. Minimum is 0<:Mana:627845086851629056> mana`);
            

            if(args[3] === "bank") {
                await db.add(`bank_${user.id}`, parseInt(args[2]) - parseInt(args[2]) - parseInt(args[2]))
                return message.channel.send(`Mana in **Bank** for user [ ${user.user.tag} ] was reduced by ${args[2]}<:Mana:627845086851629056> mana <:agree:782705809142448159>`)


            } else if(args[3] === "wallet") {
                await db.add(`money_${user.id}`, parseInt(args[2]) - parseInt(args[2]) - parseInt(args[2]))
                return message.channel.send(`Mana in **Wallet** for user [ ${user.user.tag} ] was reduced by ${args[2]}<:Mana:627845086851629056> mana <:agree:782705809142448159>`)


            }
         } else {
            return message.channel.send(`**Command Usage:**\n\`${default_prefix}mod-mana [reset | set | add | remove] [user] [amount of mana if it's required] [bank | wallet]\``)
        }
    }
    
}
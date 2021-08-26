const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { ec } = require('../../colours.json');
const ms = require('parse-ms');
const { default_prefix } = require('../../botconfig.json')

require("../../ExtendedMessage");

module.exports = {
    config: {
        name: "slots",
        category: "economy",
        accessableby: "Members",
        aliases: ["slot", "mmultislot", "multislots"],
    },
    run: async (bot, message, args) => {
         let timeout = 17000;
        
         let slot = await db.fetch(`slots_${message.author.id}`)

        if(slot != null && timeout - (Date.now() - slot) > 0) {
            let time = ms(timeout - (Date.now() - slot));
            return message.inlineReply(`**Calm down!** You have to wait **${time.seconds}** more seconds to use this command again.`);

        } else {

        let slots = ["🍒", "❔", "💰", ":coin:", "🔔", "💠", "<:Mana:627845086851629056>"];

        if(args[0] === "chart") {
            return message.inlineReply(`**__Win Chart__**\n2 × 🍒 **->** 1 \n2 × ❔ **->** 1 \n2 × 💰 **->** 2 \n2 × :coin: **->** 2 \n2 × 🔔 **->** 2 \n2 × 💠 **->** 2 \n2 × <:Mana:627845086851629056> **->** 3\n\n3 × 🍒 **->** 3 \n3 × ❔ **->** 3 \n3 × 💰 **->** 3 \n3 × :coin: **->** 5 \n3 × 🔔 **->** 5 \n3 × 💠 **->** 5 \n3 × <:Mana:627845086851629056> **->** 10\n4 × <:Mana:627845086851629056> **->** 1000`)
        }
        
        let bal = await db.fetch(`money_${message.author.id}`)
        if(bal === null) bal = 0;

        let bank = await db.fetch(`bank_${message.author.id}`)
        if(bank === null) bank = 0;

        if (isNaN(args[0]) || parseInt(args[0]) < 0) return message.inlineReply(`Please place a bet! The bet must be higher than 100<:Mana:627845086851629056> mana.\n**Usage ->** \`${default_prefix}slots [amount of mana / chart]\``)


        if(bal < args[0]) return message.inlineReply(`You can't generate money, dumbass! Make some money first and then you can place a bet..`);
        if(args[0] < 50) {
            return message.inlineReply(`The bet must be higher than 50<:Mana:627845086851629056> mana! If you don't have enough mana you can start working.`);
        }

        if(!args[0]) return message.inlineReply(`Please place a bet! The bet must be higher than 50<:Mana:627845086851629056> mana.\n**Usage ->** \`${default_prefix}slots [amount of mana / chart]\``)
        

        if(args[0] > 1000) return message.inlineReply(`The bet must be lower than 1000<:Mana:627845086851629056> mana!`)


        db.set(`slots_${message.guild.id}_${message.author.id}`, Date.now());

        let bet = parseInt(args[0]);

        let result1 = Math.floor((Math.random() * slots.length));
        let result2 = Math.floor((Math.random() * slots.length));
        let result3 = Math.floor((Math.random() * slots.length));

        let result4 = Math.floor((Math.random() * slots.length));
        let result5 = Math.floor((Math.random() * slots.length));
        let result6 = Math.floor((Math.random() * slots.length));
        let result7 = Math.floor((Math.random() * slots.length));
        let result8 = Math.floor((Math.random() * slots.length));
        let result9 = Math.floor((Math.random() * slots.length));

      db.set(`slots_${message.author.id}`, Date.now());

      if(result1 === result2 && result1 === result3) {
         if(slots[result1] === "🍒") {
            bet *= 3
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "❔") {
            bet *= 3
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "💰") {
            bet *= 3
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === ":coin:") {
            bet *= 5
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "🔔") {
            bet *= 5
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "💠") {
            bet *= 5
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "<:Mana:627845086851629056>") {
            bet *= 10
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         }
      }
      else if(result1 === result2 || result1 === result3 || result2 === result3) {
         if(slots[result1] === "🍒" || slots[result2] === "🍒") {
            bet += bet
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "❔" || slots[result2] === "❔") {
            bet += bet
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "💰" || slots[result2] === "💰") {
            bet += bet
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === ":coin:" || slots[result2] === ":coin:") {
            bet += bet
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "🔔" || slots[result2] === "🔔") {
            bet += bet
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if(slots[result1] === "💠" || slots[result2] === "💠") {
            bet += bet
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else if (slots[result1] === "<:Mana:627845086851629056>" || slots[result2] === "<:Mana:627845086851629056>") {
            bet += bet
            let embed2 = new MessageEmbed()
                   .setTitle(':slot_machine: Slots :slot_machine:')
                   .setDescription(`| =${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| =${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou won ${bet}<:Mana:627845086851629056>!`)
                   .setColor(ec)
                message.inlineReply(embed2);
                return db.add(`money_${message.author.id}`, bet);
         } else {
            message.channel.send("bruh error")
            message.channel.send(result1)
            message.channel.send(result2)
            message.channel.send(result3)

         }
      } else {
         let embed4 = new MessageEmbed()
            .setTitle(':slot_machine: Slots :slot_machine:')
            .setDescription(`| = ${slots[result8]} ${slots[result9]} ${slots[result4]} = |\n| **>**  ${slots[result1]} ${slots[result2]} ${slots[result3]} **<**  |\n| = ${slots[result5]} ${slots[result6]} ${slots[result7]} = |\n\nYou lost ${bet}<:Mana:627845086851629056>!`)
            .setColor(ec)
      message.inlineReply(embed4);
      return db.add(`money_${message.author.id}`, bet * -1);
      }
   }
}
}
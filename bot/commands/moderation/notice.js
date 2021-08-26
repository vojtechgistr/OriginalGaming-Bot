const prompts = [
    "What title do you want to set?",
    "What description do you to want to set?",
    "What color do you want to set (hexademical) ?",
];

const Discord = require('discord.js');
let embed = new Discord.MessageEmbed();
const config = require('../../botconfig.json')

module.exports = {
    config: {
        name: "notice",
        usage: "-notice",
        category: "basic",
        accessableby: "Members",
    },
    run: async (bot, message, args) => {
        let chan = message.mentions.channels.first();
        if(!args[0]) {
            return message.channel.send(`Where should I post this notice? Please use this format of the command:\n\`-notice #channel\``)
        }
        if(!chan) return message.channel.send("I can't find this channel.. Try it again");
        else {

        const response = await getResponses(message);
        
        embed.setTitle(response.title)
        embed.setDescription(response.description)
        embed.setColor(`${response.color}`)

        
        const msg = await chan.send(embed);
 
        }
        
        async function getResponses(message) {
            const responses = { }
               
             for(let i = 0; i < prompts.length; i++) {
               await message.channel.send(prompts[i]);
               const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 });
               const { content } = response.first();

               if(i === 0) responses.title = content;
               else if(i === 1) responses.description = content;
               else if(i === 2) responses.color = content;
           }
           return responses;
           }
    }
    

}


const { MessageEmbed, Message } = require("discord.js")
const { gold } = require("../../colours.json");
const db = require("quick.db")
const { promptMessage } = require("../../functions.js");

const chooseArr = ["🪨", "📄", "✂️"]

module.exports = {
    config: {
        name: "rps",
        usage: "-rps",
        category: "fun",
        aliases: ["rockpaperscissors", "rock-paper-scissors"],
        accessableby: "Members",
    },

    run: async (bot, message, args) => {
        if(message.channel.type === "dm") return;

        const embed = new MessageEmbed()
            .setTitle("Rock, Paper, Scissors!")
            .setColor('#ffffff')
            .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL())
            .setDescription("Add a reaction to one of these emojis to play the game!")
            .setTimestamp();

        const m = await message.channel.send(embed);
        const reacted = await promptMessage(m, message.author, 30, chooseArr);

        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

        const result = await getResult(reacted, botChoice);
        await m.reactions.removeAll();

        embed.setDescription("").addField(result, `${reacted}  vs  ${botChoice}`)

        m.edit(embed);

        function getResult(me, clientChosen) {
            if((me === "🪨" && clientChosen === "✂️") ||
            (me === "📄" && clientChosen === "🪨") ||
            (me === "✂️" && clientChosen === "📄")) {
                return "You won!";
            } else if(me === clientChosen) {
                return "It's a tie!";
            } else {
                return "You lost!";
            }

        }
        
    }
}
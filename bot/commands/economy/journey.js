
const { MessageEmbed } = require("discord.js")
const { default_prefix } = require("../../botconfig.json");
const db = require('quick.db');
const { ec, red_light, green_light } = require('../../colours.json');
require("../../ExtendedMessage");
const config = require('../../botconfig.json')
const ms = require('parse-ms');

const bonus = [
    "You are really super lucky and you met me, owner of this bot and king of this world, I found, you are a really nice person and I doubled up all your current mana. Enjoy, because you won a jackpot with this one journey!!!",
    "You crazy motherf*cker! You tried to kill me and steal this bot! But it's impossible to kill me, you silly. Your bad, you lost 75% of all your mana to respawn yourself, bad day for you."
]
const plus = [
    "Are you playing this game on the toilet? This seems like the type of game that is perfect to play on the toilet.",
    "A knight standing on a box challenges you to a battle. You decide to not engage because he has the higher ground.",
    "A little girl dressed in all black with a snow on boots, came from Crazy Moutains to give you a wonderfull bag full of gold made of colors of rainbow and her brushes.",
    "You've been reading a book about anti-gravity. It's impossible to put down.",
    "You won the lottery, but it was for poor people.",
    "You lay on the floor to relax and let your mind wander. It didn't come back.",
    "Write the command again. Do it. Wonder how much time you've spent on this game instead of contributing to society. However, on second thought society isn't so great. Do as you will.",
    "You see an odd shaped cactus in the shadows as you travel the night. It creeps up to someone else with it's dark, square shaped eyes, hisses, and explodes. You decide to stay away from those, as it might be a good idea.",
    "You come across the most beautiful girl you have ever laid your eyes on. Truly a body sculpted by the gods themselves. You are about to say hello, until you realise she is wearing socks with her sandals. You run away.",
    "You are walking down a path surrounded by trees and you get ambushed by a bandit. You attack the bandit and you manage to defeat him. Well done!",
    "A marked transport carriage passes by you. It has the markings of a prisoner or slave transport carriage. You hear what sounds like a loud scream come from the inside of the transport and then silence.",
    "Some magicians can walk on water. You can swim on land.",
    "I hope this game becomes popular. If it does, I'll be jetting my way towards the Bahamas and leaving all of these suckers behi.. whoops... note to myself: don't use journey texts as a developer log.",
    "On your way to the village, you caught a lizard. You then walked up to a merchant and told them it was a very rare baby dragon. They believed you, somehow, and gave you a flask of Mana.",
    "Dev note #420: I'm in the Bahamas. I've made it. I've finally made it. See you nerds bahaha!",
    "The way I see it, every life is a pile of good things and bad things. The good things don't always soften the bad things, but vice-versa, the bad things don't necessarily spoil the good things and make them unimportant.",
    `You've been cursed with Smash Mouth's song "All Star". Whenever you enter through doors, gates, etc. the song will start to play. This makes you unable to be stealthy, but at least you now have some kick-ass music playing to your rampaging.`,
    "You think football would become an even better game if someone could invent a ball that kicks back.",
    "The man hands you a map with directions on how to get to the bandit camp. You make your way towards there and successfully manage to defeat the bandits and save the villagers. They all come together and decide to create a statue of you in the centre of their town.",
    "You go into a dungeon to fight a dragon. Poor dragon, what did he ever do to you?",
    `You walked into what seems to be a party of travellers as they were preparing to raid a dungeon crawling with monsters. You were chatting with them idly wishing them well on their quest when one of the travellers started running towards dungeon screaming, "LEROOOOY JEEEEENKIIINS!"`,
    "While helping the local villagers dig a new well, your shovel strikes something metallic. You brush away the dirt and find an ancient rusty broad sword. You picked it up and sold it for a good amount of mana.",
    "You helped someone named Jack, off their horse.",
    "You come across a bag of coins. Upon inspection, they were actually chocolate coins. But after inspecting even closer, you find out that they are just chocolate-coated gold coins! You lick the chocolate away and put the coins in your pocket.",
    "You encounter a demonic menace. Your mouth drops to the dirty yet cold floor. As beetles start crawling up your sleeves. You look up and acknowledge a hanging corpse above you. You become aware that within the corpse's mouth lays a hidden treasure.",
]

const minus = [
    `You are walking in a village and meet a man of a peculiar appearance. You approach the man curiously and ask for his name. The man subtly turns his attention to you and shouts "I am John Cena." after such an act, the man holds his waist and knocks you down with a blow to break your bones.`,
    "When people brokenly speak a second language they sound less intelligent but are actually more knowledgeable than most for being able to speak a second language at all. However, this does not apply to you. You could speak 10 languages and still be an idiot.",
    `You will never forget your sons first words. "Where the heck have you been for 16 years?"`,
    "You fell in lava while fighting with skeleton.",
    "You realise you forgot to count your steps. Go home and start over again.",
    "You tripped over a pine-cone and died."
]
module.exports = {
    config: {
        name: "journey",
        usage: "-journey",
        category: "economy",
        accessableby: "Members",
    },
    run: async (bot, message, args) => {
        let timeout = 60000;

        let journey = await db.fetch(`journey_${message.author.id}`)

        if(journey != null && timeout - (Date.now() - journey) > 0) {
            let time = ms(timeout - (Date.now() - journey));
            return message.inlineReply(`**Calm down!** You have to wait **${time.seconds}** more seconds to use this command again.`);

        } else {

            let bal = await db.fetch(`money_${message.author.id}`)
            if(bal === null) bal = 0;
    
            let bank = await db.fetch(`bank_${message.author.id}`)
            if(bank === null) bank = 0;

            const embed = new MessageEmbed()
            .setTitle('Journey')

            if(bal < 100) return message.inlineReply(`You can't generate money, dumbass! Make some money first.`);
            
            
            let section = random(1, 100)
            if(section == 29) {
                db.set(`journey_${message.author.id}`, Date.now());
                let bonusSection = random(0, 1)

                if(bonusSection == 0) {
                    let gainedBonus = Math.round(bal*1.5)
                    embed.setColor('0x00FF00')
                    embed.setDescription(bonus[0] + `\n\n**You gained ${gainedBonus} <:Mana:627845086851629056>**\n**All mana in your wallet has been doubled.** *This is a jackpot! Send us a screen on the support server to be put in the hall of fame!*`)
                    message.inlineReply(embed)
                    return db.add(`money_${message.author.id}`, gainedBonus);
                } else {
                    let lostBonus = Math.round(bal*0.25)
                    embed.setColor('0xFF0000')
                    embed.setDescription(bonus[1] + `\n\n**You lost ${lostBonus} <:Mana:627845086851629056>**\n**You lost 75% of all your mana.** *This is a jackpot! Send us a screen on the support server to be put in the hall of fame!*`)
                    message.inlineReply(embed)
                    return db.add(`money_${message.author.id}`, lostBonus);
                }
            

            } else if(section > 29 && section != 29) {
                db.set(`journey_${message.author.id}`, Date.now());
                let num = random(0, plus.length-1)
                let gained = random(100, 1000)

                if(plus[num] == undefined) {
                    embed.setDescription(plus[1] + `\n\n**You gained ${gained} <:Mana:627845086851629056>**`)
                } else {
                    embed.setDescription(plus[num] + `\n\n**You gained ${gained} <:Mana:627845086851629056>**`)
                }

                embed.setDescription(plus[num] + `\n\n**You gained ${gained} <:Mana:627845086851629056>**`)
                embed.setColor('0xB2FF66')
                message.inlineReply(embed)
                return db.add(`money_${message.author.id}`, gained);

            } else if(section < 29 && section != 29) {
                db.set(`journey_${message.author.id}`, Date.now());
                let num = random(0, minus.length-1)
                let lost = random(100, 5000)
                if(lost > bal) {
                    lost = bal
                }

                if(minus[num] == undefined) {
                    embed.setDescription(minus[1] + `\n\n**You lost ${lost} <:Mana:627845086851629056>**`)
                } else {
                    embed.setDescription(minus[num] + `\n\n**You lost ${lost} <:Mana:627845086851629056>**`)
                }

                
                embed.setColor('0xFF3333')
                message.inlineReply(embed)
                return db.add(`money_${message.author.id}`, lost*-1);

            }
        }
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

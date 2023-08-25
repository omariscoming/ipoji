const axios = require('axios')
const emojiFlags = require('emoji-flags')
const {Telegraf} = require('telegraf')
const LocalSession = require('telegraf-session-local')
const token = 'YOUR_BOT_TOKEN_HERE'

const bot = new Telegraf(token)

bot.use((new LocalSession({database: 'ipLocation.json'})).middleware())
bot.command('github', (ctx)=>{

    const linkUrl = 'https://github.com/omariscoming/ipoji';
    ctx.replyWithHTML(`<a href="${linkUrl}">Our Github</a>`);
})
bot.start(ctx=>{
    ctx.session.step = 'getIP';
    ctx.reply('Send me your IP:')
})
bot.on('text', async ctx => {
    if (ctx.session.step === 'getIP') {
        const ip = ctx.message.text
        const emoji = await getEmoji(ip)
        if (emoji){
            await ctx.reply(emoji.emoji)
            ctx.reply('Send me your IP')
        }else{
            await ctx.reply('Not Found')
            await ctx.reply('Send a Correct Ip')
        }
    }else{
        return
    }
})
bot.launch()
async function getEmoji(ip) {
    const endPoint = 'http://ip-api.com/json/'
    const response = await axios.get(endPoint + `${ip}?fields=countryCode`)
    try {
        const result = await response.data.countryCode
        const emoji = await emojiFlags.countryCode(result)
        return emoji
    }catch (error){
        console.log(error)
    }
}

const { Client, Intents } = require('discord.js');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

//Environmental variables, see .env example
const BakaURL = process.env.BakaURL;        //URL to your Bakalari Timetable (https://YOUR_SCHOOL.bakalari.cz/login?ReturnUrl=/Timetable/Public/Actual/Class/YOUR_CLASS)
const BakaUser = process.env.BakaUser;      //Your username
const BakaPass = process.env.BakaPass;      //Your password
const BotToken = process.env.BotToken;      //Discord bot token
const ChannelID = process.env.ChannelID;    //ID of channel you want to send notifications to
const RoleID = process.env.RoleID;          //ID of role that should be notified

let count = 0;          //number of substituted classes
let previousCount = -1;  //previous number of substituted classes
let classes = "";       //Substituted classes

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

async function checkSupl() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = BakaURL;

    //Login
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluate((User, Pass) => {
        document.querySelector('input[id="username"]').value = User;
        document.querySelector('input[id="password"]').value = Pass;
    }, BakaUser, BakaPass);

    await Promise.all([
        page.click('button.btn-login'),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
    ])

    //Get page data
    let data = await page.evaluate(() => document.querySelector('*').outerHTML);
    let date = new Date();

    if (date.getHours == 0 && date.getDay() == 1) { //If it's midnight on Monday (Changing of timetables), reset previous count
        previousCount = count;
    }
    else {
        count = (data.match(/pink/g) || []).length; //count all substituted classes

        classes = "";
        data = data.split(/pink/g);
        data.shift();

        //Format all substitute data
        data.forEach(element => {
            let point = getPosition(element, "-", 2);
            let after = element.substring(point, element.length);
            let before = element.substring(0, point);

            let beforeIndex = before.lastIndexOf(";") + 1;
            let afterIndex = after.search("&quot;");

            after = after.substring(afterIndex, -1);
            before = before.substring(beforeIndex, before.length);

            let text = before + after;
            classes += text + "\n";
        });
    }

    if (count != previousCount && previousCount != -1) {
        const channel = client.channels.cache.get(ChannelID);
        channel.send(`<@&${RoleID}>\nNové suplování bylo přidáno na Bakaláře\n-----------------------------------------------\n${classes}`);
    }

    previousCount = count;

    await browser.close();
}

client.on('ready', () => {
    console.log(`Client ${client.user.tag} is logged in!`);

    checkSupl();

    setInterval(() => {
        checkSupl();
    }, 1000 * 60 * 60)
});

client.login(BotToken).then(() => {
    client.user.setPresence({ activities: [{ name: 'Suplování', type: 'WATCHING' }], status: 'online' });
});

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}
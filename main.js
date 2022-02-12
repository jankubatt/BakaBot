const { Client, Intents } = require('discord.js');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

const { createLogger, format, transports } = require("winston");

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};
  
const logger = createLogger({
    levels: logLevels,
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console()],
});

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
    logger.info("Checking substitutions");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = BakaURL;

    //Login
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
        count = previousCount;
        classes = "";
        logger.info("It's monday midnight. Not checking.");
    }
    else {
        logger.info("Processing data");
        count = (data.match(/pink/g) || []).length; //count all substituted classes

        classes = "";
        data = data.split(/pink/g);
        data.shift();

        //Format all substitute data
        data.forEach(element => {
            let point = element.search(" - ");
            let after = element.substring(point, element.length);
            let before = element.substring(0, point);

            let beforeIndex = before.lastIndexOf(";") + 1;
            let afterIndex = after.search("&quot;");

            after = after.substring(afterIndex, -1);
            before = before.substring(beforeIndex, before.length);

            let text = before + after;

            if ((text.match(/\|/g) || []).length == 1) {
                text = "Hodina přesunuta | " + text;
            }

            classes += text + "\n";
        });
        
        logger.info("Done processing data");
    }

    if (count != previousCount && previousCount != -1) {
        logger.info("Sending message");
        const channel = client.channels.cache.get(ChannelID);
        channel.send(`<@&${RoleID}>\nNové suplování bylo přidáno na Bakaláře`);
    }

    previousCount = count;

    await browser.close();
}

client.on('ready', () => {
    logger.info(`Client ${client.user.tag} is logged in!`);

    checkSupl();

    //Interval for break checking (Edit this, if you have different times of breaks in school)
    setInterval(() => {
        let date = new Date();

        if (date.getHours() == 8 && date.getMinutes() == 0) {
            checkSupl();
        }
        else if (date.getHours() == 8 && date.getMinutes() == 45) {
            checkSupl();
        }
        else if (date.getHours() == 8 && date.getMinutes() == 55) {
            checkSupl();
        }
        else if (date.getHours() == 9 && date.getMinutes() == 40) {
            checkSupl();
        }
        else if (date.getHours() == 9 && date.getMinutes() == 50) {
            checkSupl();
        }
        else if (date.getHours() == 10 && date.getMinutes() == 35) {
            checkSupl();
        }
        else if (date.getHours() == 10 && date.getMinutes() == 50) {
            checkSupl();
        }
        else if (date.getHours() == 11 && date.getMinutes() == 35) {
            checkSupl();
        }
        else if (date.getHours() == 11 && date.getMinutes() == 45) {
            checkSupl();
        }
        else if (date.getHours() == 12 && date.getMinutes() == 30) {
            checkSupl();
        }
        else if (date.getHours() == 12 && date.getMinutes() == 40) {
            checkSupl();
        }
        else if (date.getHours() == 13 && date.getMinutes() == 25) {
            checkSupl();
        }
        else if (date.getHours() == 13 && date.getMinutes() == 35) {
            checkSupl();
        }
        else if (date.getHours() == 14 && date.getMinutes() == 20) {
            checkSupl();
        }

    }, 1000 * 60 * 2.5)

    //Interval for regular checking
    setInterval(() => {
        checkSupl();
    }, 1000 * 60 * 60)
});

client.on('messageCreate', (message) => {
    if (message.content === "/suplinfo") {
        message.reply({
            content: classes
        })
    }
  });

client.login(BotToken).then(() => {
    client.user.setPresence({ activities: [{ name: 'Suplování /suplinfo', type: 'WATCHING' }], status: 'online' });
});

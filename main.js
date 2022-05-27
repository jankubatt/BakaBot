/*
SETUP
 */

//CONSTANTS
const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
const he = require("he");
dotenv.config();

//VARIABLES
let accessToken;
let oldTimetable = [];
let timetable = [];

//Environmental variables, see .env example
const BakaURL = process.env.BakaURL;        //URL to your Bakalari Timetable (https://YOUR_SCHOOL.bakalari.cz/login?ReturnUrl=/Timetable/Public/Actual/Class/YOUR_CLASS)
const BakaUser = process.env.BakaUser;      //Your username
const BakaPass = process.env.BakaPass;      //Your password
const BotToken = process.env.BotToken;      //Discord bot token
const ChannelID = process.env.ChannelID;    //ID of channel you want to send notifications to
const RoleID = process.env.RoleID;          //ID of role that should be notified

//LOGGER
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

//AXIOS
const axios = require("axios");
const qs = require("qs");
const requestData = qs.stringify({
  "username": BakaUser,
  "password": BakaPass,
  "login": "" 
});

//CLIENT
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

/*
FUNCTIONS
 */

//Gets Bakalaris access token for login credentials
function getAccessToken(){
    logger.info(`Getting access token`);

    axios({
        method: "POST",
        url: "https://spsul.bakalari.cz/api/login",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: `client_id=ANDR&grant_type=password&username=${BakaUser}&password=${BakaPass}`
    }).then((res) => {
        accessToken = res.data.access_token;
    });
}

//Gets timetable data
function getTimetable(accessToken) {
    logger.info(`Getting timetable data`);

    axios({
        method: "GET",
        url: BakaURL,
        headers: {"Authorization": `Bearer ${accessToken}`},
        data: requestData
    }).then(function (res) {
        let data = res.data;   //Store data
        data = he.decode(data); //Decode data, that means translate html characters to normal ones
        data = data.split(`<div class="bk-timetable-cell"`);    //split it based on timetable cell
        data.shift();   //remove first element from array because its just html code that we don't want

        //Goes through all elements and fetches a json object from specified cell of bakalaris timetable
        data.forEach(element => {
            if (element.substring(element.indexOf("{"), element.indexOf("}")+1) !== "") {
                element = element.substring(element.indexOf("{"), element.indexOf("}")+1);
                element = JSON.parse(element);

                timetable.push(element);
            }
        });
    });
}

//Checks for substitution
async function checkSubstitution() {
    await getAccessToken();
    await getTimetable(accessToken);

    logger.info(`Checking substitutions`);

    if (timetable !== oldTimetable && oldTimetable.length > 0) {
        logger.info("Sending message");
        const channel = client.channels.cache.get(ChannelID);
        channel.send(`<@&${RoleID}>\nNové suplování bylo přidáno na Bakaláře`);
    }

    logger.info(`Done`);

    oldTimetable = timetable;
}

client.on('ready', () => {
    logger.info(`Client ${client.user.tag} is logged in!`);

    checkSubstitution();

    //Interval for break checking (Edit this, if you have different times of breaks in school)
    setInterval(() => {
        let date = new Date();

        if (date.getHours() === 8 && date.getMinutes() === 0) {
            checkSubstitution();
        }
        else if (date.getHours() === 8 && date.getMinutes() === 45) {
            checkSubstitution();
        }
        else if (date.getHours() === 8 && date.getMinutes() === 55) {
            checkSubstitution();
        }
        else if (date.getHours() === 9 && date.getMinutes() === 40) {
            checkSubstitution();
        }
        else if (date.getHours() === 9 && date.getMinutes() === 50) {
            checkSubstitution();
        }
        else if (date.getHours() === 10 && date.getMinutes() === 35) {
            checkSubstitution();
        }
        else if (date.getHours() === 10 && date.getMinutes() === 50) {
            checkSubstitution();
        }
        else if (date.getHours() === 11 && date.getMinutes() === 35) {
            checkSubstitution();
        }
        else if (date.getHours() === 11 && date.getMinutes() === 45) {
            checkSubstitution();
        }
        else if (date.getHours() === 12 && date.getMinutes() === 30) {
            checkSubstitution();
        }
        else if (date.getHours() === 12 && date.getMinutes() === 40) {
            checkSubstitution();
        }
        else if (date.getHours() === 13 && date.getMinutes() === 25) {
            checkSubstitution();
        }
        else if (date.getHours() === 13 && date.getMinutes() === 35) {
            checkSubstitution();
        }
        else if (date.getHours() === 14 && date.getMinutes() === 20) {
            checkSubstitution();
        }

    }, 1000 * 60 * 5)

    //Interval for regular checking
    setInterval(() => {
        checkSubstitution();
    }, 1000 * 60 * 0.5)
});

client.login(BotToken).then(() => {
    client.user.setPresence({ activities: [{ name: 'Suplování', type: 'WATCHING' }], status: 'online' });
});

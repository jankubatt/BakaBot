const { Client, Intents } = require('discord.js');
const looksSame = require('looks-same');
const fs = require('fs');
const puppeteer = require('puppeteer');
const jimp = require('jimp');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

async function checkSupl() {
  	const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const url = `https://spsul.bakalari.cz/login?ReturnUrl=/Timetable/Public/Actual/Class/2F`;
    
	await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
        document.querySelector('input[id="username"]').value = "jankubat";
        document.querySelector('input[id="password"]').value = "4Ajs0E8M";
    });
    
    await Promise.all([
        page.click('button.btn-login'),
        page.waitForNavigation({waitUntil: 'networkidle2'})
    ])
    await page.screenshot({ path: 'screenshot.png' });

    //const image = await jimp.read('screenshot.png');
    //await image.greyscale().write("screenshot.png");

    await looksSame('screenshot.png', 'screenshot_old.png', {tolerance: 50}, function(error, {equal}) {
      	if (equal) {
        	console.log("Same");
      	}
      	else {
        	console.log("different");
        	const channel = client.channels.cache.get('845595321953550337');
      		channel.send('@everyone Na bakalarich je supl');
      	}
    });

    fs.unlinkSync("screenshot_old.png");
    fs.renameSync("screenshot.png", "screenshot_old.png")

    await browser.close();
}

client.on('ready', () => {
  	console.log(`client ${client.user.tag} is logged in!`);

    checkSupl();

  	setInterval(() => {
    	checkSupl();
  	}, 1000*60*60)
});

client.login('NzQ5NjAwNTY5MTc3NjY5NjMy.X0uV7g.nFkBhL-FMMD-IpQ9Zw6JaRGyA4k').then(() => {
  	client.user.setPresence({ activities: [{ name: 'supl na bakalarich', type: 'WATCHING' }], status: 'online' });
});
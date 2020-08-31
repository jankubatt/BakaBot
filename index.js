const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NzQ5NjAwNTY5MTc3NjY5NjMy.X0uV7g.Tna0DF1G-pd440v1Ho42QYllRVg';

const prefix = '!B'

bot.on('ready', () => {
    console.log('Balin je online');
});

bot.on('message', message => { 
    let args = message.content.substring(prefix.length).split(" ");

    switch(args[0]) {
        case 'help':
            message.channel.send("```diff\n+ Prikazy\n- !Bhelp\n- !Binfo\n- !Btest\n```");
            break;
        case 'test':
            message.channel.send('Trivialni panove');
            break;

        case 'info':
            message.channel.send("```prolog\nBalinBot\n- Bot vytvoren pro ITB Discord\n- Kazdej ho muze upravovat\n```");
    }
});

bot.login(token);

const http = require('http');const port = process.env.PORT || 80;const server = http.createServer((req, res) => {res.statusCode = 200;res.setHeader('Content-Type', 'text/html');res.end('BalinBot is running');});server.listen(port,() => {console.log(`Server running at port `+port);});
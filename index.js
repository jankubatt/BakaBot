const Discord = require('discord.js');
const bot = new Discord.Client();

const ytdl = require('ytdl-core');

const token = 'NzQ5NjAwNTY5MTc3NjY5NjMy.X0uV7g.Tna0DF1G-pd440v1Ho42QYllRVg';

const prefix = '!B'

var servers = {};

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
            break;

        case 'play':

            function play(connection, message) {
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", () => {
                    if (server.queue[0]) {
                        play(connection, message);
                    }
                    else {
                        connection.disconnect();
                    }
                });
            }

            if (!args[1]) {
                message.channel.send("Daj mne link more!");
                return;
            }

            if (!message.member.voice.channel) {
                message.channel.send("Bez do nejakeho channelu ne?");
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voice.channel) message.member.voice.channel.join().then((connection) => {
                play(connection, message);
            })

            break;
    }
});

bot.login(token);

//heroku shit
const http = require('http');const port = process.env.PORT || 80;const server = http.createServer((req, res) => {res.statusCode = 200;res.setHeader('Content-Type', 'text/html');res.end('BalinBot is running');});server.listen(port,() => {console.log(`Server running at port `+port);});
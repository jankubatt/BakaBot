const Discord = require("discord.js");
const prefix = "!";
const token = "NzQ5NjAwNTY5MTc3NjY5NjMy.X0uV7g.Tna0DF1G-pd440v1Ho42QYllRVg";
const ytdl = require("ytdl-core");

const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
  console.log("Balin je online!");
});

client.once("reconnecting", () => {
  console.log("Obnovuji, připojeno!");
});

client.once("disconnect", () => {
  console.log("Odpojuji!");
});

// Event listener
client.on('guildMemberAdd', member => {
  // Send message to server 
  const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');r
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Dobrý den ${member}`);
});


client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } 
  
  else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  }
  
  else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } 
  
  else if (message.content.startsWith(`${prefix}test`)) {
    message.channel.send('Krásný triviální příklad');
  }
  else if (message.content.startsWith(`${prefix}help`)) {
    message.channel.send('!uptime, !play, !skip, !stop');
  }

else if (message.content.startsWith(`${prefix}test`)) {
message.channel.send('Krásný triviální příklad')
}
  
  else if (message.content.startsWith(`${prefix}uptime`)) {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${days} dní, ${hours} hodin, ${minutes} minut a ${seconds} sekund`;
    message.channel.send('Pánové, jsem aktivní' + uptime);
  }
  
  else {
    message.channel.send("Jestli to nenapíšeš správně, přestaneš být žákem této školy.");
  } 
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Panové, pokud chcete hudbu, běžte do voice channelu. "
    );

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Nemám práva, pánové!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} přidáno do řady`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Jestli chceš hudbu, běž do voice-channelu."
    );
  if (!serverQueue)
    return message.channel.send("Nemám co pustit.");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Buď jdi k tabuli nebo do voicu, protože nemám co pouštět."
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Hraje: **${song.title}**`);
}

client.login(token);
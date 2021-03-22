const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

const prefix = "*";

client.on("message", function(message) {
  //if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.delete();
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  else if (command === "create_project") {
    const name = ("Projet: ".concat(`${args[0]}`)).toUpperCase();
	  let myRole = message.guild.roles.cache.find(role => role.name === name);
    if (!myRole) {
	    message.guild.roles.create({data: {name: name, permissions: []}}).then(myRole => {
        message.guild.channels.create(name, {type: 'category', position: 1,
          permissionOverwrites: [
            {id: message.guild.id, deny: ['VIEW_CHANNEL']},
            {id: myRole.id, allow: ['VIEW_CHANNEL']}
          ]
        }).then(cat => {
          message.guild.channels.create('Description', {type: 'text', parent: cat})
          message.guild.channels.create('Compte Rendu', {type: 'text', parent: cat})
          message.guild.channels.create('Discussion', {type: 'text', parent: cat})
          message.guild.channels.create('Rendez vous', {type: 'text', parent: cat})
          message.guild.channels.create('Vocal', {type: "voice", parent: cat})
        });
      });
      message.channel.send(`Projet ${args[0]} créer avec succés`);
    } else {
      message.channel.send(`le Projet ${args[0]} existe déjà`);
    }
  }

  else if (command === "delete_project") {
    const name = "Projet: ".concat(`${args[0]}`).toUpperCase();
    message.delete();
    let myRole = message.guild.roles.cache.find(role => role.name === name);
    if (myRole) {
      let myCategory = message.guild.channels.cache.find(channel => channel.name === name);
      myCategory.children.forEach(channel => channel.delete());
      myCategory.delete();
      myRole.delete();
      message.channel.send(`Projet ${args[0]} suprimé avec succés`);
    } else {
      message.channel.send(`le Projet ${args[0]} n'existe pas`);
    }
  }
});

client.login(config.BOT_TOKEN);
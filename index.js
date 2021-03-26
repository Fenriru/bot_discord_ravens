const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

prefix = "*";

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
    message.delete();
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
      message.channel.send(`Projet ${args[0]} créé avec succès`);
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
      message.channel.send(`Projet ${args[0]} supprimé avec succès`);
    } else {
      message.channel.send(`le Projet ${args[0]} n'existe pas`);
    }
  }

  else if (command === "reaction_role") {
    const channel = message.channel;
    message.delete();
    if (args.length %2 != 0 || args.length == 0) {
      channel.send('wrong nbr of args: use *reaction_bot [emoji role_name]+');
    } else {
      msg = "";
      emojis = [];
      roles = [];
      for (i = 0; args[i]; i+= 2) {
        emojis[i/2] = args[i];
        roles[i/2] = message.guild.roles.cache.find(role => role.name === args[i+1]);
        msg = msg + args[i] + " : " + args[i+1] + "\n";
      }
      let embed = new Discord.MessageEmbed()
            .setColor('#e42643')
            .setTitle('react to get the role')
            .setDescription(msg);
      channel.send(embed).then(post => {
        emojis.forEach(elem => {
          post.react(elem);
        });
      });
      client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
        if (reaction.message.channel.id == channel) {
          can = false;
          i = 0;
          for (; emojis[i]; i++) {
            if (reaction.emoji.name === emojis[i]) {
              can = true;
              break;
            }
          }
          if (can) {
            console.log(roles[i]);
            await reaction.message.guild.members.cache.get(user.id).roles.add(roles[i]);
          }
        } else {
            return;
        }
    });
    client.on('messageReactionRemove', async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
        if (reaction.message.channel.id == channel) {
          can = false;
          i = 0;
          for (; emojis[i]; i++) {
            if (reaction.emoji.name === emojis[i]) {
              can = true;
              break;
            }
          }
          if (can) {
              await reaction.message.guild.members.cache.get(user.id).roles.remove(roles[i]);
          }
        } else {
            return;
        }
    });
    }
  }

  else if (command === "clear") {
    if (args.length != 1) return message.reply("Please enter the amount of messages to clear! and only that!");
    if (!args[0]) return message.reply("Please enter the amount of messages to clear!");
    if(isNaN(args[0])) return message.reply("Please type a real number!");
    if(args[0] > 100) return message.reply("You can't remove more than 100 messages!");
    if(args[0] < 1) return message.reply("You have to delete at least one message!");
    message.channel.messages.fetch({ limit: args[0]}).then(messages =>{ message.channel.bulkDelete(messages)});
  }

  else if (command === "prefix") {
    if (args.length != 1) return message.reply("Please enter the prefix you want to use and only that!");
    if (!args[0]) return message.reply("Please enter the prefix you want to use!");
    if (args[0].length != 1) return message.reply("Please enter a valid prefix! (length must be 1)");
    prefix = args[0];
    message.channel.send(`the new prefix is '${prefix}'`);
  }
});

client.login(config.BOT_TOKEN);